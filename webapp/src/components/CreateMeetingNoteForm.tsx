import { Alert, Stack, TextField, Typography } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { LoadingButton } from '@mui/lab';
import React, { FormEventHandler, useState } from 'react';

import { EntityId } from '../types/api';
interface CreateMeetingNoteFormProps {
  agendaOwningParticipantId: EntityId;
  meetingId: EntityId;
  onMeetingNoteChanged?: (id: EntityId) => void;
  sortOrder: number;
}

const CreateMeetingNoteForm = ({
  agendaOwningParticipantId,
  meetingId,
  onMeetingNoteChanged,
  sortOrder,
}: CreateMeetingNoteFormProps) => {
  const [isSavingMeetingNote, setIsSavingMeetingNote] = useState(false);
  const [saveMeetingNoteError, setSaveMeetingNoteError] = useState(null);
  const [meetingNoteText, setMeetingNoteText] = useState('');
  const [isSuccessIndicated, setisSuccessIndicated] = useState(false);

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
          setMeetingNoteText('');
          setisSuccessIndicated(true);
          setTimeout(() => {
            setisSuccessIndicated(false);
          }, 2000);
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
        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
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
          <Alert onClose={() => setSaveMeetingNoteError(null)} severity="error">
            Item was not added.
          </Alert>
        )}
        <LoadingButton
          fullWidth
          type="submit"
          variant="contained"
          loading={isSavingMeetingNote}
          color={isSuccessIndicated ? 'success' : 'primary'}
          startIcon={isSuccessIndicated ? <CheckCircleOutlineIcon /> : ''}
        >
          {isSuccessIndicated ? 'Saved' : 'Save Agenda Item'}
        </LoadingButton>
      </Stack>
    </form>
  );
};

export default CreateMeetingNoteForm;
