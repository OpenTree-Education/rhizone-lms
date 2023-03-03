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

  // describe('GET /makeFacilitator/:programId/:participantId', () => {
  //   it('should return program id and  principal Id for program_participants', done => {
  //     const programId = 2;
  //     const principalId = 3;
  //     const roleId = 2;
  //     const participantRow = [
  //       {
  //         id: 2,
  //         principal_id: principalId,
  //         program_id: programId,
  //         role_id: roleId,
  //       },
  //     ];
  //     mockPrincipalId(principalId);
  //     mockGetInsertToProgramParticipants.mockResolvedValue(participantRow);
  //     appAgent
  //       .get(`/makeParticipant/${programId}/${principalId}`)
  //       .expect(201, itemEnvelope(participantRow), err => {
  //         expect(mockGetInsertToProgramParticipants).toHaveBeenCalledWith(
  //           principalId,
  //           programId,
  //           roleId
  //         );
  //         done(err);
  //       });
  //   });
  // });
});
