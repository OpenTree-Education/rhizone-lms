import { Router } from 'express';
import { collectionEnvelope } from './responseEnvelope';
import {
  countCompetencies,
  listCompetencies,
} from '../services/competenciesService';
import { parsePaginationParams } from './paginationParamsMiddleware';

const competenciesRouter = Router();

competenciesRouter.get('/', parsePaginationParams(), async (req, res, next) => {
  const { limit, offset } = req.pagination;
  let competencies;
  let competenciesCount;
  try {
    [competencies, competenciesCount] = await Promise.all([
      listCompetencies(limit, offset),
      countCompetencies(),
    ]);
  } catch (err) {
    next(err);
    return;
  }
  res.json(collectionEnvelope(competencies, competenciesCount));
});

export default competenciesRouter;
