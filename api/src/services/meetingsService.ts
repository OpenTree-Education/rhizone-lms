import db from '../db';

export const countMeetings = async (principalId: number, builder = db) => {
  const countAlias = 'total_count';
  const meetingCounts = await builder('meetings')
    .count({ [countAlias]: '*' })
    .join('participants', 'participants.meeting_id', 'meetings.id')
    .where({ 'participants.principal_id': principalId });
  return meetingCounts[0][countAlias];
};

export const findMeeting = async (
  id: number,
  principalId: number
): Promise<object | null> => {
  let meeting;
  await db.transaction(async trx => {
    [meeting] = await trx('meetings')
      .select('meetings.id AS id', 'starts_at')
      .join('participants', 'participants.meeting_id', 'meetings.id')
      .where({ 'meetings.id': id, 'participants.principal_id': principalId });
    if (!meeting) {
      return;
    }
    [meeting.meeting_notes, meeting.participants] = await Promise.all([
      trx('meeting_notes')
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
        .where({ 'participants.meeting_id': id })
        .orderBy([
          'agenda_owning_participant_id',
          'sort_order',
          'meeting_notes.created_at',
        ]),
      trx('participants')
        .select('id', 'principal_id')
        .where({ meeting_id: id })
        .orderBy('created_at', 'id'),
    ]);
  });
  return meeting || null;
};

export const listMeetings = async (
  principalId: number,
  limit: number,
  offset: number,
  builder = db
) => {
  const meetings = await builder('meetings')
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
  const participants = await builder('participants')
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

export const findParticipantForPrincipalInMeeting = async (
  principalId: number,
  meetingId: number
) => {
  const [participant] = await db('participants')
    .select('id')
    .where({ meeting_id: meetingId, principal_id: principalId });
  return participant || null;
};

export const insertMeetingNote = async (
  agendaOwningParticipantId: number | null,
  authoringParticipantId: number,
  noteText: string,
  sortOrder: number
) => {
  const [id] = await db('meeting_notes').insert({
    agenda_owning_participant_id: agendaOwningParticipantId,
    authoring_participant_id: authoringParticipantId,
    note_text: noteText,
    sort_order: sortOrder,
  });
  return { id };
};
