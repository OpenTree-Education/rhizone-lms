import {
  insertToProgramParticipants,
  insertToAssessmentSubmissions,
  insertToAssessmentResponses,
} from '../assessmentsDummyService';
import { mockQuery } from '../mockDb';

describe('assessmentsDummyService', () => {
  describe('insertToProgramParticipants', () => {
    it('should check for principalId, programId in program_participants table and insert new record', async () => {
      const principalId = 3;
      const programId = 2;
      const roleId = 1;
      const participant = [
        {
          id: 1,
          principal_id: principalId,
          program_id: programId,
          role_id: roleId,
        },
      ];
      mockQuery(
        'select `id`, `principal_id`, `program_id`, `role_id` from `program_participants` where `principal_id` = ? and `program_id` = ?',
        [principalId, programId],
        []
      );
      mockQuery(
        'insert into `program_participants` (`principal_id`, `program_id`, `role_id`) values (?, ?, ?)',
        [principalId, programId, roleId],
        []
      );
      mockQuery(
        'select `id` from `program_participants` where `principal_id` = ? and `program_id` = ?',
        [principalId, programId],
        participant
      );
      expect(
        await insertToProgramParticipants(principalId, programId, roleId)
      ).toEqual(participant[0]);
    });

    it('should check for principalId, programId in program_participants table and update existing record', async () => {
      const principalId = 3;
      const programId = 2;
      const roleId = 1;
      const participant = [
        {
          id: 1,
          principal_id: principalId,
          program_id: programId,
          role_id: roleId,
        },
      ];
      mockQuery(
        'select `id`, `principal_id`, `program_id`, `role_id` from `program_participants` where `principal_id` = ? and `program_id` = ?',
        [principalId, programId],
        participant
      );
      mockQuery(
        'update `program_participants` set `program_id` = ?, `role_id` = ? where `principal_id` = ?',
        [programId, roleId, principalId],
        []
      );
      mockQuery(
        'select `id` from `program_participants` where `principal_id` = ? and `program_id` = ?',
        [principalId, programId],
        participant
      );
      expect(
        await insertToProgramParticipants(principalId, programId, roleId)
      ).toEqual(participant[0]);
    });
  });
});
