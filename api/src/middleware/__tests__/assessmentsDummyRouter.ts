import { itemEnvelope } from '../responseEnvelope';

import {
  insertToProgramParticipants,
  insertToAssessmentSubmissions,
} from '../../services/assessmentsDummyService';

import { createAppAgentForRouter, mockPrincipalId } from '../routerTestUtils';

import assessmentsDummyRouter from '../assessmentsDummyRouter';

jest.mock('../../services/assessmentsDummyService.ts');
const mockGetInsertToProgramParticipants = jest.mocked(
  insertToProgramParticipants
);
const mockGetInsertToAssessmentSubmissions = jest.mocked(
  insertToAssessmentSubmissions
);
describe('assessmentsDummyRouter', () => {
  const appAgent = createAppAgentForRouter(assessmentsDummyRouter);

  describe('GET /makeParticipant/:programId/:participantId', () => {
    it('should return program id and  principal Id for program_participants', done => {
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
  });

  describe('GET /submitAssessment/:participantId', () => {
    it('should submit to assessment_submissions and responses to assessment_responses', done => {
      const principalId = 3;
      const assessmentSubmissionStateId = 7;
      const score = 10;
      const openedAt = '2023-02-09 12:00:00';
      const submittedAt = '2023-02-09 13:23:45';
      const dummyAssessmentSubmissionData = [
        {
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
        },
      ];

      mockPrincipalId(principalId);

      mockGetInsertToAssessmentSubmissions.mockResolvedValue(
        dummyAssessmentSubmissionData[0]
      );
      appAgent
        .get(`/submitAssessment/${principalId}`)
        .expect(201, itemEnvelope(dummyAssessmentSubmissionData[0]), err => {
          expect(mockGetInsertToAssessmentSubmissions).toHaveBeenCalledWith(
            dummyAssessmentSubmissionData[0].assessment_id,
            dummyAssessmentSubmissionData[0].principal_id,
            dummyAssessmentSubmissionData[0].assessment_submission_state_id,
            dummyAssessmentSubmissionData[0].score,
            dummyAssessmentSubmissionData[0].opened_at,
            dummyAssessmentSubmissionData[0].submitted_at,
            dummyAssessmentSubmissionData[0].responses
          );
          done(err);
        });
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
  });
  describe('GET /startAssessment/:assessmentId/:participantId', () => {
    it('should start assessment', done => {
      const principalId = 3;
      const assessmentId = 1;
      const assessmentSubmissionStateId = 7;
      const score = 10;
      const openedAt = '2023-02-09 12:00:00';
      const submittedAt = '2023-02-09 13:23:45';
      const questions = [{}];
      const dummyAssessmentSubmissionData = [
        {
          id: 1,
          assessmentId: assessmentId,
          principalId: principalId,
          assessment_submission_state_id: assessmentSubmissionStateId,
          score: score,
          opened_at: openedAt,
          submitted_at: submittedAt,
          questions: questions,
        },
      ];

      mockPrincipalId(principalId);

      mockGetInsertToAssessmentSubmissions.mockResolvedValue(
        dummyAssessmentSubmissionData[0]
      );
      appAgent
        .get(`/startAssessment/${assessmentId}/${principalId}`)
        .expect(201, itemEnvelope(dummyAssessmentSubmissionData[0]), err => {
          expect(mockGetInsertToAssessmentSubmissions).toHaveBeenCalledWith(
            dummyAssessmentSubmissionData[0].assessmentId,
            dummyAssessmentSubmissionData[0].principalId,
            dummyAssessmentSubmissionData[0].assessment_submission_state_id,
            dummyAssessmentSubmissionData[0].score,
            dummyAssessmentSubmissionData[0].opened_at,
            dummyAssessmentSubmissionData[0].submitted_at,
            []
          );
          done(err);
        });
    });
  });
});
