import { Router } from 'express';

import { collectionEnvelope, itemEnvelope } from './responseEnvelope';
import {
  countMeetings,
  findMeeting,
  insertMeetingNote,
  listMeetings,
  findParticipantIdForPrincipal,
} from './meetingsService';
import db from './db';
import paginationValues from './paginationValues';
import { BadRequestError, NotFoundError, ValidationError } from './httpErrors';

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

  if (!(Number.isInteger(meetingId) && meetingId > 0)) {
    next(new ValidationError('Meeting id must be a positive integer.'));
    return;
  }
  if (typeof noteText !== 'string') {
    next(new ValidationError('note_text must be of type string.'));
    return;
  }
  if (!Number.isFinite(sortOrder)) {
    next(
      new ValidationError(
        'sort_order must be of type number and neither positive Infinity, negative Infinity, nor NaN'
      )
    );
    return;
  }
  if (
    !(
      Number.isInteger(agendaOwningParticipantId) &&
      agendaOwningParticipantId > 0
    ) &&
    agendaOwningParticipantId !== null
  ) {
    next(
      new ValidationError(
        'agenda_owning_participant_id must be a positive integer or null.'
      )
    );
    return;
  }

  let insertedNoteId: number;
  let participantId: number;
  try {
    await db.transaction(async trx => {
      participantId = await findParticipantIdForPrincipal(
        principalId,
        meetingId,
        trx
      );

      if (participantId) {
        insertedNoteId = await insertMeetingNote(
          agendaOwningParticipantId,
          participantId,
          noteText,
          sortOrder,
          trx
        );
      }
    });
  } catch (err) {
    next(err);
    return;
  }
  if (!participantId) {
    next(
      new NotFoundError(`Participant for meeting ${meetingId} is not found.`)
    );
    return;
  }
  res.status(201).json(itemEnvelope({ id: insertedNoteId }));
});

export default meetingsRouter;
