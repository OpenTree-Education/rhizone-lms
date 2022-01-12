import {
  countReflections,
  createReflection,
  listReflections,
} from '../reflectionsService';
import { mockQuery } from '../mockDb';

describe('reflectionsService', () => {
  describe('countReflections', () => {
    it('should count the reflections owned by the principal with the given id', async () => {
      const principalId = 1;
      const reflectionsCount = 2;
      mockQuery(
        'select count(*) as `total_count` from `reflections` where `principal_id` = ?',
        [principalId],
        [{ total_count: reflectionsCount }]
      );
      expect(await countReflections(principalId)).toEqual(reflectionsCount);
    });
  });

  describe('listReflections', () => {
    it('should query for a page of the reflections owned by the principal with the given id, their journal entries and responses', async () => {
      const principalId = 1;
      const limit = 2;
      const offset = 3;
      const reflectionId = 4;
      const reflection = {
        id: reflectionId,
        created_at: '2000-01-01 00:00:00',
      };
      const journalEntries = [
        { id: 5, raw_text: 'test', reflection_id: reflectionId },
      ];
      const responseId = 6;
      const optionId = 7;
      const promptId = 8;
      const optionLabel = 'option label';
      const promptLabel = 'prompt label';
      const responses = [
        {
          id: responseId,
          reflection_id: reflectionId,
          option_id: optionId,
          option_label: optionLabel,
          prompt_id: promptId,
          prompt_label: promptLabel,
        },
      ];
      mockQuery(
        'select `id`, `created_at` from `reflections` where `principal_id` = ? order by `created_at` desc limit ? offset ?',
        [principalId, limit, offset],
        [reflection]
      );
      mockQuery(
        'select `id`, `raw_text`, `reflection_id` from `journal_entries` where `reflection_id` in (?) order by `id` asc',
        [reflectionId],
        journalEntries
      );
      mockQuery(
        'select `responses`.`id` as `id`, `reflection_id` as `reflection_id`, `option_id` as `option_id`, `options`.`label` as `option_label`, `prompt_id` as `prompt_id`, `prompts`.`label` as `prompt_label` from `responses` inner join `options` on `responses`.`option_id` = `options`.`id` inner join `prompts` on `options`.`prompt_id` = `prompts`.`id` where `reflection_id` in (?) order by `prompts`.`sort_order` asc',
        [reflectionId],
        responses
      );
      expect(await listReflections(principalId, limit, offset)).toEqual([
        {
          ...reflection,
          journal_entries: journalEntries,
          responses: [
            {
              id: responseId,
              option: {
                id: optionId,
                label: optionLabel,
                prompt: { id: promptId, label: promptLabel },
              },
            },
          ],
        },
      ]);
    });

    it('should not query for journal entries and responses if no reflections were found', async () => {
      const principalId = 1;
      const limit = 2;
      const offset = 3;
      mockQuery(
        'select `id`, `created_at` from `reflections` where `principal_id` = ? order by `created_at` desc limit ? offset ?',
        [principalId, limit, offset],
        []
      );
      expect(await listReflections(1, 2, 3)).toEqual([]);
    });
  });

  describe('createReflection', () => {
    it('should create a reflection with the given journal entry text and responses in a transaction', async () => {
      mockQuery('BEGIN;');
      mockQuery(
        'insert into `reflections` (`principal_id`) values (?)',
        [2],
        [3]
      );
      mockQuery(
        'insert into `journal_entries` (`principal_id`, `raw_text`, `reflection_id`) values (?, ?, ?)',
        [2, 'test', 3],
        [4]
      );
      mockQuery(
        'insert into `responses` (`option_id`, `principal_id`, `reflection_id`) values (?, ?, ?)',
        [1, 2, 3],
        [5]
      );
      mockQuery('COMMIT;');
      expect(await createReflection('test', [1], 2)).toEqual({ id: 3 });
    });
  });
});
