import { Stack, Typography } from '@mui/material';
import React, { useContext, useState } from 'react';

import { EntityId, Meeting as APIMeeting } from '../types/api';
import CreateMeetingNoteForm from './CreateMeetingNoteForm';
import SessionContext from './SessionContext';
import useApiData from '../helpers/useApiData';

interface MeetingQuickViewProps {
  meetingId?: EntityId;
}

const MeetingQuickView = ({ meetingId }: MeetingQuickViewProps) => {
  const { principalId } = useContext(SessionContext);
  const [changedMeetingNoteIds, setChangedMeetingNoteIds] = useState<
    EntityId[]
  >([]);
  const { data: meeting, error } = useApiData<APIMeeting>({
    deps: [changedMeetingNoteIds],
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
  let nextMeetingNoteSortOrder = 1;
  for (let i = meeting.meeting_notes.length - 1; i >= 0; i--) {
    const meetingNote = meeting.meeting_notes[i];
    if (meetingNote.agenda_owning_participant_id === currentParticipantId) {
      nextMeetingNoteSortOrder = meetingNote.sort_order + 1;
      break;
    }
  }
  return (
    <Stack spacing={2}>
      <Stack spacing={1}>
        {meeting.meeting_notes.map((meetingNote, index, meetingNotes) => (
          <React.Fragment key={meetingNote.id}>
            {(index === 0 ||
              meetingNote.agenda_owning_participant_id !==
                meetingNotes[index - 1].agenda_owning_participant_id) && (
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                {meetingNote.agenda_owning_participant_id === null
                  ? 'Action items'
                  : meetingNote.agenda_owning_participant_id ===
                    currentParticipantId
                  ? 'My agenda items'
                  : 'Their agenda items'}
              </Typography>
            )}
            <Typography variant="body2" pl={1}>
              {meetingNote.note_text}
            </Typography>
          </React.Fragment>
        ))}
      </Stack>
      <CreateMeetingNoteForm
        sortOrder={nextMeetingNoteSortOrder}
        meetingId={meeting.id}
        onMeetingNoteChanged={id =>
          setChangedMeetingNoteIds([...changedMeetingNoteIds, id])
        }
        agendaOwningParticipantId={currentParticipantId}
      />
    </Stack>
  );
};

export default MeetingQuickView;
