import { itemEnvelope } from '../responseEnvelope';
import { createAppAgentForRouter, mockPrincipalId } from '../routerTestUtils';
import assessmentsRouter from '../assessmentsRouter';
import { getCurriculumAssessmentBasedOnRole } from '../../services/assessmentService';
import {
  CurriculumAssessment,
  ProgramAssessment,
  AssessmentSubmission,
  Question,
  Answer,
} from '../../models';
jest.mock('../../services/assessmentService.ts');

const mockGetCurriculumAssesmentBasedOnRole = jest.mocked(
  getCurriculumAssessmentBasedOnRole
);

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
  //**participants: CurriculumAssessment (with 'questions' and 'answers' and correct answers (if graded)), ProgramAssessment, and AssessmentSubmission (with 'responses')
  //facilitator: CurriculumAssessment (with 'questions' and 'answers' and correct answers), ProgramAssessment, and AssessmentSubmission (with 'responses') */

  describe('GET /:assessmentId/submissions/:submissionId', () => {
    it('should return the submission information for the subimtted assessment for facilitator', done => {
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

      const assessmentSubmission = {
        id: 2,
        submission_id: 2,
        assessment_id: programAssessmentId,
        principal_id: participantPrincipalId,
        assessment_submission_state: 'Graded',
        score: 10,
        opened_at: '2023-02-09 12:00:00',
        submitted_at: '2023-02-09 13:23:45',
        responses: [
          {
            id: 1,
            answer_id: 4,
            assessment_id: 1,
            submission_id: 2,
            question_id: 1,
            score: 1,
          },
        ],
      };
      const response: {
        curriculum_assessment: CurriculumAssessment;
        program_assessment: ProgramAssessment;
        assessment_submission: AssessmentSubmission;
      } = {
        curriculum_assessment: curriculumAssessment,
        program_assessment: programAssessment,
        assessment_submission: assessmentSubmission,
      };

      mockGetCurriculumAssesmentBasedOnRole.mockResolvedValue(response);
      mockPrincipalId(facilitatorPrincipalId);
      appAgent
        .get(`/${programAssessmentId}/submissions/${submissionId}`)

        .expect(200, itemEnvelope(response), err => {
          expect(mockGetCurriculumAssesmentBasedOnRole).toHaveBeenCalledWith(
            facilitatorPrincipalId,
            programAssessmentId,
            submissionId
          );

          done(err);
        });
    });
    it('should respond with a bad request error if given an invalid assessment id', done => {
      const assessmentId = 'test',
        submissionId = 1;

      appAgent
        .get(`/${assessmentId}/submissions/${submissionId}`)
        .expect(400, done);
    });
    it('should respond with a bad request error if given an invalid submission id ', done => {
      const assessmentId = 1,
        submissionId = 'test';

      appAgent
        .get(`/${assessmentId}/submissions/${submissionId}`)
        .expect(400, done);
    });

    it('should respond with an internal server error if an error', done => {
      const assessmentId = 1,
        submissionId = 1;
      mockGetCurriculumAssesmentBasedOnRole.mockRejectedValue(new Error());
      appAgent
        .get(`/${assessmentId}/submissions/${submissionId}`)
        .expect(500, done);
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
