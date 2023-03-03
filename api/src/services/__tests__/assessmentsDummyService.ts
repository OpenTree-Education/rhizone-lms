import {
  insertToProgramParticipants,
  insertToAssessmentSubmissions,
  insertToAssessmentResponses,
} from '../assessmentsDummyService';
import { mockQuery } from '../mockDb';

describe('assessmentsDummyService', () => {
  describe('insertToProgramParticipants', () => {
    it('Should check for principalId,programId and insert if not exist ', async () => {
      const participant = [
        {
          id: 1,
          principal_id: 3,
          program_id: 2,
          role_id: 1,
        },
      ];
      const principalId = 3;
      const programId = 2;
      const roleId = 1;
      const id = 1;
      mockQuery('BEGIN;');
      mockQuery(
        'select `id`,`principal_id`, `program_id`, `role_id` from `program_participants` where `principal_id` = ? and `program_id` = ?',
        [principalId, programId],
        [participant]
      );
      mockQuery(
        'insert into `program_participants` (`principal_id`, `program_id`,`role_id`) values (?, ?, ?)',
        [principalId, programId, roleId]
      );
      mockQuery('COMMIT;');
      expect(
        await insertToProgramParticipants(principalId, programId, roleId)
      ).toEqual(insertToProgramParticipants);
    });
  });
});
