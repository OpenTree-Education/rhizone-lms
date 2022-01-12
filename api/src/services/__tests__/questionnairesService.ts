import { findQuestionnaire } from '../questionnairesService';
import { mockQuery } from '../mockDb';

describe('questionnairesService', () => {
  describe('findQuestionnaire', () => {
    it('should query for the questionnaire with the given id, its prompts and their options', async () => {
      const questionnaireId = 1;
      const questionnaire = { id: questionnaireId };
      const promptId = 2;
      const prompt = {
        id: promptId,
        label: 'prompt label',
        query_text: 'query text',
      };
      const options = [{ id: 3, label: 'option label', prompt_id: promptId }];
      mockQuery(
        'select `id` from `questionnaires` where `id` = ?',
        [questionnaireId],
        [questionnaire]
      );
      mockQuery(
        'select `id`, `label`, `query_text` from `prompts` where `questionnaire_id` = ? order by `sort_order` asc',
        [questionnaireId],
        [prompt]
      );
      mockQuery(
        'select `id`, `label`, `prompt_id` from `options` where `prompt_id` in (?) order by `prompt_id` asc',
        [promptId],
        options
      );
      expect(await findQuestionnaire(questionnaireId)).toEqual({
        ...questionnaire,
        prompts: [{ ...prompt, options }],
      });
    });

    it('should return null if no questionnaire was found with the given id', async () => {
      const questionnaireId = 1;
      mockQuery(
        'select `id` from `questionnaires` where `id` = ?',
        [questionnaireId],
        []
      );
      expect(await findQuestionnaire(questionnaireId)).toEqual(null);
    });
  });
});
