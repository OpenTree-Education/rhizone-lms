import { Grid } from '@mui/material';
import React, { useContext, useEffect } from 'react';

import { EntityId, Meeting as APIMeeting } from '../types/api';
import { formatDate, formatTime } from '../helpers/dateTime';
import SessionContext from './SessionContext';
import useApiData from '../helpers/useApiData';
import useSocket from '../helpers/useSocket';

interface MeetingProps {
  meetingId?: EntityId;
}

const Meeting = ({ meetingId }: MeetingProps) => {
  const socket = useSocket();
  useEffect(() => {
    socket.emit('meeting:join', meetingId);
    return () => {
      socket.emit('meeting:leave', meetingId);
    };
  }, [socket, meetingId]);
  const { principalId } = useContext(SessionContext);
  const { data: meeting, error } = useApiData<APIMeeting>({
    deps: [meetingId],
    path: `/meetings/${meetingId}`,
    sendCredentials: true,
  });
  if (error) {
    return <div>There was an error loading the meeting.</div>;
  }
  if (!meeting) {
    return null;
  }
  const currentParticipantId = meeting.participants.find(
    ({ principal_id }) => principal_id === principalId
  )?.id;
  return (
    <Grid>
      <h1>{`Meeting on ${formatDate(meeting.starts_at)} at ${formatTime(
        meeting.starts_at
      )}`}</h1>
      {meeting.meeting_notes.map((meetingNote, index, meetingNotes) => (
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
    </Grid>
  );
};

export default Meeting;
