import { Router } from 'express';

import { BadRequestError } from './httpErrors';
import { itemEnvelope, collectionEnvelope } from './responseEnvelope';
import paginationValues from './paginationValues';
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

reflectionsRouter.get('/', async (req, res) => {
  const { principalId } = req.session;
  const { limit, offset } = paginationValues(req.query.page, req.query.perpage);

  const reflections = await db('reflections')
    .select(
      'reflections.id',
      'reflections.created_at',
      'journal_entries.id AS journal_entry_id',
      'journal_entries.raw_text',
      'responses.id AS response_id',
      'options.id AS option_id',
      'options.label AS option_label',
      'prompts.id AS prompt_id',
      'prompts.label AS prompt_label'
    )
    .leftJoin(
      'journal_entries',
      'reflections.id',
      'journal_entries.reflection_id'
    )
    .leftJoin('responses', 'reflections.id', 'responses.reflection_id')
    .orderBy('reflections.id', 'desc')
    .leftJoin('options', 'responses.option_id', 'options.id')
    .leftJoin('prompts', 'options.prompt_id', 'prompts.id')
    .where({ 'reflections.principal_id': principalId })
    .orderBy('prompts.sort_order')
    .limit(limit)
    .offset(offset);

  const countAlias = 'total_count';
  const totalCounts = await db('reflections')
    .count({ [countAlias]: '*' })
    .where({ principal_id: principalId });

  interface Reflection {
    id: number;
    created_at: string;
    journal_entries: object[];
    responses: object[];
  }

  const newReflectionsObject = reflections.map(reflection => {
    let newReflection: Reflection = {
      id: reflection.id,
      created_at: reflection.created_at,
      journal_entries: null,
      responses: null,
    };

    newReflection.journal_entries = [
      { id: reflection.journal_entry_id, raw_text: reflection.raw_text },
    ];

    newReflection.responses = [
      {
        id: reflection.response_id,
        option: {
          id: reflection.option_id,
          label: reflection.option_label,
          prompt: { id: reflection.prompt_id, label: reflection.prompt_label },
        },
      },
    ];

    return newReflection;
  });

  res.json(
    collectionEnvelope(newReflectionsObject, totalCounts[0][countAlias])
  );
});

export default reflectionsRouter;
