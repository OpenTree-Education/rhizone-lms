import { Router } from 'express';

import { collectionEnvelope, itemEnvelope } from './responseEnvelope';
import { countMeetings, listMeetings, findMeeting } from './meetingsService';
import db from './db';
import paginationValues from './paginationValues';
import { BadRequestError, NotFoundError } from './httpErrors';

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
  const { id } = req.params;
  const { principalId } = req.session;
  const meetingId = Number(id);
  if (!Number.isInteger(meetingId) || meetingId < 1) {
    next(new BadRequestError(`"${id}" is not a valid meeting id.`));
    return;
  }
  let meeting;
  try {
    await db.transaction(async trx => {
      meeting = await findMeeting(meetingId, principalId, trx);
    });
  } catch (err) {
    next(err);
    return;
  }
  if (meeting === null) {
    next(
      new NotFoundError(`A meeting with the id "${id}" could not be found.`)
    );
    return;
  }
  res.json(itemEnvelope(meeting));
});
export default meetingsRouter;
