import { Alert, Card, CardContent, Snackbar, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import React, { FormEventHandler, useContext, useState } from 'react';

// import { EntityId } from '../types/api';

export const CreateCompetencyForm = () => {
  const [isSavingCompetency, setIsSavingCompetency] = useState(false);
  const [saveCompetencyError, setSaveCompetencyError] = useState(null);
  const [isSuccessMessageVisible, setIsSuccessMessageVisible] = useState(false);
  const [competencyNameEntryText, setCompetencyNameEntryText] = useState('');
  const [descriptionEntryText, setDescriptionEntryText] = useState('');
  const [wasCompetencyEntryTextTouched, setWasCompetencyEntryTextTouched] =
    useState(false);

  const onSubmit: FormEventHandler = event => {
    event.preventDefault();
    setIsSavingCompetency(true);
    fetch(``, {})
      .then(res => res.json())
      .then(({ data, error }) => {
        setIsSavingCompetency(false);
        if (error) {
          setSaveCompetencyError(error);
        }
        if (data) {
          setIsSuccessMessageVisible(true);
          setCompetencyNameEntryText('');
          setDescriptionEntryText('');
        }
      })
      .catch(error => {
        setIsSavingCompetency(false);
        setSaveCompetencyError(error);
      });
  };
  return (
    <form onSubmit={onSubmit}>
      <Card>
        <CardContent sx={{ pb: 0 }}>
          <h2>New Competency</h2>
        </CardContent>
        <CardContent sx={{ pt: 0 }}>
          <TextField
            sx={{ mb: 2, width: '50%'}}
            label="Competency"
            onChange={event => setCompetencyNameEntryText(event.target.value)}
            value={competencyNameEntryText}
          />
          <TextField
            fullWidth
            label="Description"
            onFocus={() => setWasCompetencyEntryTextTouched(true)}
            minRows={wasCompetencyEntryTextTouched ? 4 : 1}
            multiline
            onChange={event => setDescriptionEntryText(event.target.value)}
            value={descriptionEntryText}
          />  
        </CardContent>
        {saveCompetencyError && (
          <CardContent>
            <Alert
              onClose={() => setSaveCompetencyError(null)}
              severity="error"
            >
              The competency was not saved.
            </Alert>
          </CardContent>
        )}
        <CardContent>
          <LoadingButton
              type="submit"
              variant="contained"
              loading={isSavingCompetency}
            >
              Save competency
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
            The competency was saved.
          </Alert>
        </Snackbar>
      )}
    </form>
  )
};
