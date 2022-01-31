import db from './db';

export const listCompetencies = async (limit: number, offset: number) => {
  const competencies = await db('competencies')
    .select('id', 'label', 'description')
    .limit(limit)
    .offset(offset);

  return competencies;
};
