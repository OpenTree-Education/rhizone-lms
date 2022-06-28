import {
  authorizeCompetencyUpdate,
  countCompetencies,
  listCompetencies,
  createCompetency,
  updateCompetency,
  getAllCompetenciesByCategory,
  listCategories,
} from '../competenciesService';
import { mockQuery } from '../mockDb';

describe('competenciesService', () => {
  describe('countCompetencies', () => {
    it('should count all the competencies in the database', async () => {
      const competenciesCount = 2;
      mockQuery(
        'select count(*) as `total_count` from `competencies`',
        [],
        [{ total_count: competenciesCount }]
      );
      expect(await countCompetencies()).toEqual(competenciesCount);
    });
  });

  describe('listCompetencies', () => {
    it('should query the lists of the competencies in the database with their labels and descriptions', async () => {
      const competencies = [
        {
          id: 2,
          label: 'label',
          description: 'description',
          principal_id: 3,
        },
      ];
      const limit = 4;
      const offset = 5;
      mockQuery(
        'select `id`, `principal_id`, `label`, `description` from `competencies` order by `label` asc, `id` asc limit ? offset ?',
        [limit, offset],
        competencies
      );
      expect(await listCompetencies(limit, offset)).toEqual(competencies);
    });
  });

  describe('createCompetency', () => {
    it('should create a competency and model competency in a transaction', async () => {
      const principalId = 2;
      const label = 'label';
      const description = 'description';
      const competencyId = 3;
      const modelCompetencyId = 4;
      mockQuery('BEGIN;');
      mockQuery(
        'insert into `competencies` (`description`, `label`, `principal_id`) values (?, ?, ?)',
        [description, label, principalId],
        [competencyId]
      );
      mockQuery(
        'insert into `model_competencies` (`competency_id`, `principal_id`) values (?, ?)',
        [competencyId, principalId],
        [modelCompetencyId]
      );
      mockQuery('COMMIT;');
      expect(await createCompetency(principalId, label, description)).toEqual({
        id: competencyId,
      });
    });
  });

  describe('updateCompetency', () => {
    it('should update the specified/selected competency', async () => {
      const id = 2;
      const label = 'label';
      const description = 'description';
      mockQuery(
        'update `competencies` set `label` = ?, `description` = ? where `id` = ?',
        [label, description, id],
        1
      );
      await updateCompetency(id, label, description);
    });
  });

  describe('authorizeCompetencyUpdate', () => {
    it('should return true if user is authorized to update specific competency', async () => {
      const principalId = 2;
      const competencyId = 3;
      mockQuery(
        'select `id` from `competencies` where `id` = ? and `principal_id` = ?',
        [competencyId, principalId],
        [{ id: competencyId }]
      );
      expect(
        await authorizeCompetencyUpdate(principalId, competencyId)
      ).toEqual(true);
    });

    it('should return false if user is not authorized to update the specific competency', async () => {
      const principalId = 2;
      const competencyId = 3;
      mockQuery(
        'select `id` from `competencies` where `id` = ? and `principal_id` = ?',
        [competencyId, principalId],
        []
      );
      expect(
        await authorizeCompetencyUpdate(principalId, competencyId)
      ).toEqual(false);
    });
  });

  describe('getAllCompetenciesByCategory', () => {
    it('should return competencies based on the category_id', async () => {
      const competencies = [
        {
          id: 2,
          label: 'label',
          description: 'description',
          principal_id: 1,
        },
      ];
      const categoryId = 4;
      mockQuery(
        'select * from `competencies` where `category_id` = ?',
        [categoryId],
        competencies
      );
      expect(await getAllCompetenciesByCategory(categoryId)).toEqual(
        competencies
      );
    });
  });

  describe('listCategories', () => {
    it('should query the lists of the categories in the database with their labels and descriptions', async () => {
      const categories = [
        {
          id: 2,
          label: 'label',
          description: 'description',
          image_url: 'image_url',
        },
      ];
      mockQuery(
        'select `id`, `label`, `description`, `image_url` from `categories` order by `label` asc, `id` asc',
        [],
        categories
      );
      expect(await listCategories()).toEqual(categories);
    });
  });
});
