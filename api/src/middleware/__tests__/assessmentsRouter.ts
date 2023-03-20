import {
  itemEnvelope,
  errorEnvelope,
  collectionEnvelope,
} from '../responseEnvelope';
import { createAppAgentForRouter, mockPrincipalId } from '../routerTestUtils';
import assessmentsRouter from '../assessmentsRouter';
import {
  getProgramIdByProgramAssessmentId,
  findRoleInProgram,
  programAssessmentById,
  getCurriculumAssessmentById,
  submissionDetails,
  principalEnrolledPrograms,
  getAssessmentsForProgram,
  getAssessmentSubmissions,
  getFacilitatorAssessmentSubmissionsSummary,
  deleteAssessmentById,
} from '../../services/assessmentService';

import {
  CurriculumAssessment,
  AssessmentSubmissionsSummary,
  FacilitatorAssessmentSubmissionsSummary,
  AssessmentSummary,
  ProgramAssessment,
  SubmittedAssessment,
} from '../../../src/models';

jest.mock('../../services/assessmentService');

const mockPrincipalEnrolledPrograms = jest.mocked(principalEnrolledPrograms);
const mockFindRoleInProgram = jest.mocked(findRoleInProgram);
const mockGetAssessmentsForProgram = jest.mocked(getAssessmentsForProgram);
const mockGetCurriculumAssessmentById = jest.mocked(
  getCurriculumAssessmentById
);
const mockGetAssessmentSubmissionsSummary = jest.mocked(
  getAssessmentSubmissions
);
const mockGetFacilitatorAssessmentSubmissionsSummary = jest.mocked(
  getFacilitatorAssessmentSubmissionsSummary
);
const mockGetProgramIdByProgramAssessmentId = jest.mocked(
  getProgramIdByProgramAssessmentId
);
const mockProgramAssessmentById = jest.mocked(programAssessmentById);
const mockSubmissionDetails = jest.mocked(submissionDetails);
const mockDeleteAssessmentById = jest.mocked(deleteAssessmentById);

const programAssessmentId = 1;
const curriculumAssessmentId = 1;
const participantId = 2;
const curriculumAssessment: CurriculumAssessment = {
  id: curriculumAssessmentId,
  title: 'Assignment 1: React',
  description: 'Your assignment for week 1 learning.',
  max_score: 10,
  max_num_submissions: 3,
  time_limit: 120,
  curriculum_id: 3,
  activity_id: 97,
  principal_id: participantId,
};

const programAssessment: ProgramAssessment = {
  id: programAssessmentId,
  program_id: 1,
  assessment_id: curriculumAssessmentId,
  available_after: '2023-02-06',
  due_date: '2023-02-10',
};
const assessmentSubmissionsSummary: AssessmentSubmissionsSummary = {
  principal_id: participantId,
  highest_state: 'Graded',
  most_recent_submitted_date: '2023-02-09 13:23:45',
  total_num_submissions: 1,
  highest_score: 10,
};

const facilitatorAssessmentSubmissionsSummary: FacilitatorAssessmentSubmissionsSummary =
  {
    num_participants_with_submissions: 6,
    num_program_participants: 12,
    num_ungraded_submissions: 2,
  };

const emptyAssessmentsSummaryList: AssessmentSummary[] = [];

