import db from './db';

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
  const reflectionIds = reflections.map(({ id }) => id);
  const [journalEntries, responseOptionPrompts] = await Promise.all([
    builder('journal_entries')
      .select('id', 'raw_text', 'reflection_id')
      .whereIn('reflection_id', reflectionIds)
      .orderBy('id'),
    builder('responses')
      .select({
        responseId: 'responses.id',
        responseReflectionId: 'responses.reflection_id',
        optionId: 'options.id',
        optionLabel: 'options.label',
        promptId: 'prompts.id',
        promptLabel: 'prompts.label',
      })
      .join('options', 'responses.option_id', 'options.id')
      .join('prompts', 'options.prompt_id', 'prompts.id')
      .whereIn('reflection_id', reflectionIds)
      .orderBy('prompts.sort_order'),
  ]);
  const reflectionsById = reflections.reduce(
    (byId, reflection) =>
      byId.set(reflection.id, {
        ...reflection,
        journal_entries: [],
        responses: [],
      }),
    new Map()
  );
  journalEntries.forEach(journalEntry => {
    reflectionsById
      .get(journalEntry.reflection_id)
      .journal_entries.push(journalEntry);
  });
  responseOptionPrompts.forEach(
    ({
      responseId,
      responseReflectionId,
      optionId,
      optionLabel,
      promptId,
      promptLabel,
    }) => {
      reflectionsById.get(responseReflectionId).responses.push({
        id: responseId,
        option: {
          id: optionId,
          label: optionLabel,
          prompt: {
            id: promptId,
            label: promptLabel,
          },
        },
      });
    }
  );
  return Array.from(reflectionsById.values());
};
