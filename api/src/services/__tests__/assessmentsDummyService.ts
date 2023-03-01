import {
  insertToProgramParticipants,
  insertToAssessmentSubmissions,
  insertToAssessmentResponses


}from'../assessmentsDummyService';
import { mockQuery } from '../mockDb';

describe('assessmentsDummyService', () => {
  describe('', () => {
    it('', async () => {
      const competenciesCount = 2;
      mockQuery(
        'select count(*) as `total_count` from `competencies`',
        [],
        [{ total_count: competenciesCount }]
      );
      // expect(await countCompetencies()).toEqual(competenciesCount);
    });
  });
  
});