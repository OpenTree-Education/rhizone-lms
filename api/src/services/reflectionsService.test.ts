import { Knex } from 'knex';

import { countReflections, listReflections } from './reflectionsService';
import db from '../db';
import { tracker } from '../mockDb';

describe('reflectionsService', () => {
  describe('countReflections', () => {
    describe('with valid state', () => {
      const principalId = 3;
      const totalCount = 5;

      beforeEach(() => {
        tracker.on('query', ({ bindings, response, sql }) => {
          if (
            sql ===
            'select count(*) as `total_count` from `reflections` where `principal_id` = ?'
          ) {
            expect(bindings).toEqual([principalId]);
            response([{ total_count: totalCount }]);
          }
        });
      });

      it('should count the number of reflections belonging to the given principal', async () => {
        expect(await countReflections(principalId)).toEqual(totalCount);
      });

      it('should use the provided query builder', async () => {
        const mockBuilder = jest.fn(db);
        await countReflections(principalId, mockBuilder as unknown as Knex);
        expect(mockBuilder).toHaveBeenCalledWith('reflections');
      });
    });

    describe('when a database error occurs', () => {
      it('should throw the database error', () => {
        const databaseError = new Error();
        tracker.on('query', ({ reject }) => {
          reject(databaseError);
        });
        return expect(countReflections(1)).rejects.toBe(databaseError);
      });
    });
  });

  describe('listReflections', () => {
    describe('with valid state', () => {
      const principalId = 3;
      const limit = 5;
      const offset = 7;

      beforeEach(() => {
        tracker.on('query', ({ bindings, response, sql }) => {
          if (
            sql ===
            'select `id`, `created_at` from `reflections` where `principal_id` = ? order by `created_at` desc limit ? offset ?'
          ) {
            expect(bindings).toEqual([principalId, limit, offset]);
            response([
              { id: 11, created_at: '2000-01-03T00:00:00.0000Z' },
              { id: 13, created_at: '2000-01-02T00:00:00.0000Z' },
              { id: 17, created_at: '2000-01-01T00:00:00.0000Z' },
            ]);
          } else if (
            sql ===
            'select `id`, `raw_text`, `reflection_id` from `journal_entries` where `reflection_id` in (?, ?, ?) order by `id` asc'
          ) {
            expect(bindings).toEqual([11, 13, 17]);
            response([
              {
                id: 19,
                raw_text: 'Journal entry A.',
                reflection_id: 11,
              },
              {
                id: 23,
                raw_text: 'Journal entry B.',
                reflection_id: 13,
              },
            ]);
          } else if (
            sql ===
            'select `responses`.`id` as `id`, `reflection_id` as `reflection_id`, `option_id` as `option_id`, `options`.`label` as `option_label`, `prompt_id` as `prompt_id`, `prompts`.`label` as `prompt_label` from `responses` inner join `options` on `responses`.`option_id` = `options`.`id` inner join `prompts` on `options`.`prompt_id` = `prompts`.`id` where `reflection_id` in (?, ?, ?) order by `prompts`.`sort_order` asc'
          ) {
            expect(bindings).toEqual([11, 13, 17]);
            response([
              {
                id: 29,
                reflection_id: 13,
                option_id: 31,
                option_label: 'Option A',
                prompt_id: 37,
                prompt_label: 'Prompt A',
              },
              {
                id: 41,
                reflection_id: 17,
                option_id: 43,
                option_label: 'Option B',
                prompt_id: 47,
                prompt_label: 'Prompt B',
              },
            ]);
          }
        });
      });

      it('should return reflections with nested journal entries and responses', async () => {
        expect(await listReflections(principalId, limit, offset)).toEqual([
          {
            created_at: '2000-01-03T00:00:00.0000Z',
            id: 11,
            journal_entries: [
              {
                id: 19,
                raw_text: 'Journal entry A.',
                reflection_id: 11,
              },
            ],
            responses: [],
          },
          {
            created_at: '2000-01-02T00:00:00.0000Z',
            id: 13,
            journal_entries: [
              {
                id: 23,
                raw_text: 'Journal entry B.',
                reflection_id: 13,
              },
            ],
            responses: [
              {
                id: 29,
                option: {
                  id: 31,
                  label: 'Option A',
                  prompt: {
                    id: 37,
                    label: 'Prompt A',
                  },
                },
              },
            ],
          },
          {
            created_at: '2000-01-01T00:00:00.0000Z',
            id: 17,
            journal_entries: [],
            responses: [
              {
                id: 41,
                option: {
                  id: 43,
                  label: 'Option B',
                  prompt: {
                    id: 47,
                    label: 'Prompt B',
                  },
                },
              },
            ],
          },
        ]);
      });
    });

    describe('with zero reflections', () => {
      beforeEach(() => {
        tracker.on('query', ({ response, sql }) => {
          if (
            sql ===
            'select `id`, `created_at` from `reflections` where `principal_id` = ? order by `created_at` desc limit ? offset ?'
          ) {
            response([]);
          } else {
            throw new Error(`Unexpected query: ${sql}`);
          }
        });
      });

      it('should not query journal entries or responses if there are no reflections', async () => {
        expect(await listReflections(3, 5, 7)).toEqual([]);
      });
    });

    describe('when a database error occurs', () => {
      it('should throw the database error', () => {
        const databaseError = new Error();
        tracker.on('query', ({ reject }) => {
          reject(databaseError);
        });
        return expect(listReflections(3, 5, 7)).rejects.toBe(databaseError);
      });
    });
  });
});
