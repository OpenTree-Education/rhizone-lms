import { Alert, Card, CardContent, Snackbar, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import React, { FormEventHandler, useState, useContext } from 'react';

import { EntityId } from '../types/api';
import SessionContext from './SessionContext';

interface CreateMeetingNoteFormProps {
  meetingId: EntityId;
  onMeetingNoteChanged?: (id: EntityId) => void;
  greatestSortOrderOfMeetingNotesList: number;
}

const CreateMeetingNoteForm = ({
  meetingId,
  onMeetingNoteChanged,
  greatestSortOrderOfMeetingNotesList,
}: CreateMeetingNoteFormProps) => {
  const { principalId } = useContext(SessionContext);

  const [isSavingMeetingNote, setIsSavingMeetingNote] = useState(false);
  const [saveMeetingNoteError, setSaveMeetingNoteError] = useState(null);
  const [isSuccessMessageVisible, setIsSuccessMessageVisible] = useState(false);
  const [meetingNoteText, setMeetingNoteText] = useState('');
  const onSubmit: FormEventHandler = event => {
    event.preventDefault();
    setIsSavingMeetingNote(true);

    fetch(`${process.env.REACT_APP_API_ORIGIN}/meetings/${meetingId}/notes`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        agenda_owning_participant_id: principalId,
        note_text: meetingNoteText,
        sort_order: greatestSortOrderOfMeetingNotesList + 1,
      }),
    })
      .then(res => res.json())
      .then(({ data, error }) => {
        setIsSavingMeetingNote(false);
        if (error) {
          setSaveMeetingNoteError(error);
        }
        if (data) {
          setIsSuccessMessageVisible(true);
          setMeetingNoteText('');
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
      <Card>
        <CardContent sx={{ pb: 0 }}>
          <h3>Add Meeting Note</h3>
        </CardContent>
        <CardContent sx={{ pt: 0 }}>
          <TextField
            required
            sx={{ mb: 2, width: '50%' }}
            label="Note Text"
            onChange={event => setMeetingNoteText(event.target.value)}
            value={meetingNoteText}
          />
        </CardContent>
        {saveMeetingNoteError && (
          <CardContent>
            <Alert
              onClose={() => setSaveMeetingNoteError(null)}
              severity="error"
            >
              The meeting note was not saved.
            </Alert>
          </CardContent>
        )}
        <CardContent>
          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSavingMeetingNote}
          >
            Save meeting note
          </LoadingButton>
        </CardContent>
      </Card>
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
