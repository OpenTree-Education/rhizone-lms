import { itemEnvelope, errorEnvelope } from '../responseEnvelope';
import { createAppAgentForRouter, mockPrincipalId } from '../routerTestUtils';
import assessmentsRouter from '../assessmentsRouter';
import {
  getProgramIdByProgramAssessmentId,
  findRoleInProgram,
  programAssessmentById,
  getCurriculumAssessmentById,
  submissionDetails,
} from '../../services/assessmentService';

import { AssessmentSubmission, AssessmentWithSubmissions } from '../../models';

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
    it('should delete an assessment in the system', done => {
      const response = { behaviour: '“Deletes” an assessment in the system' };
      appAgent
        .delete(`/${exampleAssessmentId}`)
        .expect(200, itemEnvelope(response), err => {
          done(err);
        });
    });
  });

  describe('GET /:assessmentId/submissions/:submissionId', () => {
    it("should show a facilitator the full submission information for a participant's ungraded submitted assessment, including the correct answers", done => {
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
      const programAssessment = {
        id: programAssessmentId,
        program_id: 1,
        assessment_id: curriculumAssessmentId,
        available_after: '2023-02-06',
        due_date: '2023-02-10',
      };

      const assessmentSubmission: AssessmentSubmission[] = [
        {
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
        },
      ];
      const response: AssessmentWithSubmissions = {
        curriculum_assessment: curriculumAssessment,
        program_assessment: programAssessment,
        submissions: assessmentSubmission,
      };

      mockGetProgramIdByProgramAssessmentId.mockResolvedValue([
        { program_id: programAssessment.program_id },
      ]);
      mockFindRoleInProgram.mockResolvedValue({ title: 'facilitator' });
      mockProgramAssessmentById.mockResolvedValue([programAssessment]);
      mockGetCurriculumAssessmentById.mockResolvedValue(curriculumAssessment);
      mockSubmissionDetails.mockResolvedValue(assessmentSubmission);
      mockPrincipalId(facilitatorPrincipalId);
      appAgent
        .get(`/${programAssessmentId}/submissions/${submissionId}`)

        .expect(200, itemEnvelope(response), err => {
          expect(mockProgramAssessmentById).toHaveBeenCalledWith(
            programAssessmentId
          );
          expect(mockGetCurriculumAssessmentById).toHaveBeenCalledWith(
            programAssessmentId,
            true,
            true
          );

          expect(mockFindRoleInProgram).toHaveBeenCalledWith(
            facilitatorPrincipalId,
            programAssessment.program_id
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

      const assessmentSubmission: AssessmentSubmission[] = [
        {
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
        },
      ];
      const response: AssessmentWithSubmissions = {
        curriculum_assessment: curriculumAssessment,
        program_assessment: programAssessment,
        submissions: assessmentSubmission,
      };

      mockGetProgramIdByProgramAssessmentId.mockResolvedValue([
        { program_id: programAssessment.program_id },
      ]);
      mockFindRoleInProgram.mockResolvedValue({ title: 'participant' });
      mockProgramAssessmentById.mockResolvedValue([programAssessment]);
      mockGetCurriculumAssessmentById.mockResolvedValue(curriculumAssessment);
      mockSubmissionDetails.mockResolvedValue(assessmentSubmission);
      mockPrincipalId(participantPrincipalId);
      appAgent
        .get(`/${programAssessmentId}/submissions/${submissionId}`)

        .expect(200, itemEnvelope(response), err => {
          expect(mockProgramAssessmentById).toHaveBeenCalledWith(
            programAssessmentId
          );
          expect(mockGetCurriculumAssessmentById).toHaveBeenCalledWith(
            programAssessmentId,
            true,
            false
          );

          expect(mockFindRoleInProgram).toHaveBeenCalledWith(
            facilitatorPrincipalId,
            programAssessment.program_id
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
      const facilitatorPrincipalId = 3;
      const participantPrincipalId = 2;
      const programAssessmentId = 1,
        submissionId = 1;
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

      const assessmentSubmission: AssessmentSubmission[] = [
        {
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
        },
      ];
      const response: AssessmentWithSubmissions = {
        curriculum_assessment: curriculumAssessment,
        program_assessment: programAssessment,
        submissions: assessmentSubmission,
      };

      mockGetProgramIdByProgramAssessmentId.mockResolvedValue([
        { program_id: programAssessment.program_id },
      ]);
      mockFindRoleInProgram.mockResolvedValue({ title: 'participant' });
      mockProgramAssessmentById.mockResolvedValue([programAssessment]);
      mockGetCurriculumAssessmentById.mockResolvedValue(curriculumAssessment);
      mockSubmissionDetails.mockResolvedValue(assessmentSubmission);
      mockPrincipalId(participantPrincipalId);
      appAgent
        .get(`/${programAssessmentId}/submissions/${submissionId}`)

        .expect(200, itemEnvelope(response), err => {
          expect(mockProgramAssessmentById).toHaveBeenCalledWith(
            programAssessmentId
          );
          expect(mockGetCurriculumAssessmentById).toHaveBeenCalledWith(
            programAssessmentId,
            true,
            false
          );

          expect(mockFindRoleInProgram).toHaveBeenCalledWith(
            facilitatorPrincipalId,
            programAssessment.program_id
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
      const facilitatorPrincipalId = 3;
      const participantPrincipalId = 2;
      const programAssessmentId = 1,
        submissionId = 1;
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
      const programAssessment = {
        id: programAssessmentId,
        program_id: 1,
        assessment_id: curriculumAssessmentId,
        available_after: '2023-02-06',
        due_date: '2023-02-10',
      };

      const assessmentSubmission: AssessmentSubmission[] = [
        {
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
        },
      ];
      const response: AssessmentWithSubmissions = {
        curriculum_assessment: curriculumAssessment,
        program_assessment: programAssessment,
        submissions: assessmentSubmission,
      };

      mockPrincipalId(participantPrincipalId);
      appAgent
        .get(`/${programAssessmentId}/submissions/${submissionId}`)

        .expect(200, itemEnvelope(response), err => {
          expect(mockProgramAssessmentById).toHaveBeenCalledWith(
            programAssessmentId
          );
          expect(mockGetCurriculumAssessmentById).toHaveBeenCalledWith(
            programAssessmentId,
            true,
            true
          );

          expect(mockFindRoleInProgram).toHaveBeenCalledWith(
            facilitatorPrincipalId,
            programAssessment.program_id
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
      const programAssessmentId = 'test',
        submissionId = 1;

      appAgent
        .get(`/${programAssessmentId}/submissions/${submissionId}`)
        .expect(400, done);
    });
    it('should respond with a NotFoundError if the assessment ID was not found in the database', done => {
      const programAssessmentId = 7,
        submissionId = 1;

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
      const programAssessmentId = 1,
        submissionId = 'test';

      appAgent
        .get(`/${programAssessmentId}/submissions/${submissionId}`)
        .expect(400, done);
    });
    it('should respond with a NotFoundError if the submission ID was not found in the database ', done => {
      const programAssessmentId = 1,
        submissionId = 8;

      mockSubmissionDetails.mockResolvedValue([]);
      appAgent
        .get(`/${programAssessmentId}/submissions/${submissionId}`)
        .expect(
          404,
          errorEnvelope('The requested resource does not exist.'),
          err => {
            expect(mockSubmissionDetails).toHaveBeenCalledWith(
              programAssessmentId,
              submissionId,
              true
            );
            done(err);
          }
        );
    });

    it('should respond with an UnauthorizedError if the logged-in principal ID is not the same as the principal ID of the submission ID and is not the principal ID of the program facilitator', done => {
      const loggedPrincipalId = 4;
      const participantPrincipalId = 2;
      const programAssessmentId = 1;
      const submissionId = 1;

      const assessmentSubmission: AssessmentSubmission[] = [
        {
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
        },
      ];

      mockSubmissionDetails.mockResolvedValue(assessmentSubmission);

      mockPrincipalId(loggedPrincipalId);
      appAgent
        .get(`/${programAssessmentId}/submissions/${submissionId}`)
        .expect(401, errorEnvelope('Unauthorized user.'), err => {
          expect(mockSubmissionDetails).toHaveBeenCalledWith(
            programAssessmentId,
            submissionId,
            true
          );
          done(err);
        });
    });
    it('should respond with an internal server error if a database error occurs', done => {
      const programAssessmentId = 1,
        submissionId = 1;
      mockSubmissionDetails.mockRejectedValue(new Error());
      appAgent;

      appAgent
        .get(`/${programAssessmentId}/submissions/${submissionId}`)
        .expect(500, done);
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
});
