import db from './db';

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
