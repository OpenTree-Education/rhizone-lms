import { Router } from 'express';

import { BadRequestError } from './httpErrors';
import { itemEnvelope } from './responseEnvelope';
import db from './db';

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

      // for(let option of  options){
      await trx('responses').insert(
        options.map(option => {
          return {
            option_id: option.id,
            reflection_id: insertedReflectionId[0],
            principal_id: principalId,
          };
        })
      );
      // }
    });
  } catch (error) {
    next(error);
    return;
  }
  res.status(201).json(itemEnvelope({ id: insertedReflectionId[0] }));
});

export default reflectionsRouter;
