import {
  createCompetencyCategoryQuestionnaire,
  findQuestionnaire,
  getQuestionnaireFromCategoryId,
} from '../questionnairesService';
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
  //Writing a test for createCompetencyCategoryQuestionnaire function
  describe('createCompetencyCategoryQuestionnaire', () => {
    it('should create new competency based on category', async () => {
      const categoryId = 1;
      const promptId = 1;
      const optionLabel = 'Aware';
      const promptLabel = 'Outlook';
      const numericValue = 1;
      const sortOrder = 4;
      const questionnaireId = 1;
      const queryText =
        'What rating would you give yourself in this competency';
      const prompts = [
        {
          label: promptLabel,
          query_text: queryText,
          sort_order: sortOrder,
          questionnaire_id: questionnaireId,
        },
      ];
      const options = [
        {
          label: optionLabel,
          numeric_value: numericValue,
          sort_order: sortOrder,
          prompt_id: promptId,
        },
      ];

      mockQuery(
        'insert into `prompts` (`label`, `query_text`, `sort_order`, `questionnaire_id`) values (?,?,?,?)',
        [promptLabel, queryText, sortOrder, questionnaireId],
        prompts
      );
      mockQuery(
        'insert into `options` (`label`, `numeric_value`, `sort_order`, `prompt_id`) values (?,?,?,?)',
        [optionLabel, numericValue, sortOrder, promptId],
        options
      );
      expect(await createCompetencyCategoryQuestionnaire(categoryId)).toEqual(
        prompts
      );
    });
  });

  //Writing a test for getQuestionnaireFromCategoryId function
  // describe('getQuestionnaireFromCategoryId', () => {
  //   it('should get questionnaire by passing a categoryId', async () => {
  //     const categoryId = 1;
  //     const category = { id: categoryId };
  //     const promptId = 2;
  //     const prompt = {
  //       id: promptId,
  //       label: 'prompt label',
  //       query_text: 'query text',
  //     };
  //     mockQuery('select `` from `categories');
  //     mockQuery(
  //       'select `id`, `label`, `query_text` from `prompts` where `prompt_id` in (?)'
  //     );
  //     expect(await getQuestionnaireFromCategoryId(categoryId)).toEqual({});
  //   });
  // });
});
