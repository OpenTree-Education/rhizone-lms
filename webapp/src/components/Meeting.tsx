import React, { useContext, useEffect, useState } from 'react';
import { Grid } from '@mui/material';

import { formatDate, formatTime } from '../helpers/dateTime';
import { Meeting as APIMeeting } from '../types/api';
import UserContext from './UserContext';

interface MeetingProps {
  meetingId?: number | string;
}

const Meeting = ({ meetingId }: MeetingProps) => {
  const user = useContext(UserContext);
  const [error, setError] = useState(null);
  const [meeting, setMeeting] = useState<APIMeeting>();
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_ORIGIN}/meetings/${meetingId}`, {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(({ data, error }) => {
        if (error) {
          setError(error);
        }
        if (data) {
          setMeeting(data);
        }
      })
      .catch(error => {
        setError(error);
      });
  }, [meetingId]);
  if (error) {
    return <div>There was an error loading the meeting.</div>;
  }
  if (!meeting) {
    return null;
  }
  const currentParticipantId = meeting.participants.find(
    ({ principal_id }) => principal_id === user.principal_id
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
