import { itemEnvelope, errorEnvelope, errorEnvelope } from '../responseEnvelope';
import { createAppAgentForRouter, mockPrincipalId, mockPrincipalId } from '../routerTestUtils';
import assessmentsRouter from '../assessmentsRouter';
jest.mock('../../services/assessmentService.ts');

import {
  findRoleInProgram,
  getProgramIdByProgramAssessmentId,
  deleteAssessmentById,
} from '../../services/assessmentService';

const mockFindRoleInProgram = jest.mocked(findRoleInProgram);
const mockGetProgramIdByProgramAssessmentId = jest.mocked(
  getProgramIdByProgramAssessmentId
);
const mockDeleteAssessmentById = jest.mocked(deleteAssessmentById);
import {
  getProgramIdByProgramAssessmentId,
  findRoleInProgram,
  programAssessmentById,
  getCurriculumAssessmentById,
  submissionDetails,
} from '../../services/assessmentService';

import { SubmittedAssessment } from '../../models';

jest.mock('../../services/assessmentService.ts');

const mockGetProgramIdByProgramAssessmentId = jest.mocked(
  getProgramIdByProgramAssessmentId
);
const mockFindRoleInProgram = jest.mocked(findRoleInProgram);
const mockProgramAssessmentById = jest.mocked(programAssessmentById);
const mockGetCurriculumAssessmentById = jest.mocked(
  getCurriculumAssessmentById
);
const mockSubmissionDetails = jest.mocked(submissionDetails);

describe('assessmentsRouter', () => {
  const appAgent = createAppAgentForRouter(assessmentsRouter);
  const exampleAssessmentId = 1;
  const exampleSubmissionId = 1;

  describe('GET /', () => {
    it('should respond with a list of all assessments', done => {
      const response = { behaviour: 'Shows a list of all assessments' };

      appAgent.get('/').expect(200, itemEnvelope(response), err => {
        done(err);
      });
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
