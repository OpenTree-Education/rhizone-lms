import db from './db';

export const countMeetings = async (principalId: number, builder = db) => {
  const countAlias = 'total_count';
  const meetingCounts = await builder('meetings')
    .count({ [countAlias]: '*' })
    .join('participants', 'participants.meeting_id', 'meetings.id')
    .where({ 'participants.principal_id': principalId });
  return meetingCounts[0][countAlias];
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
