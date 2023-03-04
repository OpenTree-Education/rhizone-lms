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
          id: 1,
          assessmentId: 1,
          principalId: principalId,
          assessment_submission_state_id: assessmentSubmissionStateId,
          score: score,
          opened_at: openedAt,
          submitted_at: submittedAt,
          questions: [
            { id: 1, answerId: 4 },
            { id: 2, answerId: 5 },
            { id: 3, answerId: 9 },
            { id: 4, answerId: 14 },
            { id: 5, answerId: 18 },
            { id: 6, answerId: 21 },
            { id: 7, answerId: 23 },
            {
              id: 8,
              responseText:
                'const HelloWorld = () => { return <p>Hello, World!</p>; }; export default HelloWorld;',
            },
            {
              id: 9,
              responseText:
                'React differs from other JavaScript frameworks because it uses a component-based architecture, a virtual DOM, JSX syntax, unidirectional data flow, and is primarily focused on building UIs rather than providing a complete application framework. These features make it faster, more efficient, and more flexible than other frameworks.',
            },
            {
              id: 10,
              responseText:
                'Benefits of using React include its modular and reusable components, efficient updates with virtual DOM, JSX syntax, and active community.',
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
            dummyAssessmentSubmissionData[0].assessmentId,
            dummyAssessmentSubmissionData[0].principalId,
            dummyAssessmentSubmissionData[0].assessment_submission_state_id,
            dummyAssessmentSubmissionData[0].score,
            dummyAssessmentSubmissionData[0].opened_at,
            dummyAssessmentSubmissionData[0].submitted_at,
            dummyAssessmentSubmissionData[0].questions
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
