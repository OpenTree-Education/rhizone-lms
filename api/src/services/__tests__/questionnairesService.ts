import {
  createCompetencyCategoryQuestionnaire,
  findQuestionnaire,
  getQuestionnaireFromCategoryId,
} from '../questionnairesService';
import { mockQuery } from '../mockDb';
import { getAllCompetenciesByCategory } from '../competenciesService';

jest.mock('../competenciesService');
const mockGetAllCompetenciesByCategory = jest.mocked(
  getAllCompetenciesByCategory
);

//
// jest.mock('../questionnairesService');
const mockCreateCompetencyCategoryQuestionnaire = jest.mocked(
  createCompetencyCategoryQuestionnaire
);

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

  describe('createCompetencyCategoryQuestionnaire', () => {
    it('should create new competency questionnaire based on category', async () => {
      const categoryId = 1;
      const promptId = 1;
      const promptLabel = 'Outlook';
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

      mockGetAllCompetenciesByCategory.mockResolvedValue(competencies);

      mockQuery(
        'insert into `questionnaires` () values ()',
        [],
        [questionnaireId]
      );
      mockQuery(
        'insert into `categories_questionnaires` (`category_id`, `questionnaire_id`) values (?, ?)',
        [categoryId, questionnaireId],
        [categoryQuestionnaireId]
      );
      mockQuery(
        'insert into `prompts` (`label`, `query_text`, `questionnaire_id`, `sort_order`) values (?, ?, ?, ?)',
        [promptLabel, queryText, questionnaireId, 1],
        [promptId]
      );
      mockQuery(
        'insert into `options` (`label`, `numeric_value`, `prompt_id`, `sort_order`) values (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?)',
        [
          'Aware',
          1,
          promptId,
          1,
          'Novice',
          2,
          promptId,
          2,
          'Intermediate',
          3,
          promptId,
          3,
          'Advanced',
          4,
          promptId,
          4,
          'Expert',
          5,
          promptId,
          5,
        ]
      );
      expect(await createCompetencyCategoryQuestionnaire(categoryId)).toEqual(
        questionnaireId
      );
    });

    // The test below runs successfully! Change the second test below (commented out)
    it('should return null if given invalid category id', async () => {
      const categoryId = 90;

      mockGetAllCompetenciesByCategory.mockResolvedValue(null);

      expect(await createCompetencyCategoryQuestionnaire(categoryId)).toEqual(
        null
      );
    });
  });

  describe('getQuestionnaireFromCategoryId', () => {
    it('should retrieve a questionnaire by passing a category id', async () => {
      const categoryId = 1;
      const questionnaireId = 2;
      const categoryQuestionnaire = {
        questionnaire_id: questionnaireId,
      };

      mockQuery(
        'select `questionnaire_id` from `categories_questionnaires` where `category_id` = ?',
        [categoryId],
        [categoryQuestionnaire]
      );

      expect(await getQuestionnaireFromCategoryId(categoryId)).toEqual(
        questionnaireId
      );
    });

    // The test below should be changed
    it('should create a questionnaire if no questionnaire was found with the given category id', async () => {
      const categoryId = 1;
      const questionnaireId = 1;
      // const categoryQuestionnaire = {
      //   questionnaire_id: questionnaireId,
      // };

      mockQuery(
        'insert into `questionnaires` () values ()',
        [],
        [questionnaireId]
      );

      expect(await getQuestionnaireFromCategoryId(categoryId)).toEqual(null);
      // expect(mockCreateCompetencyCategoryQuestionnaire).toHaveBeenCalledTimes(
      //   1
      // );

      expect(await getQuestionnaireFromCategoryId(categoryId)).toEqual(
        questionnaireId
      );
    });
  });
});
