import db from './db';

export const listCompetencies = async (limit: number, offset: number) => {
  const competencies = await db('competencies')
    .select('id', 'label', 'description')
    .limit(limit)
    .offset(offset);

  return competencies;
};

export const createCompetency = async (
  principalId: number,
  label: string,
  description: string
) => {
  const [id] = await db('competencies').insert({
    principal_id: principalId,
    label: label,
    description: description,
  });
  return { id };
};
