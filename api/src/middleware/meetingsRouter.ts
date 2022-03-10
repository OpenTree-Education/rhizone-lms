import { Router } from 'express';

import { BadRequestError, NotFoundError, ValidationError } from './httpErrors';
import { collectionEnvelope, itemEnvelope } from './responseEnvelope';
import {
  countMeetings,
  createMeetingNote,
  findMeeting,
  listMeetings,
} from '../services/meetingsService';
import { parsePaginationParams } from './paginationParamsMiddleware';

const meetingsRouter = Router();

meetingsRouter.get('/', parsePaginationParams(), async (req, res, next) => {
  const { principalId } = req.session;
  const { limit, offset } = req.pagination;
  let meetings;
  let meetingsCount;
  try {
    [meetings, meetingsCount] = await Promise.all([
      listMeetings(principalId, limit, offset),
      countMeetings(principalId),
    ]);
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
    meeting = await findMeeting(meetingId, principalId);
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
  const { id } = req.params;
  const { principalId } = req.session;
  const {
    agenda_owning_participant_id: agendaOwningParticipantId,
    note_text: noteText,
    sort_order: sortOrder,
  } = req.body;
  const meetingId = Number(id);
  if (!Number.isInteger(meetingId) || meetingId < 1) {
    next(new BadRequestError(`"${id}" is not a valid meeting id.`));
    return;
  }
  if (typeof noteText !== 'string') {
    next(new ValidationError('note_text must be a string.'));
    return;
  }
  if (!Number.isFinite(sortOrder)) {
    next(new ValidationError('sort_order must be a number'));
    return;
  }
  if (
    (!Number.isInteger(agendaOwningParticipantId) ||
      agendaOwningParticipantId < 1) &&
    agendaOwningParticipantId !== null
  ) {
    next(
      new ValidationError(
        'agenda_owning_participant_id must be a positive integer or null.'
      )
    );
    return;
  }
  let meetingNote;
  try {
    meetingNote = await createMeetingNote(
      meetingId,
      principalId,
      agendaOwningParticipantId,
      noteText,
      sortOrder
    );
  } catch (err) {
    next(err);
    return;
  }
  if (!meetingNote) {
    next(
      new NotFoundError(`A meeting with the id "${id}" could not be found.`)
    );
    return;
  }

  req.io.to(`meeting:${meetingId}`).emit('meeting_note:created', meetingNote);

  res.status(201).json(itemEnvelope(meetingNote));
});

export default meetingsRouter;
