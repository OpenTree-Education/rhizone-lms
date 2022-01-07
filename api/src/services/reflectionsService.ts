import db from '../db';

export const countReflections = async (principalId: number, builder = db) => {
  const countAlias = 'total_count';
  const reflectionsCounts = await builder('reflections')
    .count({ [countAlias]: '*' })
    .where({ principal_id: principalId });
  return reflectionsCounts[0][countAlias];
};

export const listReflections = async (
  principalId: number,
  limit: number,
  offset: number,
  builder = db
) => {
  const reflections = await builder('reflections')
    .select('id', 'created_at')
    .where({ principal_id: principalId })
    .orderBy('created_at', 'desc')
    .limit(limit)
    .offset(offset);
  if (reflections.length === 0) {
    return [];
  }
  const reflectionIds = reflections.map(({ id }) => id);
  const [journalEntries, responses] = await Promise.all([
    builder('journal_entries')
      .select('id', 'raw_text', 'reflection_id')
      .whereIn('reflection_id', reflectionIds)
      .orderBy('id'),
    builder('responses')
      .select({
        id: 'responses.id',
        reflection_id: 'reflection_id',
        option_id: 'option_id',
        option_label: 'options.label',
        prompt_id: 'prompt_id',
        prompt_label: 'prompts.label',
      })
      .join('options', 'responses.option_id', 'options.id')
      .join('prompts', 'options.prompt_id', 'prompts.id')
      .whereIn('reflection_id', reflectionIds)
      .orderBy('prompts.sort_order'),
  ]);
  const reflectionsById = new Map();
  for (const reflection of reflections) {
    reflectionsById.set(reflection.id, {
      ...reflection,
      journal_entries: [],
      responses: [],
    });
  }
  for (const journalEntry of journalEntries) {
    reflectionsById
      .get(journalEntry.reflection_id)
      .journal_entries.push(journalEntry);
  }
  for (const response of responses) {
    reflectionsById.get(response.reflection_id).responses.push({
      id: response.id,
      option: {
        id: response.option_id,
        label: response.option_label,
        prompt: {
          id: response.prompt_id,
          label: response.prompt_label,
        },
      },
    });
  }
  return Array.from(reflectionsById.values());
};

export const validateOptionIds = async (optionIds: number[], builder = db) => {
  const uniqueOptionIds = [...new Set(optionIds)];
  const optionIdsCount = await builder('options')
    .count('id', { as: 'option_id_count' })
    .whereIn('id', uniqueOptionIds);
  return optionIdsCount[0].option_id_count === uniqueOptionIds.length;
};
