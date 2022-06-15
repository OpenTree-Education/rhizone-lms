import db from './db';
import { getAllCompetenciesByCategory } from './competenciesService';

export const findQuestionnaire = async (questionnaireId: number) => {
  const [questionnaire] = await db('questionnaires')
    .select('id')
    .where({ id: questionnaireId });
  if (!questionnaire) {
    return null;
  }
  const prompts = await db('prompts')
    .select('id', 'label', 'query_text')
    .where({
      questionnaire_id: questionnaireId,
    })
    .orderBy('sort_order');
  const promptIds = prompts.map(({ id }) => id);
  const promptsById = new Map();
  let options;
  if (promptIds.length) {
    options = await db('options')
      .select('id', 'label', 'prompt_id')
      .whereIn('prompt_id', promptIds)
      .orderBy('prompt_id', 'sort_order');
  }
  for (const prompt of prompts) {
    promptsById.set(prompt.id, { ...prompt, options: [] });
  }
  if (options) {
    for (const option of options) {
      promptsById.get(option.prompt_id).options.push(option);
    }
  }
  return {
    ...questionnaire,
    prompts: Array.from(promptsById.values()),
  };
};

export const createCompetencyCategoryQuestionnaire = async (
  categoryId: number
) => {
  const competencies = await getAllCompetenciesByCategory(categoryId);
  const [questionnaireId] = await db('questionnaires').insert({});

  let sortOrder = 0;
  competencies.forEach(async competency => {
    sortOrder++;
    const [promptId] = await db('prompts').insert({
      label: competency.label,
      query_text: 'How would you rate yourself in this competency?',
      sort_order: sortOrder,
      questionnaire_id: questionnaireId,
    });

    await db('options').insert([
      {
        label: 'Aware',
        numeric_value: 1,
        sort_order: 1,
        prompt_id: promptId,
      },
      { label: 'Novice', numeric_value: 2, sort_order: 2, prompt_id: promptId },
      {
        label: 'Intermediate',
        numeric_value: 3,
        sort_order: 3,
        prompt_id: promptId,
      },
      {
        label: 'Advanced',
        numeric_value: 4,
        sort_order: 4,
        prompt_id: promptId,
      },
      { label: 'Expert', numeric_value: 5, sort_order: 5, prompt_id: promptId },
    ]);
  });

  return questionnaireId;
};
