import db from './db';

export const countMeetings = async (principalId: number, builder = db) => {
  const countAlias = 'total_count';
  const meetingCounts = await builder('meetings')
    .count({ [countAlias]: '*' })
    .join('participants', 'participants.meeting_id', 'meetings.id')
    .where({ 'participants.principal_id': principalId });
  return meetingCounts[0][countAlias];
};

export const listMeeting = async (
  id: number,
  limit: number,
  offset: number,
  builder = db
) => {
  const meeting = await builder('meetings')
    .select('meetings.id AS id', 'starts_at')
    .where({ id: id })
    .orderBy('created_at', 'id');
  if (meeting.length === 0) {
    return [];
  }
  const meetingNotes = await builder('meeting_notes')
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
      { column: 'sort_order', order: 'desc' },
      { column: 'agenda_owning_participant_id', order: 'desc' },
      'meeting_notes.created_at',
    ])
    .limit(limit)
    .offset(offset);
  const participants = await builder('participants')
    .select('id', 'principal_id')
    .where({ meeting_id: id });
  return [
    {
      ...meeting[0],
      participants: [...participants],
      meetingNotes: [...meetingNotes],
    },
  ];
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
