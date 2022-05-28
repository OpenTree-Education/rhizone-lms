import { Alert, Card, CardContent, Snackbar, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import React, { FormEventHandler, useState } from 'react';

import { EntityId } from '../types/api';

interface CreateOrUpdateUserDataFormProps {
  principalId?: EntityId;
  defaultDescription?: string;
  defaultLabel?: string;
  id?: EntityId;
  onUserDataChanged?: (id: EntityId) => void;
}

const CreateOrUpdateUserDataForm = ({
  defaultDescription = '',
  defaultLabel = '',
  principalId,
  onUserDataChanged,
}: CreateOrUpdateUserDataFormProps) => {
  const [isSavingUserData, setIsSavingUserData] = useState(false);
  const [saveUserDataError, setSaveUserDataError] = useState(null);
  const [isSuccessMessageVisible, setIsSuccessMessageVisible] = useState(false);
  const [userDataLabelEntryText, setUserDataLabelEntryText] =
    useState(defaultLabel);
  const [descriptionEntryText, setDescriptionEntryText] =
    useState(defaultDescription);
  const [wasUserDataEntryTextTouched, setWasUserDataEntryTextTouched] =
    useState(false);
  const onSubmit: FormEventHandler = event => {
    event.preventDefault();
    setIsSavingUserData(true);

    fetch(
      `${process.env.REACT_APP_API_ORIGIN}/current-user/${principalId || ''}`,
      {
        method: principalId ? 'PUT' : 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          label: userDataLabelEntryText,
          description: descriptionEntryText,
        }),
      }
    )
      .then(res => res.json())
      .then(({ data, error }) => {
        setIsSavingUserData(false);
        if (error) {
          setSaveUserDataError(error);
        }
        if (data) {
          setIsSuccessMessageVisible(true);
          if (!principalId) {
            setUserDataLabelEntryText('');
            setDescriptionEntryText('');
          }
          if (onUserDataChanged) {
            onUserDataChanged(data.id);
          }
        }
      })
      .catch(error => {
        setIsSavingUserData(false);
        setSaveUserDataError(error);
      });
  };
  return (
    <form onSubmit={onSubmit}>
      <Card>
        <CardContent sx={{ pb: 0 }}>
          {principalId ? <h3>Edit Competency</h3> : <h3>New Competency</h3>}
        </CardContent>
        <CardContent sx={{ pt: 0 }}>
          <TextField
            required
            sx={{ mb: 2, width: '50%' }}
            label="Title"
            onChange={event => setUserDataLabelEntryText(event.target.value)}
            value={userDataLabelEntryText}
          />
          <TextField
            required
            fullWidth
            label="Description"
            onFocus={() => setWasUserDataEntryTextTouched(true)}
            minRows={wasUserDataEntryTextTouched ? 4 : 1}
            multiline
            onChange={event => setDescriptionEntryText(event.target.value)}
            value={descriptionEntryText}
          />
        </CardContent>
        {saveUserDataError && (
          <CardContent>
            <Alert onClose={() => setSaveUserDataError(null)} severity="error">
              The competency was not saved.
            </Alert>
          </CardContent>
        )}
        <CardContent>
          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSavingUserData}
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

export default CreateOrUpdateUserDataForm;
