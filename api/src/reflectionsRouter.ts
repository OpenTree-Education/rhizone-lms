import { Router } from 'express';

import { BadRequestError } from './httpErrors';
import { collectionEnvelope, itemEnvelope } from './responseEnvelope';
import db from './db';
import { listReflections, countReflections } from './reflectionsService';
import paginationValues from './paginationValues';

const reflectionsRouter = Router();

interface Option {
  id: number;
}

reflectionsRouter.post('/', async (req, res, next) => {
  const { principalId } = req.session;
  const rawText = req.body.raw_text;
  const options: Array<Option> | [] = req.body.options ? req.body.options : [];
  if (!rawText) {
    next(
      new BadRequestError(
        'At least one option or journal entry must be present to complete this request'
      )
    );
    return;
  }
  let insertedReflectionId: number[];
  try {
    await db.transaction(async trx => {
      insertedReflectionId = await trx('reflections').insert({
        principal_id: principalId,
      });
      await trx('journal_entries').insert({
        raw_text: rawText,
        principal_id: principalId,
        reflection_id: insertedReflectionId[0],
      });

      if (options.length > 0) {
        await trx('responses').insert(
          options.map(option => {
            return {
              option_id: option.id,
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