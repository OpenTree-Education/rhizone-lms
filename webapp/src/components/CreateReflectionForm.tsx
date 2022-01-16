import { Alert, Card, CardContent, Snackbar, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import React, { FormEventHandler, useContext, useState } from 'react';

import { EntityId } from '../types/api';
import SettingsContext from './SettingsContext';
import Questionnaire from './Questionnaire';

interface CreateReflectionFormProps {
  onReflectionCreated?: (id: EntityId) => void;
}

const CreateReflectionForm = ({
  onReflectionCreated,
}: CreateReflectionFormProps) => {
  const { default_questionnaire_id: defaultQuestionnaireId } =
    useContext(SettingsContext);
  const [isSavingReflection, setIsSavingReflection] = useState(false);
  const [saveReflectionError, setSaveReflectionError] = useState(null);
  const [isSuccessMessageVisible, setIsSuccessMessageVisible] = useState(false);
  const [journalEntryText, setJournalEntryText] = useState('');
  const [wasJournalEntryTextTouched, setWasJournalEntryTextTouched] =
    useState(false);
  const [selectedOptionIds, setSelectedOptionIds] = useState(
    new Map<EntityId, EntityId>()
  );
  const onSubmit: FormEventHandler = event => {
    event.preventDefault();
    setIsSavingReflection(true);
    fetch(`${process.env.REACT_APP_API_ORIGIN}/reflections`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        raw_text: journalEntryText,
        selected_option_ids: Array.from(selectedOptionIds.values()),
      }),
    })
      .then(res => res.json())
      .then(({ data, error }) => {
        setIsSavingReflection(false);
        if (error) {
          setSaveReflectionError(error);
        }
        if (data) {
          setIsSuccessMessageVisible(true);
          setJournalEntryText('');
          setSelectedOptionIds(new Map());
          if (onReflectionCreated) {
            onReflectionCreated(data.id);
          }
        }
      })
      .catch(error => {
        setIsSavingReflection(false);
        setSaveReflectionError(error);
      });
  };
  return (
    <form onSubmit={onSubmit}>
      <Card>
        <CardContent>
          <h1>New Reflection</h1>
        </CardContent>
        <CardContent>
          <Questionnaire
            onChange={setSelectedOptionIds}
            questionnaireId={defaultQuestionnaireId}
            selectedOptionIds={selectedOptionIds}
          />
        </CardContent>
        <CardContent>
          <h2>Journal</h2>
          <p>Write a new journal entry (optional)</p>
          <TextField
            fullWidth
            label="How is it going?"
            onFocus={() => setWasJournalEntryTextTouched(true)}
            minRows={wasJournalEntryTextTouched ? 4 : 1}
            multiline
            onChange={event => setJournalEntryText(event.target.value)}
            value={journalEntryText}
          />
        </CardContent>
        {saveReflectionError && (
          <CardContent>
            <Alert
              onClose={() => setSaveReflectionError(null)}
              severity="error"
            >
              The reflection was not saved.
            </Alert>
          </CardContent>
        )}
        <CardContent>
          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSavingReflection}
          >
            Save reflection
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
            The reflection was saved.
          </Alert>
        </Snackbar>
      )}
    </form>
  );
};

export default CreateReflectionForm;
