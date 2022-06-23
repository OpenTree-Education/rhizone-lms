import React, { useContext, useEffect, useState } from 'react';
import { Stack } from '@mui/material';

import { compareMeetingNotes } from '../helpers/meetingsHelper';
import { EntityId, Meeting as APIMeeting, MeetingNote } from '../types/api';
import { formatDate, formatTime } from '../helpers/dateTime';
import SessionContext from './SessionContext';
import useApiData from '../helpers/useApiData';
import useSocket from '../helpers/useSocket';

interface MeetingProps {
  meetingId?: EntityId;
}

const Meeting = ({ meetingId }: MeetingProps) => {
  const socket = useSocket();
  const [meetingNotes, setMeetingNotes] = useState<MeetingNote[]>([]);
  useEffect(() => {
    socket.emit('meeting:join', meetingId);
    const handleNewMeetingNote = (meetingNote: MeetingNote) => {
      setMeetingNotes(meetingNotes =>
        [...meetingNotes, meetingNote].sort(compareMeetingNotes)
      );
    };
    socket.on('meeting_note:created', handleNewMeetingNote);
    return () => {
      socket.off('meeting_note:created', handleNewMeetingNote);
      socket.emit('meeting:leave', meetingId);
    };
  }, [socket, meetingId]);
  const { principalId } = useContext(SessionContext);
  const { data: meeting, error } = useApiData<APIMeeting>({
    deps: [meetingId],
    path: `/meetings/${meetingId}`,
    sendCredentials: true,
  });
  useEffect(() => {
    meeting && setMeetingNotes(meeting.meeting_notes);
  }, [meeting]);
  if (error) {
    return <div>There was an error loading the meeting.</div>;
  }
  if (!meeting) {
    return null;
  }
  const currentParticipantId = meeting.participants.find(
    ({ principal_id: id }) => id === principalId
  )?.id;
  return (
    <Stack spacing={1}>
      <h1>{`Meeting on ${formatDate(meeting.starts_at)} at ${formatTime(
        meeting.starts_at
      )}`}</h1>
      {meetingNotes.map((meetingNote, index, meetingNotes) => (
        <React.Fragment key={meetingNote.id}>
          {(index === 0 ||
            meetingNote.agenda_owning_participant_id !==
              meetingNotes[index - 1].agenda_owning_participant_id) && (
            <h2>
              {meetingNote.agenda_owning_participant_id === null
                ? 'Action items'
                : meetingNote.agenda_owning_participant_id ===
                  currentParticipantId
                ? 'My agenda items'
                : 'Their agenda items'}
            </h2>
          )}
          <ul>
            <li>{meetingNote.note_text}</li>
          </ul>
        </React.Fragment>
      ))}
    </Stack>
  );
};

export default Meeting;
