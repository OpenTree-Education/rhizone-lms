import db from './db';

export const countCompetencies = async () => {
  const countAlias = 'total_count';
  const [count] = await db('competencies').count({ [countAlias]: '*' });
  return count[countAlias];
};

export const listCompetencies = async (limit: number, offset: number) => {
  const competencies = await db('competencies')
    .select('id', 'label', 'description')
    .limit(limit)
    .offset(offset);

  return competencies;
};
