import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Link as MuiLink,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Link as ReactRouterLink } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';
import React, { FormEventHandler, useContext, useState } from 'react';

import { EntityId, Meeting as APIMeeting } from '../types/api';
import { formatDate, formatTime } from '../helpers/dateTime';
import SessionContext from './SessionContext';
import useApiData from '../helpers/useApiData';

interface MeetingQuickViewProps {
  meeting: APIMeeting;
}

const MeetingQuickView = ({ meeting }: MeetingQuickViewProps) => {
  const { principalId } = useContext(SessionContext);
  const [changedMeetingNoteIds, setChangedMeetingNoteIds] = useState<
    EntityId[]
  >([]);
  const [isAccordionExpanded, setIsAccordionExpanded] = useState(false);
  const [isSavingMeetingNote, setIsSavingMeetingNote] = useState(false);
  const [
    isMeetingNoteSaveSuccessIndicated,
    setIsMeetingNoteSaveSuccessIndicated,
  ] = useState(false);
  const [meetingNoteText, setMeetingNoteText] = useState('');
  const [saveMeetingNoteError, setSaveMeetingNoteError] = useState(null);
  const { data: meetingWithNotes, error: loadMeetingNotesError } =
    useApiData<APIMeeting>({
      deps: [changedMeetingNoteIds, isAccordionExpanded],
      path: `/meetings/${meeting.id}`,
      sendCredentials: true,
      shouldFetch: () => isAccordionExpanded,
    });
  const currentParticipantId = meeting.participants.find(
    ({ principal_id: id }) => id === principalId
  )?.id;
  let nextMeetingNoteSortOrder = 1;
  const meetingNotes = meetingWithNotes?.meeting_notes || [];
  for (let i = meetingNotes.length - 1; i >= 0; i--) {
    const meetingNote = meetingNotes[i];
    if (meetingNote.agenda_owning_participant_id === currentParticipantId) {
      nextMeetingNoteSortOrder = meetingNote.sort_order + 1;
      break;
    }
  }
  const onSubmit: FormEventHandler = event => {
    event.preventDefault();
    setIsSavingMeetingNote(true);
    fetch(`${process.env.REACT_APP_API_ORIGIN}/meetings/${meeting.id}/notes`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        agenda_owning_participant_id: currentParticipantId,
        note_text: meetingNoteText,
        sort_order: nextMeetingNoteSortOrder,
      }),
    })
      .then(res => res.json())
      .then(({ data, error }) => {
        setIsSavingMeetingNote(false);
        setSaveMeetingNoteError(error || null);
        if (data) {
          setMeetingNoteText('');
          setIsMeetingNoteSaveSuccessIndicated(true);
          setTimeout(() => {
            setIsMeetingNoteSaveSuccessIndicated(false);
          }, 2000);
          setChangedMeetingNoteIds([...changedMeetingNoteIds, data.id]);
        }
      })
      .catch(error => {
        setIsSavingMeetingNote(false);
        setSaveMeetingNoteError(error);
      });
  };
  return (
    <Accordion
      expanded={isAccordionExpanded}
      onChange={(event, newIsAccordionExpanded) =>
        setIsAccordionExpanded(newIsAccordionExpanded)
      }
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{
          '&:hover': {
            backgroundColor: 'grey.200',
          },
        }}
      >
        <MuiLink
          component={ReactRouterLink}
          to={`/meetings/${meeting.id}`}
          underline="none"
          sx={{ color: 'text.primary' }}
          onClick={event => {
            event.stopPropagation();
          }}
        >
          <Typography>Meeting on {formatDate(meeting.starts_at)}</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {formatTime(meeting.starts_at)}
          </Typography>
        </MuiLink>
      </AccordionSummary>
      <AccordionDetails>
        <Stack spacing={2}>
          <Stack spacing={1}>
            {loadMeetingNotesError && (
              <Alert severity="error">
                There was an error loading the meeting notes.
              </Alert>
            )}
            {meetingNotes.map((meetingNote, index, meetingNotes) => (
              <React.Fragment key={meetingNote.id}>
                {(index === 0 ||
                  meetingNote.agenda_owning_participant_id !==
                    meetingNotes[index - 1].agenda_owning_participant_id) && (
                  <Typography sx={{ fontWeight: 'bold' }}>
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
          <form onSubmit={onSubmit}>
            <Stack spacing={1}>
              <Typography sx={{ fontWeight: 'bold' }}>
                Add an agenda item
              </Typography>
              <TextField
                fullWidth
                multiline
                required
                onChange={event => setMeetingNoteText(event.target.value)}
                size="small"
                value={meetingNoteText}
              />
              {saveMeetingNoteError && (
                <Alert
                  onClose={() => setSaveMeetingNoteError(null)}
                  severity="error"
                >
                  Item was not added.
                </Alert>
              )}
              <LoadingButton
                fullWidth
                type="submit"
                variant="contained"
                loading={isSavingMeetingNote}
                color={
                  isMeetingNoteSaveSuccessIndicated ? 'success' : 'primary'
                }
                startIcon={
                  isMeetingNoteSaveSuccessIndicated ? (
                    <CheckCircleOutlineIcon />
                  ) : (
                    ''
                  )
                }
              >
                {isMeetingNoteSaveSuccessIndicated
                  ? 'Saved'
                  : 'Save Agenda Item'}
              </LoadingButton>
            </Stack>
          </form>
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};

export default MeetingQuickView;
