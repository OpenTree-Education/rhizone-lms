import db from './db';

export const countMeetings = async (principalId: number) => {
  const countAlias = 'total_count';
  const [count] = await db('meetings')
    .count({ [countAlias]: '*' })
    .join('participants', 'participants.meeting_id', 'meetings.id')
    .where({ 'participants.principal_id': principalId });
  return count[countAlias];
};

export const findMeeting = async (
  meetingId: number,
  principalId: number
): Promise<object | null> => {
  const [meeting] = await db('meetings')
    .select('meetings.id AS id', 'starts_at')
    .join('participants', 'participants.meeting_id', 'meetings.id')
    .where({
      'meetings.id': meetingId,
      'participants.principal_id': principalId,
    });
  if (!meeting) {
    return null;
  }
  [meeting.meeting_notes, meeting.participants] = await Promise.all([
    db('meeting_notes')
      .select(
        'meeting_notes.id AS id',
        'note_text',
        'sort_order',
        'authoring_participant_id',
        'agenda_owning_participant_id'
      )
      .join(
        'participants',
        'participants.id',
        'meeting_notes.authoring_participant_id'
      )
      .where({ 'participants.meeting_id': meetingId })
      .orderByRaw('agenda_owning_participant_id is null')
      .orderBy([
        'agenda_owning_participant_id',
        'sort_order',
        'meeting_notes.created_at',
      ]),
    db('participants')
      .select('id', 'principal_id')
      .where({ meeting_id: meetingId })
      .orderBy('created_at', 'id'),
  ]);
  return meeting;
};

export const listMeetings = async (
  principalId: number,
  limit: number,
  offset: number
) => {
  const meetings = await db('meetings')
    .select('meetings.id AS id', 'starts_at')
    .join('participants', 'participants.meeting_id', 'meetings.id')
    .where({ 'participants.principal_id': principalId })
    .orderBy([{ column: 'starts_at', order: 'desc' }, 'meetings.created_at'])
    .limit(limit)
    .offset(offset);
  if (meetings.length === 0) {
    return [];
  }
  const meetingIds = meetings.map(({ id }) => id);
  const participants = await db('participants')
    .select('id', 'meeting_id', 'principal_id')
    .whereIn('meeting_id', meetingIds)
    .orderBy('created_at', 'id');
  const meetingsById = new Map();
  for (const meeting of meetings) {
    meetingsById.set(meeting.id, { ...meeting, participants: [] });
  }
  for (const participant of participants) {
    meetingsById.get(participant.meeting_id).participants.push(participant);
  }
  return Array.from(meetingsById.values());
};

export const createMeetingNote = async (
  meetingId: number,
  principalId: number,
  agendaOwningParticipantId: number | null,
  noteText: string,
  sortOrder: number
) => {
  const [authoringParticipant] = await db('participants')
    .select('id')
    .where({ meeting_id: meetingId, principal_id: principalId });
  // An authoring participant may not be found if the meeting id is invalid or
  // if the principal is not a participant in the meeting with that id.
  if (!authoringParticipant) {
    return null;
  }
  const [id] = await db('meeting_notes').insert({
    agenda_owning_participant_id: agendaOwningParticipantId,
    authoring_participant_id: authoringParticipant.id,
    note_text: noteText,
    sort_order: sortOrder,
  });
  if (!id) {
    return null;
  }
  const [meetingNote] = await db('meeting_notes')
    .select(
      'id',
      'agenda_owning_participant_id',
      'authoring_participant_id',
      'sort_order',
      'note_text',
      'created_at'
    )
    .where({
      id,
    });
  return meetingNote || null;
};

export const participantExists = async (
  meetingId: number,
  principalId: number
) => {
  const [participant] = await db('participants').select('id').where({
    meeting_id: meetingId,
    principal_id: principalId,
  });
  return !!participant;
};
