import db from './db';

export const getCurrentPage = async (principalId: number) => {
  const [currentPage] = await db('cool_feature')
    .select('page_number')
    .where('principal_id', principalId);
  return currentPage;
};

export const setCurrentPage = async (
  principalId: number,
  currentPage: number
) => {
  return await db.transaction(async trx => {
    const updatedInfo = await trx('cool_feature')
      .update({
        page_number: currentPage,
      })
      .where({ principal_id: principalId });
    return updatedInfo;
  });
};