describe('assessmentsRouter', () => {
  const appAgent = createAppAgentForRouter(assessmentsRouter);
  const exampleAssessmentId = 1;
  const exampleSubmissionId = 1;

  describe('GET /', () => {
    const unenrolledPrincipalId = 4;
    const enrolledParticipantPrincipalId = 5;
    const facilitatorPrincipalId = 6;
    const programIds: number[] = [];
    const enrolledProgramsList = [1];

    it('should respond with an empty list for a user not enrolled in any programs', done => {
      mockPrincipalEnrolledPrograms.mockResolvedValue(programIds);

      appAgent
        .get('/')
        .expect(
          200,
          collectionEnvelope(emptyAssessmentsSummaryList, 0),
          err => {
            expect(mockPrincipalEnrolledPrograms).toHaveBeenCalledWith(
              unenrolledPrincipalId
            );
            done(err);
          }
        );
    });

    it('should respond with a list of all assessments (without questions) for participant enrolled in one program', done => {
      mockPrincipalId(enrolledParticipantPrincipalId);
      const participantAssessmentListResponse = [
        {
          curriculum_assessment: curriculumAssessment,
          program_assessment: programAssessment,
          submissions_summary: assessmentSubmissionsSummary,
        },
      ];
      // mock response from (function that gets a list of programs the user is enrolled in) to include one program
      mockPrincipalEnrolledPrograms.mockResolvedValue(enrolledProgramsList);
      // mock response from (call a function that returns the permission of the user for each program (participant/facilitator)) to respond with participant for that one program
      mockFindRoleInProgram.mockResolvedValue({ title: 'participant' });
      // mock response from (get a list of program assessments for each program the user is enrolled in) to respond with a list of program assessments
      mockGetAssessmentsForProgram.mockResolvedValue([programAssessment]);
      // mock responses from (get a list of curriculum assessments that correspond to each program assessment) to respond with the corresponding curriculum assessment for each program assessment in that previous list
      mockGetCurriculumAssessmentById.mockResolvedValue(curriculumAssessment);
      // mock responses from (call a (mock) function that gets the participant assessment summary for each program assessment where the user is a participant of that program) to respond with the assessment summary for every program assessment that participant has submitted for previously
      mockGetAssessmentSubmissionsSummary.mockResolvedValue(
        assessmentSubmissionsSummary
      );
      appAgent
        .get('/')
        .expect(
          200,
          collectionEnvelope(
            participantAssessmentListResponse,
            participantAssessmentListResponse.length
          ),
          err => {
            // call a (mock) function that gets a list of programs the user is enrolled in
            expect(mockPrincipalEnrolledPrograms).toHaveBeenCalledWith(
              enrolledParticipantPrincipalId
            );
            // call a function that returns the permission of the user for each program (participant/facilitator)
            expect(mockFindRoleInProgram).toHaveBeenCalledWith(
              enrolledParticipantPrincipalId,
              enrolledProgramsList[0]
            );
            //get a list of program assessments for each program the user is enrolled in) to respond with a list of program assessments
            expect(mockGetAssessmentsForProgram).toHaveBeenCalledWith(
              enrolledProgramsList[0]
            );
            // get a list of curriculum assessments that correspond to each program assessment
            expect(mockGetCurriculumAssessmentById).toHaveBeenCalledWith(
              programAssessment.assessment_id,
              false,
              false
            );
            // call a (mock) function that gets the participant assessment summary for each program assessment where the user is a participant of that program
            expect(mockGetAssessmentSubmissionsSummary).toHaveBeenCalledWith(
              programAssessment.id,
              enrolledParticipantPrincipalId
            );
            done(err);
          }
        );
    });

    it('should respond with a list of all assessments (without questions) for facilitator of one program', done => {
      mockPrincipalId(facilitatorPrincipalId);
      const facilitatorAssessmentListResponse = [
        {
          curriculum_assessment: curriculumAssessment,
          program_assessment: programAssessment,
          submissions_summary: facilitatorAssessmentSubmissionsSummary,
        },
      ];
      // mock response from (function that gets a list of programs the user is enrolled in) to include one program
      mockPrincipalEnrolledPrograms.mockResolvedValue(enrolledProgramsList);
      // mock response from (call a function that returns the permission of the user for each program (participant/facilitator)) to respond with facilitator for that one program
      mockFindRoleInProgram.mockResolvedValue({ title: 'facilitator' });
      // mock response from (get a list of program assessments for each program the user is enrolled in) to respond with a list of program assessments
      mockGetAssessmentsForProgram.mockResolvedValue([programAssessment]);
      // mock responses from (get a list of curriculum assessments that correspond to each program assessment) to respond with the corresponding curriculum assessment for each program assessment in that previous list
      mockGetCurriculumAssessmentById.mockResolvedValue(curriculumAssessment);
      // mock responses from (call a (mock) function that gets the facilitator assessment summary for each program assessment where the user is a facilitator of that program) to respond with the assessment summary for all participants for each program assessment
      mockGetFacilitatorAssessmentSubmissionsSummary.mockResolvedValue(
        facilitatorAssessmentSubmissionsSummary
      );
      appAgent
        .get('/')
        .expect(
          200,
          collectionEnvelope(
            facilitatorAssessmentListResponse,
            facilitatorAssessmentListResponse.length
          ),
          err => {
            // call a (mock) function that gets a list of programs the user is facilitating
            expect(mockPrincipalEnrolledPrograms).toHaveBeenCalledWith(
              facilitatorPrincipalId
            );
            // call a function that returns the permission of the user for each program (participant/facilitator)
            expect(mockFindRoleInProgram).toHaveBeenCalledWith(
              enrolledProgramsList[0],
              facilitatorPrincipalId
            );
            //get a list of program assessments for each program the user is enrolled in) to respond with a list of program assessments
            expect(mockGetAssessmentsForProgram).toBeCalledWith(
              enrolledProgramsList[0]
            );
            // get a list of curriculum assessments that correspond to each program assessment
            expect(mockGetCurriculumAssessmentById).toHaveBeenCalledWith(
              programAssessment.assessment_id,
              false,
              false
            );
            // call a (mock) function that gets the facilitator assessment summary for each program assessment where the user is a facilitator of that program
            expect(
              mockGetFacilitatorAssessmentSubmissionsSummary
            ).toHaveBeenCalledWith(
              programAssessment.id,
              facilitatorPrincipalId
            );
            done(err);
          }
        );
    });

    it('should respond with an error if an error occurs fetching information from the database', done => {
      // mock response from function that gets a list of programs the user is enrolled in to reject the database call
      mockPrincipalEnrolledPrograms.mockRejectedValue(new Error());
      appAgent.get('/').expect(500, done);
    });
  });
  describe('POST /', () => {
    it('should create a new assessment', done => {
      const response = { behaviour: 'Creates a new assessment' };
      appAgent.post('/').expect(200, itemEnvelope(response), err => {
        done(err);
      });
    });
  });

  describe('GET /:assessmentId', () => {
    it('should show a single assessment', done => {
      const response = { behaviour: 'Shows a single assessment' };
      appAgent
        .get(`/${exampleAssessmentId}`)
        .expect(200, itemEnvelope(response), err => {
          done(err);
        });
    });
  });

  describe('PUT /:assessmentId', () => {
    it('should edit an assessment in the system', done => {
      const response = { behaviour: 'Edits an assessment in the system' };
      appAgent
        .put(`/${exampleAssessmentId}`)
        .expect(200, itemEnvelope(response), err => {
          done(err);
        });
    });
  });

  describe('DELETE /:assessmentId', () => {
    it('should delete a program assessment in the system if logged-in user is facilitator of that program', done => {
      const principalId = 3;
      const assessmentId = 1;
      mockPrincipalId(principalId);
      mockGetProgramIdByProgramAssessmentId.mockResolvedValue([2]);
      mockFindRoleInProgram.mockResolvedValue({ title: 'facilitator' });
      appAgent.delete(`/${assessmentId}`).expect(204, null, err => {
        expect(mockGetProgramIdByProgramAssessmentId).toHaveBeenCalledWith(1);
        expect(mockFindRoleInProgram).toHaveBeenCalledWith(principalId, 2);
        expect(mockDeleteAssessmentById).toHaveBeenCalledWith(1);
        done(err);
      });
    });
    it('should return an error if logged-in user is not a facilitator of that program', done => {
      const principalId = 4;
      const assessmentId = 1;
      mockPrincipalId(principalId);
      mockGetProgramIdByProgramAssessmentId.mockResolvedValue([2]);
      mockFindRoleInProgram.mockResolvedValue({ title: 'participant' });
      appAgent
        .delete(`/${assessmentId}`)
        .expect(
          401,
          errorEnvelope('The requester does not have access to the resource.'),
          err => {
            expect(mockGetProgramIdByProgramAssessmentId).toHaveBeenCalledWith(
              1
            );
            expect(mockFindRoleInProgram).toHaveBeenCalledWith(principalId, 2);
            done(err);
          }
        );
    });
  });

  describe('GET /:assessmentId/submissions/:submissionId', () => {
    const facilitatorPrincipalId = 3;
    const participantPrincipalId = 2;
    const programAssessmentId = 1;
    const submissionId = 1;
    const curriculumAssessmentId = 1;
    const curriculumAssessment = {
      id: curriculumAssessmentId,
      title: 'Assignment 1: React',
      description: 'Your assignment for week 1 learning.',
      max_score: 10,
      max_num_submissions: 3,
      time_limit: 120,
      curriculum_id: 3,
      activity_id: 97,
      principal_id: participantPrincipalId,
      questions: [
        {
          id: 1,
          assessment_id: curriculumAssessmentId,
          title: 'What is React?',
          description: '',
          question_type: 'single choice',
          answers: [
            {
              id: 1,
              question_id: 1,
              title: 'A relational database management system',
              description: '',
              sort_order: 1,
            },
          ],
          max_score: 1,
          sort_order: 1,
        },
      ],
    };
    const programAssessment = {
      id: programAssessmentId,
      program_id: 1,
      assessment_id: curriculumAssessmentId,
      available_after: '2023-02-06',
      due_date: '2023-02-10',
    };
    const assessmentSubmissionInProgress = {
      id: 2,
      assessment_id: programAssessmentId,
      principal_id: participantPrincipalId,
      assessment_submission_state: 'In Progress',
      opened_at: '2023-02-09 12:00:00',
      submitted_at: '2023-02-09 13:23:45',
      responses: [
        {
          id: 1,
          answer_id: 1,
          assessment_id: 1,
          submission_id: 2,
          question_id: 1,
        },
      ],
    };

    it("should show a facilitator the full submission information for a participant's ungraded submitted assessment, including the correct answers", done => {
      const curriculumAssessmentWithCorrectAnswer = {
        id: curriculumAssessmentId,
        title: 'Assignment 1: React',
        description: 'Your assignment for week 1 learning.',
        max_score: 10,
        max_num_submissions: 1,
        time_limit: 120,
        curriculum_id: 3,
        activity_id: 97,
        principal_id: facilitatorPrincipalId,
        questions: [
          {
            id: 1,
            assessment_id: curriculumAssessmentId,
            title: 'What is React?',
            description: '',
            question_type: 'single choice',
            answers: [
              {
                id: 1,
                question_id: 1,
                title: 'A relational database management system',
                description: '',
                sort_order: 1,
                correct_answer: true,
              },
            ],
            correct_answer_id: 1,
            max_score: 1,
            sort_order: 1,
          },
        ],
      };
      const assessmentSubmission = {
        id: 2,
        assessment_id: programAssessmentId,
        principal_id: participantPrincipalId,
        assessment_submission_state: 'Submitted',
        opened_at: '2023-02-09 12:00:00',
        submitted_at: '2023-02-09 13:23:45',
        responses: [
          {
            id: 1,
            answer_id: 1,
            assessment_id: 1,
            submission_id: 2,
            question_id: 1,
          },
        ],
      };

      const response: SubmittedAssessment = {
        curriculum_assessment: curriculumAssessmentWithCorrectAnswer,
        program_assessment: programAssessment,
        submission: assessmentSubmission,
      };

      mockGetProgramIdByProgramAssessmentId.mockResolvedValue([
        { program_id: programAssessment.program_id },
      ]);
      mockFindRoleInProgram.mockResolvedValue({
        title: 'facilitator',
      });
      mockProgramAssessmentById.mockResolvedValue([programAssessment]);
      mockGetCurriculumAssessmentById.mockResolvedValue(
        curriculumAssessmentWithCorrectAnswer
      );
      mockSubmissionDetails.mockResolvedValue([assessmentSubmission]);
      mockPrincipalId(facilitatorPrincipalId);
      appAgent
        .get(`/${programAssessmentId}/submissions/${submissionId}`)

        .expect(200, itemEnvelope(response), err => {
          expect(mockGetProgramIdByProgramAssessmentId).toHaveBeenCalledWith(
            programAssessmentId
          );
          expect(mockFindRoleInProgram).toHaveBeenCalledWith(
            facilitatorPrincipalId,
            programAssessment.program_id
          );
          expect(mockProgramAssessmentById).toHaveBeenCalledWith(
            programAssessmentId
          );
          expect(mockGetCurriculumAssessmentById).toHaveBeenCalledWith(
            programAssessmentId,
            true,
            true
          );
          expect(mockSubmissionDetails).toHaveBeenCalledWith(
            programAssessmentId,
            submissionId,
            true
          );
          done(err);
        });
    });

    it('should show a participant their submission information for an in-progress assessment without including the correct answers', done => {
      const response: SubmittedAssessment = {
        curriculum_assessment: curriculumAssessment,
        program_assessment: programAssessment,
        submission: assessmentSubmissionInProgress,
      };

      mockGetProgramIdByProgramAssessmentId.mockResolvedValue([
        { program_id: programAssessment.program_id },
      ]);
      mockFindRoleInProgram.mockResolvedValue({ title: 'participant' });
      mockProgramAssessmentById.mockResolvedValue([programAssessment]);
      mockGetCurriculumAssessmentById.mockResolvedValue(curriculumAssessment);
      mockSubmissionDetails.mockResolvedValue([assessmentSubmissionInProgress]);
      mockPrincipalId(participantPrincipalId);
      appAgent
        .get(`/${programAssessmentId}/submissions/${submissionId}`)

        .expect(200, itemEnvelope(response), err => {
          expect(mockGetProgramIdByProgramAssessmentId).toHaveBeenCalledWith(
            programAssessmentId
          );
          expect(mockFindRoleInProgram).toHaveBeenCalledWith(
            facilitatorPrincipalId,
            programAssessment.program_id
          );
          expect(mockProgramAssessmentById).toHaveBeenCalledWith(
            programAssessmentId
          );
          expect(mockGetCurriculumAssessmentById).toHaveBeenCalledWith(
            programAssessmentId,
            true,
            false
          );
          expect(mockSubmissionDetails).toHaveBeenCalledWith(
            programAssessmentId,
            submissionId,
            true
          );
          done(err);
        });
    });

    it('should show a participant their submission information for an ungraded submitted assessment without including the correct answers', done => {
      const curriculumAssessmentWithoutCorrectAnswer = {
        id: curriculumAssessmentId,
        title: 'Assignment 1: React',
        description: 'Your assignment for week 1 learning.',
        max_score: 10,
        max_num_submissions: 3,
        time_limit: 120,
        curriculum_id: 3,
        activity_id: 97,
        principal_id: participantPrincipalId,
        questions: [
          {
            id: 1,
            assessment_id: curriculumAssessmentId,
            title: 'What is React?',
            description: '',
            question_type: 'single choice',
            answers: [
              {
                id: 1,
                question_id: 1,
                title: 'A relational database management system',
                description: '',
                sort_order: 1,
              },
            ],
            max_score: 1,
            sort_order: 1,
          },
        ],
      };

      const assessmentSubmission = {
        id: 2,
        assessment_id: programAssessmentId,
        principal_id: participantPrincipalId,
        assessment_submission_state: 'Submitted',
        opened_at: '2023-02-09 12:00:00',
        submitted_at: '2023-02-09 13:23:45',
        responses: [
          {
            id: 1,
            answer_id: 1,
            assessment_id: 1,
            submission_id: 2,
            question_id: 1,
          },
        ],
      };
      const response: SubmittedAssessment = {
        curriculum_assessment: curriculumAssessmentWithoutCorrectAnswer,
        program_assessment: programAssessment,
        submission: assessmentSubmission,
      };

      mockGetProgramIdByProgramAssessmentId.mockResolvedValue([
        { program_id: programAssessment.program_id },
      ]);
      mockFindRoleInProgram.mockResolvedValue({ title: 'participant' });
      mockProgramAssessmentById.mockResolvedValue([programAssessment]);
      mockGetCurriculumAssessmentById.mockResolvedValue(
        curriculumAssessmentWithoutCorrectAnswer
      );
      mockSubmissionDetails.mockResolvedValue([assessmentSubmission]);
      mockPrincipalId(participantPrincipalId);
      appAgent
        .get(`/${programAssessmentId}/submissions/${submissionId}`)

        .expect(200, itemEnvelope(response), err => {
          expect(mockGetProgramIdByProgramAssessmentId).toHaveBeenCalledWith(
            programAssessmentId
          );
          expect(mockFindRoleInProgram).toHaveBeenCalledWith(
            facilitatorPrincipalId,
            programAssessment.program_id
          );
          expect(mockProgramAssessmentById).toHaveBeenCalledWith(
            programAssessmentId
          );
          expect(mockGetCurriculumAssessmentById).toHaveBeenCalledWith(
            programAssessmentId,
            true,
            false
          );
          expect(mockSubmissionDetails).toHaveBeenCalledWith(
            programAssessmentId,
            submissionId,
            true
          );
          done(err);
        });
    });

    it('should show a participant their submission information for a graded submitted assessment including the correct answers', done => {
      const curriculumAssessmentWithCorrectAnswer = {
        id: curriculumAssessmentId,
        title: 'Assignment 1: React',
        description: 'Your assignment for week 1 learning.',
        max_score: 10,
        max_num_submissions: 3,
        time_limit: 120,
        curriculum_id: 3,
        activity_id: 97,
        principal_id: facilitatorPrincipalId,
        questions: [
          {
            id: 1,
            assessment_id: curriculumAssessmentId,
            title: 'What is React?',
            description: '',
            question_type: 'single choice',
            answers: [
              {
                id: 1,
                question_id: 1,
                title: 'A relational database management system',
                description: '',
                sort_order: 1,
                correct_answer: true,
              },
            ],
            correct_answer_id: 1,
            max_score: 1,
            sort_order: 1,
          },
        ],
      };
      const assessmentSubmissionGraded = {
        id: 2,
        assessment_id: programAssessmentId,
        principal_id: participantPrincipalId,
        assessment_submission_state: 'graded',
        score: 1,
        opened_at: '2023-02-09 12:00:00',
        submitted_at: '2023-02-09 13:23:45',
        responses: [
          {
            id: 1,
            answer_id: 1,
            assessment_id: 1,
            submission_id: 2,
            question_id: 1,
          },
        ],
      };
      const response: SubmittedAssessment = {
        curriculum_assessment: curriculumAssessmentWithCorrectAnswer,
        program_assessment: programAssessment,
        submission: assessmentSubmissionGraded,
      };
      mockGetProgramIdByProgramAssessmentId.mockResolvedValue([
        { program_id: programAssessment.program_id },
      ]);
      mockFindRoleInProgram.mockResolvedValue({ title: 'participant' });
      mockProgramAssessmentById.mockResolvedValue([programAssessment]);
      mockGetCurriculumAssessmentById.mockResolvedValue(
        curriculumAssessmentWithCorrectAnswer
      );
      mockSubmissionDetails.mockResolvedValue([assessmentSubmissionGraded]);
      mockPrincipalId(participantPrincipalId);
      appAgent
        .get(`/${programAssessmentId}/submissions/${submissionId}`)

        .expect(200, itemEnvelope(response), err => {
          expect(mockGetProgramIdByProgramAssessmentId).toHaveBeenCalledWith(
            programAssessmentId
          );
          expect(mockProgramAssessmentById).toHaveBeenCalledWith(
            programAssessmentId
          );
          expect(mockFindRoleInProgram).toHaveBeenCalledWith(
            facilitatorPrincipalId,
            programAssessment.program_id
          );

          expect(mockGetCurriculumAssessmentById).toHaveBeenCalledWith(
            programAssessmentId,
            true,
            true
          );

          expect(mockSubmissionDetails).toHaveBeenCalledWith(
            programAssessmentId,
            submissionId,
            true
          );
          done(err);
        });
    });

    it('should respond with a bad request error if given an invalid assessment id', done => {
      const programAssessmentId = 'test';
      appAgent
        .get(`/${programAssessmentId}/submissions/${submissionId}`)
        .expect(
          400,
          errorEnvelope(
            'The request could not be completed with the given parameters.'
          ),
          done
        );
    });

    it('should respond with a NotFoundError if the assessment id was not found in the database', done => {
      const programAssessmentId = 7;

      mockGetProgramIdByProgramAssessmentId.mockResolvedValue([]);
      appAgent
        .get(`/${programAssessmentId}/submissions/${submissionId}`)
        .expect(
          404,
          errorEnvelope('The requested resource does not exist.'),
          err => {
            expect(mockGetProgramIdByProgramAssessmentId).toHaveBeenCalledWith(
              programAssessmentId
            );
            done(err);
          }
        );
    });

    it('should respond with a bad request error if given an invalid submission id ', done => {
      const submissionId = 'test';

      appAgent
        .get(`/${programAssessmentId}/submissions/${submissionId}`)

        .expect(
          400,
          errorEnvelope(
            'The request could not be completed with the given parameters.'
          ),
          done
        );
    });

    it('should respond with a NotFoundError if the submission id was not found in the database ', done => {
      const submissionId = 8;

      mockGetProgramIdByProgramAssessmentId.mockResolvedValue([
        { program_id: programAssessment.program_id },
      ]);
      mockFindRoleInProgram.mockResolvedValue({ title: 'participant' });
      mockProgramAssessmentById.mockResolvedValue([programAssessment]);
      mockGetCurriculumAssessmentById.mockResolvedValue(curriculumAssessment);
      mockSubmissionDetails.mockResolvedValue([]);
      mockPrincipalId(participantPrincipalId);
      appAgent
        .get(`/${programAssessmentId}/submissions/${submissionId}`)
        .expect(
          404,
          errorEnvelope('The requested resource does not exist.'),
          err => {
            expect(mockGetProgramIdByProgramAssessmentId).toHaveBeenCalledWith(
              programAssessmentId
            );
            expect(mockFindRoleInProgram).toHaveBeenCalledWith(
              facilitatorPrincipalId,
              programAssessment.program_id
            );
            expect(mockProgramAssessmentById).toHaveBeenCalledWith(
              programAssessmentId
            );
            expect(mockGetCurriculumAssessmentById).toHaveBeenCalledWith(
              programAssessmentId,
              true,
              false
            );
            expect(mockSubmissionDetails).toHaveBeenCalledWith(
              programAssessmentId,
              submissionId,
              true
            );

            done(err);
          }
        );
    });

    it('should respond with an Unauthorized Error if the logged-in principal id is not the same as the principal id of the submission id and is not the principal id of the program facilitator', done => {
      const loggedPrincipalId = 4;

      mockGetProgramIdByProgramAssessmentId.mockResolvedValue([
        { program_id: programAssessment.program_id },
      ]);
      mockFindRoleInProgram.mockResolvedValue({ title: 'participant' });
      mockProgramAssessmentById.mockResolvedValue([programAssessment]);
      mockGetCurriculumAssessmentById.mockResolvedValue(curriculumAssessment);

      mockSubmissionDetails.mockResolvedValue([assessmentSubmissionInProgress]);

      mockPrincipalId(loggedPrincipalId);
      appAgent
        .get(`/${programAssessmentId}/submissions/${submissionId}`)
        .expect(
          401,
          errorEnvelope('The requester does not have access to the resource.'),
          err => {
            expect(mockGetProgramIdByProgramAssessmentId).toHaveBeenCalledWith(
              programAssessmentId
            );
            expect(mockFindRoleInProgram).toHaveBeenCalledWith(
              facilitatorPrincipalId,
              programAssessment.program_id
            );
            expect(mockProgramAssessmentById).toHaveBeenCalledWith(
              programAssessmentId
            );
            expect(mockGetCurriculumAssessmentById).toHaveBeenCalledWith(
              programAssessmentId,
              true,
              false
            );
            expect(mockSubmissionDetails).toHaveBeenCalledWith(
              programAssessmentId,
              submissionId,
              true
            );
            done(err);
          }
        );
    });

    it('should respond with an internal server error if a database error occurs', done => {
      mockGetProgramIdByProgramAssessmentId.mockRejectedValue(new Error());
      appAgent
        .get(`/${programAssessmentId}/submissions/${submissionId}`)
        .expect(500, errorEnvelope('Internal server error.'), err => {
          expect(mockGetProgramIdByProgramAssessmentId).toHaveBeenCalledWith(
            programAssessmentId
          );
          done(err);
        });
    });
  });

  describe('PUT /:assessmentId/submissions/:submissionId', () => {
    it('should update the state of a submission', done => {
      const response = { behaviour: 'Updates the state of a submission' };
      appAgent
        .put(`/${exampleAssessmentId}/submissions/${exampleSubmissionId}`)
        .expect(200, itemEnvelope(response), err => {
          done(err);
        });
    });
  });

  describe('GET /:assessmentId/submissions/new', () => {
    it('should create a new draft submission', done => {
      const response = { behaviour: 'Creates a new draft submission' };
      appAgent
        .get(`/${exampleAssessmentId}/submissions/new`)
        .expect(200, itemEnvelope(response), err => {
          done(err);
        });
    });
  });
});
