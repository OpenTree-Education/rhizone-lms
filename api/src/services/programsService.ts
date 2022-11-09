import db from './db';

export const findProgram = async () => {
  const countAlias = 'total_count';
  const [count] = await db('programs').count({ [countAlias]: '*' });
  return count[countAlias];
};
