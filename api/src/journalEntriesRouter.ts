import { Router } from 'express';

import { collectionEnvelope, itemEnvelope } from './responseEnvelope';
import db from './db';
import paginationValues from './paginationValues';

const journalEntriesRouter = Router();

journalEntriesRouter.get('/', async (req, res) => {
  const { principalId } = req.session;
  const { limit, offset } = paginationValues(req.query.page, req.query.perpage);
  const journalEntries = await db('journal_entries')
    .select('id', 'raw_text')
    .where({ principal_id: principalId })
    .orderBy('created_at', 'desc')
    .limit(limit)
    .offset(offset);
  const countAlias = 'total_count';
  const totalCounts = await db('journal_entries')
    .count({ [countAlias]: '*' })
    .where({ principal_id: principalId });
  res.json(collectionEnvelope(journalEntries, totalCounts[0][countAlias]));
});

journalEntriesRouter.get('/:id', async (req, res) => {
  const { principalId } = req.session;
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    res.sendStatus(400);
    return;
  }
  const journalEntry = await db('journal_entries')
    .where({ principal_id: principalId, id })
    .limit(1);
  if (!journalEntry.length) {
    res.sendStatus(404);
    return;
  }
  res.json(itemEnvelope(journalEntry[0]));
});

journalEntriesRouter.post('/', async (req, res) => {
  const { principalId } = req.session;
  const rawText = req.body.raw_text;
  if (!rawText) {
    res.sendStatus(400);
    return;
  }
  const insertedJournalEntryIds = await db('journal_entries').insert({
    raw_text: rawText,
    principal_id: principalId,
  });
  res.status(201).json(itemEnvelope({ id: insertedJournalEntryIds[0] }));
});

export default journalEntriesRouter;
