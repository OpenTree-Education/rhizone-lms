import db from './db';

export const findSettings = async (category: string) => {
  const settings = await db('settings')
    .select('content', 'property')
    .where({ category })
    .orderBy('property');
  return settings.reduce(
    (mappedSettings, { content, property }) => ({
      ...mappedSettings,
      [property]: content,
    }),
    // All items should have an `id` property for API consistency
    { id: category }
  );
};
