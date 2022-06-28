import db from './db';

export const countCompetencies = async () => {
  const countAlias = 'total_count';
  const [count] = await db('competencies').count({ [countAlias]: '*' });
  return count[countAlias];
};

export const listCompetencies = async (limit: number, offset: number) => {
  const competencies = await db('competencies')
    .select('id', 'principal_id', 'label', 'description')
    .orderBy('label', 'asc')
    .orderBy('id', 'asc')
    .limit(limit)
    .offset(offset);

  return competencies;
};

export const createCompetency = async (
  principalId: number,
  label: string,
  description: string
) => {
  let competencyId: number;
  await db.transaction(async trx => {
    [competencyId] = await trx('competencies').insert({
      principal_id: principalId,
      label: label,
      description: description,
    });
    await trx('model_competencies').insert({
      competency_id: competencyId,
      principal_id: principalId,
    });
  });
  return { id: competencyId };
};

export const updateCompetency = async (
  id: number,
  label: string,
  description: string
) => {
  await db('competencies').where({ id }).update({ label, description });
};

export const authorizeCompetencyUpdate = async (
  principalId: number,
  competencyId: number
) => {
  const [competency] = await db('competencies')
    .select('id')
    .where({ id: competencyId, principal_id: principalId });

  return !!competency;
};

export const getAllCompetenciesByCategory = async (categoryId: number) => {
  const competencies = await db('competencies').select('*').where({
    category_id: categoryId,
  });
  return competencies;
};

export const listCategories = async () => {
  const categories = await db('categories')
    .select('id', 'label', 'description', 'image_url')
    .orderBy('label', 'asc')
    .orderBy('id', 'asc');
  return categories;
};
