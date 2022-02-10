import { Alert, Card, CardContent, Snackbar, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import React, { FormEventHandler, useState } from 'react';

import { EntityId } from '../types/api';

interface CreateCompetencyFormProps {
  competencyId?: EntityId;
  defaultDescription?: string;
  defaultLabel?: string;
  id?: EntityId;
  onCompetenciesChanged?: (id: EntityId) => void;
}

const CreateCompetencyForm = ({
  defaultDescription = '',
  defaultLabel = '',
  competencyId,
  onCompetenciesChanged,
}: CreateCompetencyFormProps) => {
  const [isSavingCompetency, setIsSavingCompetency] = useState(false);
  const [saveCompetencyError, setSaveCompetencyError] = useState(null);
  const [isSuccessMessageVisible, setIsSuccessMessageVisible] = useState(false);
  const [competencyNameEntryText, setCompetencyNameEntryText] = useState(defaultLabel);
  const [descriptionEntryText, setDescriptionEntryText] = useState(defaultDescription);
  const [wasCompetencyEntryTextTouched, setWasCompetencyEntryTextTouched] =
    useState(false);
  const onSubmit: FormEventHandler = event => {
    event.preventDefault();
    setIsSavingCompetency(true);

    fetch(`${process.env.REACT_APP_API_ORIGIN}/competencies/${competencyId}`, {
      method: competencyId ? 'PUT' : 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        label: competencyNameEntryText,
        description: descriptionEntryText,
      }),
    })
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
          if (onCompetenciesChanged) {
            onCompetenciesChanged(data.id);
          }
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
          {competencyId ? <h3>Edit Competency</h3> : <h2>New Competency</h2>}
        </CardContent>
        <CardContent sx={{ pt: 0 }}>
          <TextField
            required
            sx={{ mb: 2, width: '50%' }}
            label="Title"
            onChange={event => setCompetencyNameEntryText(event.target.value)}
            value={competencyNameEntryText}
          />
          <TextField
            required
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
  );
};

export default CreateCompetencyForm;
