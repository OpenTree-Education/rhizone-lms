const paginationValues = (
  page: unknown,
  perPage: unknown,
  defaultPage = 1,
  defaultPerPage = 50
) => {
  const pageNumber = Number(page) || defaultPage;
  const limit = Number(perPage) || defaultPerPage;
  const offset = (pageNumber - 1) * limit;
  return { limit, offset };
};

export default paginationValues;
