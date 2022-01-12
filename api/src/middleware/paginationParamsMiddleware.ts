import { NextFunction, Request, Response } from 'express';

export const parsePaginationParams =
  (defaultPage = 1, defaultPerPage = 50) =>
  (req: Request, res: Response, next: NextFunction) => {
    const pageNumber = Number(req.query.page) || defaultPage;
    const limit = Number(req.query.perpage) || defaultPerPage;
    const offset = (pageNumber - 1) * limit;
    req.pagination = { limit, offset };
    next();
  };
