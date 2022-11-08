import { Router } from 'express';

import { BadRequestError, NotFoundError, ValidationError } from './httpErrors';
import { collectionEnvelope, itemEnvelope } from './responseEnvelope';
import { findProgram } from '../services/programsService';
import { parsePaginationParams } from './paginationParamsMiddleware';

const programsRouter = Router();

programsRouter.get('/', parsePaginationParams(), async (req, res, next) => {
  const { limit, offset } = req.pagination;
  let programs;
  let programsCount;
  try {
    [programs, programsCount] = await Promise.all([
      listPrograms(limit, offset),
      countPrograms(),
    ]);
  } catch (err) {
    next(err);
    return;
  }
  res.json(collectionEnvelope(programs, programsCount));
});

export default programsRouter;
