import { Alert, Snackbar, Stack, TextField } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { LoadingButton } from '@mui/lab';
import React, { FormEventHandler, useState } from 'react';

import { EntityId } from '../types/api';
interface CreateMeetingNoteFormProps {
  agendaOwningParticipantId: EntityId;
  meetingId: EntityId;
  onMeetingNoteChanged?: (id: EntityId) => void;
  sortOrder: number | undefined;
}

const CreateMeetingNoteForm = ({
  agendaOwningParticipantId,
  meetingId,
  onMeetingNoteChanged,
  sortOrder,
}: CreateMeetingNoteFormProps) => {
  const [isSavingMeetingNote, setIsSavingMeetingNote] = useState(false);
  const [saveMeetingNoteError, setSaveMeetingNoteError] = useState(null);
  const [isSuccessMessageVisible, setIsSuccessMessageVisible] = useState(false);
  const [meetingNoteText, setMeetingNoteText] = useState('');
  const [isSuccessIndicator, setIsSuccessIndicator] = useState(false);

  const updateSaveMeetingNoteButton = () => {
    setIsSuccessIndicator(true);
    setTimeout(() => {
      setIsSuccessIndicator(false);
    }, 2000);
  };

  const onSubmit: FormEventHandler = event => {
    event.preventDefault();
    setIsSavingMeetingNote(true);
    fetch(`${process.env.REACT_APP_API_ORIGIN}/meetings/${meetingId}/notes`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        agenda_owning_participant_id: agendaOwningParticipantId,
        note_text: meetingNoteText,
        sort_order: sortOrder,
      }),
    })
      .then(res => res.json())
      .then(({ data, error }) => {
        setIsSavingMeetingNote(false);
        if (error) {
          setSaveMeetingNoteError(error);
        } else {
          setSaveMeetingNoteError(null);
        }
if (data) {
  setIsSuccessMessageVisible(true);
  setMeetingNoteText('');
  updateSaveMeetingNoteButton();
  if (onMeetingNoteChanged) {
    onMeetingNoteChanged(data.id);
  }
}
})
.catch(error => {
setIsSavingMeetingNote(false);
setSaveMeetingNoteError(error);
});
};
return (
<form onSubmit={onSubmit}>
<Stack spacing={1}>
<b>Add an agenda item</b>
<TextField
  fullWidth
  multiline
  required
  onChange={event => setMeetingNoteText(event.target.value)}
  value={meetingNoteText}
/>
{saveMeetingNoteError && (
  <Alert onClose={() => setSaveMeetingNoteError(null)} severity="error">
    Item was not added.
  </Alert>
)}
<LoadingButton
  fullWidth
  type="submit"
  variant="contained"
  loading={isSavingMeetingNote}
  color={isSuccessIndicator ? 'success' : 'primary'}
  startIcon={isSuccessIndicator ? <CheckCircleOutlineIcon /> : ''}
>
  {isSuccessIndicator ? 'Saved' : 'Save Agenda Item'}
</LoadingButton>
</Stack>
{isSuccessMessageVisible && (
<Snackbar
  open={true}
  autoHideDuration={6000}
  onClose={() => setIsSuccessMessageVisible(false)}
>
  <Alert
    onClose={() => setIsSuccessMessageVisible(false)}
    severity="success"
    sx={{ width: '100%' }}
  >
    The meeting note was saved.
  </Alert>
</Snackbar>
)}
</form>
);
};

export default CreateMeetingNoteForm;
