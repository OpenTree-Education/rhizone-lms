import { findQuestionnaire } from './questionnairesService';
import { tracker } from '../mockDb';

describe('questionnairesService', () => {
  describe('findQuestionnaire', () => {
    describe('with invalid id', () => {
      beforeEach(() => {
        tracker.on('query', ({ bindings, response, sql }) => {
          if (
            sql === 'select `id` from `questionnaires` where `id` = ? limit ?'
          ) {
            expect(bindings).toEqual([2, 1]);
            response([]);
          } else {
            throw new Error(`Unexpected query: ${sql}`);
          }
        });
      });

      it("should return null and skip further queries if the questionnaire id isn't in the database", async () => {
        expect(await findQuestionnaire(2)).toEqual(null);
      });
    });

    describe('with no prompts', () => {
      beforeEach(() => {
        tracker.on('query', ({ bindings, response, sql }) => {
          if (
            sql === 'select `id` from `questionnaires` where `id` = ? limit ?'
          ) {
            expect(bindings).toEqual([2, 1]);
            response([{ id: 2 }]);
          } else if (
            sql ===
            'select `id`, `label`, `query_text` from `prompts` where `questionnaire_id` = ? order by `sort_order` asc'
          ) {
            expect(bindings).toEqual([2]);
            response([]);
          } else {
            throw new Error(`Unexpected query: ${sql}`);
          }
        });
      });

      it('should return empty prompts and skip query for options if there are no prompts', async () => {
        expect(await findQuestionnaire(2)).toEqual({ id: 2, prompts: [] });
      });
    });

    describe('with valid data', () => {
      beforeEach(() => {
        tracker.on('query', ({ bindings, response, sql }) => {
          if (
            sql === 'select `id` from `questionnaires` where `id` = ? limit ?'
          ) {
            expect(bindings).toEqual([2, 1]);
            response([{ id: 2 }]);
          } else if (
            sql ===
            'select `id`, `label`, `query_text` from `prompts` where `questionnaire_id` = ? order by `sort_order` asc'
          ) {
            expect(bindings).toEqual([2]);
            response([
              { id: 3, label: 'label 3', query_text: 'query text 3' },
              { id: 5, label: 'label 5', query_text: 'query text 5' },
            ]);
          } else if (
            sql ===
            'select `id`, `label`, `prompt_id` from `options` where `prompt_id` in (?, ?) order by `prompt_id` asc'
          ) {
            expect(bindings).toEqual([3, 5]);
            response([
              { id: 7, label: 'option 7', prompt_id: 3 },
              { id: 11, label: 'option 11', prompt_id: 3 },
              { id: 13, label: 'option 13', prompt_id: 5 },
              { id: 17, label: 'option 17', prompt_id: 5 },
            ]);
          }
        });
      });

      it('should return nested options and prompts in the questionnaire', async () => {
        expect(await findQuestionnaire(2)).toEqual({
          id: 2,
          prompts: [
            {
              id: 3,
              label: 'label 3',
              options: [
                { id: 7, label: 'option 7', prompt_id: 3 },
                { id: 11, label: 'option 11', prompt_id: 3 },
              ],
              query_text: 'query text 3',
            },
            {
              id: 5,
              label: 'label 5',
              options: [
                { id: 13, label: 'option 13', prompt_id: 5 },
                { id: 17, label: 'option 17', prompt_id: 5 },
              ],
              query_text: 'query text 5',
            },
          ],
        });
      });
    });

    describe('when a database error occurs', () => {
      it('should throw the database error', () => {
        const databaseError = new Error();
        tracker.on('query', ({ reject }) => {
          reject(databaseError);
        });
        return expect(findQuestionnaire(2)).rejects.toBe(databaseError);
      });
    });
  });
});
