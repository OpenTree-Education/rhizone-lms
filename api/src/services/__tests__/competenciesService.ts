import { listCompetencies } from '../competenciesService';
import { mockQuery } from '../mockDb';

describe('competenciesService', () => {
  describe('listCompetencies', () => {
    it('should query the lists of the competencies in the database with their labels and descriptions', async () => {
      const competencies = [
        {
          id: 2,
          label: 'label',
          description: 'description',
        },
      ];
      const limit = 3;
      const offset = 4;
      mockQuery(
        'select `id`, `label`, `description` from `competencies` limit ? offset ?',
        [limit, offset],
        competencies
      );
      expect(await listCompetencies(limit, offset)).toEqual(competencies);
    });
  });
});
