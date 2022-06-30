import {
  createCompetencyCategoryQuestionnaire,
  findQuestionnaire,
  getQuestionnaireFromCategoryId,
} from '../questionnairesService';
import { mockQuery } from '../mockDb';
import { getAllCompetenciesByCategory } from '../competenciesService';
import { mock } from 'mock-knex';

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
    it('should create new competency questionnaire based on category', async () => {
      const categoryId = 1;
      const promptId = 1;
      const optionId = 2;
      const optionLabel = 'Aware';
      const promptLabel = 'Outlook';
      const numericValue = 1;
      const sortOrder = 0;
      const questionnaireId = 1;
      const categoryQuestionnaireId = 1;
      const queryText =
        'What rating would you give yourself in this competency?';

      const competencies = [
        {
          id: 2,
          label: promptLabel,
          description: 'description',
          principal_id: 1,
          category_id: categoryId,
        },
      ];
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
      const questionnaire = [{ questionnaire_Id: questionnaireId }];
      // mockQuery('BEGIN;');

      mockQuery(
        'select * from `competencies` where `category_id` = ?',
        [categoryId],
        competencies
      );
      // expect(await getAllCompetenciesByCategory(categoryId)).toEqual(
      //   competencies
      // );
      mockQuery(
        'insert into `questionnaires` () values ()',
        [],
        [questionnaireId]
      );
      mockQuery(
        'insert into `categories_questionnaires` (`category_id`, `questionnaire_id`) values (?,?)',
        [categoryId, questionnaireId],
        [categoryQuestionnaireId]
      );
      mockQuery(
        'insert into `prompts` (`label`, `query_text`, `sort_order`, `questionnaire_id`) values (?,?,?,?)',
        [promptLabel, queryText, sortOrder, questionnaireId],
        [promptId]
      );
      mockQuery(
        'insert into `options` (`label`, `numeric_value`, `sort_order`, `prompt_id`) values (?,?,?,?)',
        [optionLabel, numericValue, sortOrder, promptId],
        [optionId]
      );
      // mockQuery('COMMIT;');
      expect(await getAllCompetenciesByCategory(categoryId)).toEqual(
        competencies
      );
      expect(await createCompetencyCategoryQuestionnaire(categoryId)).toEqual(
        questionnaireId
      );
    });
  });

  // Writing a test for getQuestionnaireFromCategoryId function
  // describe('getQuestionnaireFromCategoryId', () => {
  //   it('should retrieve a questionnaire by passing a categoryId', async () => {
  //     const categoryId = 1;
  //     const questionnaireId = 1;
  //     const questionnaire = { id: questionnaireId };
  //     const category = { id: categoryId };
  //     const promptId = 1;
  //     const prompt = {
  //       id: promptId,
  //       label: 'prompt label',
  //       query_text: 'query text',
  //     };
  //     const options = [{ id: 3, label: 'option label', prompt_id: promptId }];
  //     mockQuery(
  //       'select `id` from `questionnaires` where `id` = ?',
  //       [questionnaireId],
  //       [questionnaire]
  //     );
  //     mockQuery(
  //       'select `id`, `label`, `query_text` from `prompts` where `questionnaire_id` = ? order by `sort_order` asc',
  //       [questionnaireId],
  //       [prompt]
  //     );
  //     mockQuery(
  //       'select `id`, `label`, `prompt_id` from `options` where `prompt_id` in (?) order by `prompt_id` asc',
  //       [promptId],
  //       options
  //     );
  //     expect(await getQuestionnaireFromCategoryId(categoryId)).toEqual({
  //       ...questionnaire,
  //       prompts: [{ ...prompt, options }],
  //     });
  //   });
  // });
});
