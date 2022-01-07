import { Router } from 'express';

import { BadRequestError, ValidationError } from '../httpErrors';
import { collectionEnvelope, itemEnvelope } from '../responseEnvelope';
import db from '../db';
import {
  listReflections,
  countReflections,
  validateOptionIds,
} from '../services/reflectionsService';
import paginationValues from '../paginationValues';

const reflectionsRouter = Router();

reflectionsRouter.post('/', async (req, res, next) => {
  const { principalId } = req.session;
  const rawText = req.body.raw_text;
  const selectedOptionIds: number[] = req.body.selected_option_ids || [];
  if (!rawText && selectedOptionIds.length === 0) {
    next(
      new BadRequestError(
        'At least one option or journal entry must be present to complete this request'
      )
    );
    return;
  }

  if (
    selectedOptionIds.length !== 0 &&
    !(await validateOptionIds(selectedOptionIds))
  ) {
    next(new ValidationError());
    return;
  }

  let insertedReflectionId: number[];
  try {
    await db.transaction(async trx => {
      insertedReflectionId = await trx('reflections').insert({
        principal_id: principalId,
      });

      if (rawText) {
        await trx('journal_entries').insert({
          raw_text: rawText,
          principal_id: principalId,
          reflection_id: insertedReflectionId[0],
        });
      }

      if (selectedOptionIds.length > 0) {
        await trx('responses').insert(
          selectedOptionIds.map(optionId => {
            return {
              option_id: optionId,
              reflection_id: insertedReflectionId[0],
              principal_id: principalId,
            };
          })
        );
      }
    });
  } catch (error) {
    next(error);
    return;
  }
  res.status(201).json(itemEnvelope({ id: insertedReflectionId[0] }));
});

reflectionsRouter.get('/', async (req, res, next) => {
  const { principalId } = req.session;
  const { limit, offset } = paginationValues(req.query.page, req.query.perpage);
  let reflections;
  let reflectionsCount;
  try {
    await db.transaction(async trx => {
      [reflections, reflectionsCount] = await Promise.all([
        listReflections(principalId, limit, offset, trx),
        countReflections(principalId, trx),
      ]);
    });
  } catch (err) {
    next(err);
    return;
  }
  res.json(collectionEnvelope(reflections, reflectionsCount));
});

export default reflectionsRouter;
