import { Router } from 'express';

import { BadRequestError, NotFoundError, ValidationError } from './httpErrors';
import { collectionEnvelope, itemEnvelope } from './responseEnvelope';
import {
  authorizeCompetencyUpdate,
  countCompetencies,
  createCompetency,
  listCompetencies,
  updateCompetency,
  getAllCompetenciesByCategory,
  listCategories,
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

competenciesRouter.put('/:id', async (req, res, next) => {
  const { principalId } = req.session;
  const { id } = req.params;

  const competencyId = Number(id);
  if (!Number.isInteger(competencyId) || competencyId < 1) {
    next(new BadRequestError(`"${id}" is not a valid competency id.`));
    return;
  }

  let isAuthorized;
  try {
    isAuthorized = await authorizeCompetencyUpdate(principalId, competencyId);
  } catch (error) {
    next(error);
    return;
  }
  if (!isAuthorized) {
    next(
      new NotFoundError(
        `A competency with the id "${competencyId}" could not be found.`
      )
    );
    return;
  }
  const { label, description } = req.body;
  if (typeof label !== 'string') {
    next(new ValidationError('label must be a string'));
    return;
  }
  if (typeof description !== 'string') {
    next(new ValidationError('description must be a string'));
    return;
  }
  try {
    await updateCompetency(competencyId, label, description);
  } catch (error) {
    next(error);
    return;
  }
  res.json(itemEnvelope({ id: competencyId }));
});

competenciesRouter.get('/categories', async (req, res, next) => {
  let categoriesWithCompetencies;
  try {
    const categories = await listCategories();

    categoriesWithCompetencies = await Promise.all(
      categories.map(async category => {
        const competencies = await getAllCompetenciesByCategory(category.id);
        return { ...category, competencies };
      })
    );
  } catch (error) {
    next(error);
    return;
  }
  res.json(
    collectionEnvelope(
      categoriesWithCompetencies,
      categoriesWithCompetencies.length
    )
  );
});

export default competenciesRouter;
