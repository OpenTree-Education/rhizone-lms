import { Router } from 'express';

import { collectionEnvelope, itemEnvelope } from './responseEnvelope';
import {
  countMeetings,
  findMeeting,
  insertMeetingNote,
  listMeetings,
  validateMeetingParticipantId,
} from './meetingsService';
import db from './db';
import paginationValues from './paginationValues';
import {
  BadRequestError,
  NotFoundError,
  ValidationError,
  UnauthorizedError,
} from './httpErrors';

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

meetingsRouter.post('/:id/notes', async (req, res, next) => {
  const { principalId } = req.session;
  const meetingId = Number(req.params.id);
  const agendaOwningParticipantId = req.body.agenda_owning_participant_id;
  const noteText = req.body.note_text;
  const sortOrder = req.body.sort_order;

  if (!(await validateMeetingParticipantId(meetingId, principalId))) {
    next(new UnauthorizedError());
    return;
  }

  if (
    typeof noteText !== 'string' ||
    typeof sortOrder !== 'number' ||
    (typeof agendaOwningParticipantId !== 'number' &&
      agendaOwningParticipantId !== null)
  ) {
    next(new ValidationError());
    return;
  }

  let insertedNoteId;
  try {
    insertedNoteId = await insertMeetingNote(
      agendaOwningParticipantId,
      principalId,
      noteText,
      sortOrder
    );
  } catch (err) {
    next(err);
    return;
  }
  res.status(201).json(itemEnvelope({ id: insertedNoteId }));
});

export default meetingsRouter;
