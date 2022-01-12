import { Router } from 'express';

import { BadRequestError, ValidationError } from './httpErrors';
import { collectionEnvelope, itemEnvelope } from './responseEnvelope';
import {
  countReflections,
  createReflection,
  listReflections,
} from '../services/reflectionsService';
import { parsePaginationParams } from './paginationParamsMiddleware';

const reflectionsRouter = Router();

reflectionsRouter.get('/', parsePaginationParams(), async (req, res, next) => {
  const { principalId } = req.session;
  const { limit, offset } = req.pagination;
  let reflections;
  let reflectionsCount;
  try {
    [reflections, reflectionsCount] = await Promise.all([
      listReflections(principalId, limit, offset),
      countReflections(principalId),
    ]);
  } catch (err) {
    next(err);
    return;
  }
  res.json(collectionEnvelope(reflections, reflectionsCount));
});

reflectionsRouter.post('/', async (req, res, next) => {
  const { principalId } = req.session;
  const { raw_text: rawText, selected_option_ids: selectedOptionIds } =
    req.body;
  const optionIds = Array.isArray(selectedOptionIds) ? selectedOptionIds : [];
  if (!rawText && !optionIds.length) {
    next(
      new BadRequestError(
        'At least one option id or journal entry text must be given to create a reflection.'
      )
    );
    return;
  }
  if (optionIds.some(optionId => !Number.isInteger(optionId) || optionId < 1)) {
    next(
      new ValidationError(
        `selected_option_ids must be an array of positive integers.`
      )
    );
    return;
  }
  let reflection;
  try {
    reflection = await createReflection(rawText, optionIds, principalId);
  } catch (error) {
    next(error);
    return;
  }
  res.status(201).json(itemEnvelope(reflection));
});

export default reflectionsRouter;
