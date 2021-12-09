import { Router } from 'express';

import { collectionEnvelope, itemEnvelope } from './responseEnvelope';
import { countMeetings, listMeetings, listMeeting } from './meetingsService';
import db from './db';
import paginationValues from './paginationValues';

const meetingsRouter = Router();

meetingsRouter.get('/', async (req, res, next) => {
  const { principalId } = req.session;
  const { limit, offset } = paginationValues(req.query.page, req.query.perpage);
  let meetings;
  let meetingsCount;
  try {
    await db.transaction(async trx => {
      [meetings, meetingsCount] = await Promise.all([
        listMeetings(principalId, limit, offset, trx),
        countMeetings(principalId, trx),
      ]);
    });
  } catch (err) {
    next(err);
    return;
  }
  res.json(collectionEnvelope(meetings, meetingsCount));
});

meetingsRouter.get('/:id', async (req, res, next) => {
  const { limit, offset } = paginationValues(req.query.page, req.query.perpage);
  const { id } = req.params;
  let meeting;
  try {
    await db.transaction(async trx => {
      meeting = await listMeeting(Number.parseInt(id), limit, offset, trx);
    });
  } catch (err) {
    next(err);
    return;
  }
  res.json(itemEnvelope(meeting));
});
export default meetingsRouter;
