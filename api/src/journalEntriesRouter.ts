import { Router } from 'express';

import { collectionEnvelope, itemEnvelope } from './responseEnvelope';
import dbPool from './dbPool';
import paginationValues from "./paginationValues";

const journalEntriesRouter = Router();

journalEntriesRouter.get('/', async (req, res) => {
  const { principalId } = req.session;
  const { limit, offset } = paginationValues(req.query.page, req.query.perpage);
  let journalEntries;
  let totalCount;
  const client = await dbPool.connect();
  try {
    const listJournalEntries = await client.query(
      'SELECT * FROM journal_entries WHERE principal_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
      [principalId, limit, offset]
    );
    journalEntries = listJournalEntries.rows;
    const countJournalEntries = await client.query(
      'select count(*) as total_count from journal_entries where principal_id = $1',
      [principalId]
    );
    totalCount = countJournalEntries.rows[0].total_count;
  } finally {
    client.release();
  }
  res.json(collectionEnvelope(journalEntries, totalCount));
});

journalEntriesRouter.get('/:id', async (req, res) => {
  const { principalId } = req.session;
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    res.sendStatus(400);
    return;
  }
  let journalEntry;
  const client = await dbPool.connect();
  try {
    const findJournalEntry = await client.query(
      'SELECT * FROM journal_entries WHERE id = $1 AND principal_id = $2',
      [id, principalId]
    );
    journalEntry = findJournalEntry.rows[0];
  } finally {
    client.release();
  }
  if (!journalEntry) {
    res.sendStatus(404);
    return;
  }
  res.json(itemEnvelope(journalEntry));
});

journalEntriesRouter.post('/', async (req, res) => {
  const { principalId } = req.session;
  const rawText = req.body.raw_text;
  if (!rawText) {
    res.sendStatus(400);
    return;
  }
  let journalEntry;
  const client = await dbPool.connect();
  try {
    const insertJournalEntry = await client.query(
      'INSERT INTO journal_entries(raw_text, principal_id) VALUES($1, $2) RETURNING id',
      [rawText, principalId]
    );
    journalEntry = insertJournalEntry.rows[0];
  } finally {
    client.release();
  }
  res.status(201).json(itemEnvelope(journalEntry));
});

export default journalEntriesRouter;
