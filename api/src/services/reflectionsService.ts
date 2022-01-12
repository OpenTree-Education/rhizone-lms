import db from './db';

export const countReflections = async (principalId: number) => {
  const countAlias = 'total_count';
  const [count] = await db('reflections')
    .count({ [countAlias]: '*' })
    .where({ principal_id: principalId });
  return count[countAlias];
};

export const listReflections = async (
  principalId: number,
  limit: number,
  offset: number
) => {
  const reflections = await db('reflections')
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
    db('journal_entries')
      .select('id', 'raw_text', 'reflection_id')
      .whereIn('reflection_id', reflectionIds)
      .orderBy('id'),
    db('responses')
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

export const createReflection = async (
  rawText: string,
  optionIds: number[],
  principalId: number
) => {
  let reflectionId: number;
  await db.transaction(async trx => {
    [reflectionId] = await trx('reflections').insert({
      principal_id: principalId,
    });
    if (rawText) {
      await trx('journal_entries').insert({
        raw_text: rawText,
        principal_id: principalId,
        reflection_id: reflectionId,
      });
    }
    if (optionIds.length) {
      await trx('responses').insert(
        optionIds.map(optionId => ({
          option_id: optionId,
          reflection_id: reflectionId,
          principal_id: principalId,
        }))
      );
    }
  });
  return { id: reflectionId };
};
