import db from './db';

export const findDocBySlug = async (slug: string) => {
  const [doc] = await db('docs')
    .select('id', 'slug', 'title', 'content')
    .where({ slug });
  return doc || null;
};
