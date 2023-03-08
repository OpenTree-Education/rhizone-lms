import { itemEnvelope } from '../responseEnvelope';

import {
  insertToProgramParticipants,
  insertDataIntoAssessmentSubmissions,
} from '../../services/assessmentsDummyService';

import { createAppAgentForRouter, mockPrincipalId } from '../routerTestUtils';

import assessmentsDummyRouter from '../assessmentsDummyRouter';

jest.mock('../../services/assessmentsDummyService.ts');
const mockGetInsertToProgramParticipants = jest.mocked(
  insertToProgramParticipants
);
const mockGetInsertToAssessmentSubmissions = jest.mocked(
  insertDataIntoAssessmentSubmissions
);
describe('assessmentsDummyRouter', () => {
  const appAgent = createAppAgentForRouter(assessmentsDummyRouter);

  describe('GET /makeParticipant/:programId/:participantId', () => {
    it('should return program id and principal id for program_participants', done => {
      const programId = 2;
      const principalId = 3;
      const roleId = 1;
      const participantRow = [
        {
          id: 1,
          principal_id: principalId,
          program_id: programId,
          role_id: roleId,
        },
      ];
      mockPrincipalId(principalId);
      mockGetInsertToProgramParticipants.mockResolvedValue(participantRow[0]);
      appAgent
        .get(`/makeParticipant/${programId}/${principalId}`)
        .expect(201, itemEnvelope(participantRow[0]), err => {
          expect(mockGetInsertToProgramParticipants).toHaveBeenCalledWith(
            principalId,
            programId,
            roleId
          );
          done(err);
        });
    });
    it('should respond with a bad request error if given an invalid principal id', done => {
      const programId = 2;
      const principalId = 'test';
      appAgent
        .get(`/makeParticipant/${programId}/${principalId}`)
        .expect(400, done);
    });
    it('should respond with a bad request error if given an invalid program id ', done => {
      const programId = 'test';
      const principalId = 2;
      appAgent
        .get(`/makeParticipant/${programId}/${principalId}`)
        .expect(400, done);
    });

    it('should respond with an internal server error if an error', done => {
      const programId = 2;
      const principalId = 3;
      mockGetInsertToProgramParticipants.mockRejectedValue(new Error());
      appAgent
        .get(`/makeParticipant/${programId}/${principalId}`)
        .expect(500, done);
    });
  });

  describe('GET /submitAssessment/:participantId', () => {
    it('should submit to assessment_submissions and responses to assessment_responses', done => {
      const principalId = 3;
      const assessmentSubmissionStateId = 7;
      const score = 10;
      const openedAt = '2023-02-09 12:00:00';
      const submittedAt = '2023-02-09 13:23:45';
      const dummyAssessmentSubmissionData = {
        id: 2,
        submission_id: 2,
        assessment_id: 1,
        principal_id: principalId,
        assessment_submission_state_id: assessmentSubmissionStateId, // graded
        score: score,
        opened_at: openedAt,
        submitted_at: submittedAt,
        responses: [
          {
            id: 1,
            answer_id: 4,
            assessment_id: 1,
            submission_id: 2,
            question_id: 1,
          },
          {
            id: 2,
            answer_id: 5,
            assessment_id: 1,
            submission_id: 2,
            question_id: 2,
          },
          {
            id: 3,
            answer_id: 9,
            assessment_id: 1,
            submission_id: 2,
            question_id: 3,
          },
          {
            id: 4,
            answer_id: 14,
            assessment_id: 1,
            submission_id: 2,
            question_id: 4,
          },
          {
            id: 5,
            answer_id: 18,
            assessment_id: 1,
            submission_id: 2,
            question_id: 5,
          },
          {
            id: 6,
            answer_id: 21,
            assessment_id: 1,
            submission_id: 2,
            question_id: 6,
          },
          {
            id: 7,
            answer_id: 23,
            assessment_id: 1,
            submission_id: 2,
            question_id: 7,
          },
          {
            id: 8,
            response:
              'const HelloWorld = () => { return <p>Hello, World!</p>; }; export default HelloWorld;',
            assessment_id: 1,
            submission_id: 2,
            question_id: 8,
          },
          {
            id: 9,
            response:
              'React differs from other JavaScript frameworks because it uses a component-based architecture, a virtual DOM, JSX syntax, unidirectional data flow, and is primarily focused on building UIs rather than providing a complete application framework. These features make it faster, more efficient, and more flexible than other frameworks.',
            assessment_id: 1,
            submission_id: 2,
            question_id: 9,
          },
          {
            id: 10,
            response:
              'Benefits of using React include its modular and reusable components, efficient updates with virtual DOM, JSX syntax, and active community.',
            assessment_id: 1,
            submission_id: 2,
            question_id: 10,
          },
        ],
      };
      mockPrincipalId(principalId);

      mockGetInsertToAssessmentSubmissions.mockResolvedValue(
        dummyAssessmentSubmissionData
      );
      appAgent
        .get(`/submitAssessment/${principalId}`)
        .expect(201, itemEnvelope(dummyAssessmentSubmissionData), err => {
          expect(mockGetInsertToAssessmentSubmissions).toHaveBeenCalledWith(
            dummyAssessmentSubmissionData.assessment_id,
            dummyAssessmentSubmissionData.principal_id,
            dummyAssessmentSubmissionData.assessment_submission_state_id,
            dummyAssessmentSubmissionData.score,
            dummyAssessmentSubmissionData.opened_at,
            dummyAssessmentSubmissionData.submitted_at,
            dummyAssessmentSubmissionData.responses
          );
          done(err);
        });
    });
    it('should respond with a bad request error if given an invalid principal id ', done => {
      const principalId = 'string';
      appAgent.get(`/submitAssessment/${principalId}`).expect(400, done);
    });

    it('should respond with an internal server error if an error', done => {
      const principalId = 3;
      mockGetInsertToAssessmentSubmissions.mockRejectedValue(new Error());
      appAgent.get(`/submitAssessment/${principalId}`).expect(500, done);
    });
  });

  describe('GET /makeFacilitator/:programId/:participantId', () => {
    it('should return program id and  principal Id for program_participants', done => {
      const programId = 2;
      const principalId = 3;
      const roleId = 2;
      const participantRow = [
        {
          id: 1,
          principal_id: principalId,
          program_id: programId,
          role_id: roleId,
        },
      ];
      mockPrincipalId(principalId);
      mockGetInsertToProgramParticipants.mockResolvedValue(participantRow[0]);
      appAgent
        .get(`/makeFacilitator/${programId}/${principalId}`)
        .expect(201, itemEnvelope(participantRow[0]), err => {
          expect(mockGetInsertToProgramParticipants).toHaveBeenCalledWith(
            principalId,
            programId,
            roleId
          );
          done(err);
        });
    });
    it('should respond with a bad request error if given an invalid principal id', done => {
      const programId = 2;
      const principalId = 'test';

      appAgent
        .get(`/makeFacilitator/${programId}/${principalId}`)
        .expect(400, done);
    });
    it('should respond with a bad request error if given an invalid program id', done => {
      const programId = 'string';
      const principalId = 3;

      appAgent
        .get(`/makeFacilitator/${programId}/${principalId}`)
        .expect(400, done);
    });
    it('should respond with an internal server error if an error was thrown ', done => {
      const programId = 2;
      const principalId = 3;
      mockGetInsertToProgramParticipants.mockRejectedValue(new Error());
      appAgent
        .get(`/makeFacilitator/${programId}/${principalId}`)
        .expect(500, done);
    });
  });
  describe('GET /startAssessment/:assessmentId/:participantId', () => {
    it('should start assessment', done => {
      const principalId = 3;
      const assessmentId = 1;
      const assessmentSubmissionStateId = 0;
      const score = 0;
      const openedAt = '2023-02-09 12:10:10';
      const submittedAt = '';
      const responses = [{}];

      const dummyAssessmentSubmissionData = {
        id: 1,
        assessmentId: assessmentId,
        principalId: principalId,
        assessment_submission_state_id: assessmentSubmissionStateId,
        score: score,
        opened_at: openedAt,
        submitted_at: submittedAt,
        responses: responses,
      };
      mockPrincipalId(principalId);

      mockGetInsertToAssessmentSubmissions.mockResolvedValue(
        dummyAssessmentSubmissionData
      );
      appAgent
        .get(`/startAssessment/${assessmentId}/${principalId}`)
        .expect(201, itemEnvelope(dummyAssessmentSubmissionData), err => {
          expect(mockGetInsertToAssessmentSubmissions).toHaveBeenCalledWith(
            dummyAssessmentSubmissionData.assessmentId,
            dummyAssessmentSubmissionData.principalId,
            dummyAssessmentSubmissionData.assessment_submission_state_id,
            dummyAssessmentSubmissionData.score,
            dummyAssessmentSubmissionData.opened_at,
            dummyAssessmentSubmissionData.submitted_at,
            []
          );
          done(err);
        });
    });
    it('should respond with a bad request error if given an invalid principal id', done => {
      const principalId = 'test';
      const assessmentId = 1;
      appAgent
        .get(`/startAssessment/${assessmentId}/${principalId}`)
        .expect(400, done);
    });
    it('should respond with a bad request error if given an invalid assessment id', done => {
      const principalId = 2;
      const assessmentId = 'string';
      appAgent
        .get(`/startAssessment/${assessmentId}/${principalId}`)
        .expect(400, done);
    });

    it('should respond with an internal server error if an error was thrown', done => {
      const assessmentId = 1;
      const principalId = 3;
      mockGetInsertToAssessmentSubmissions.mockRejectedValue(new Error());

      appAgent
        .get(`/startAssessment/${assessmentId}/${principalId}`)
        .expect(500, done);
    });
  });
});
