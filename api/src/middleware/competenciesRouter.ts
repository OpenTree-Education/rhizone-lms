import { Router } from 'express';

import { ValidationError } from './httpErrors';
import { collectionEnvelope, itemEnvelope } from './responseEnvelope';
import {
  countCompetencies,
  listCompetencies,
  createCompetency,
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

competenciesRouter.post('/', async (req, res, next) => {
  const { principalId } = req.session;
  const { label, description } = req.body;
  if (typeof label !== 'string') {
    next(new ValidationError('label must be a string'));
    return;
  }
  if (typeof description !== 'string') {
    next(new ValidationError('description must be a string'));
    return;
  }
  let competency;
  try {
    competency = await createCompetency(principalId, label, description);
  } catch (error) {
    next(error);
    return;
  }
  res.status(201).json(itemEnvelope(competency));
});

export default competenciesRouter;
