import { Alert, Card, CardContent, Snackbar, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import React, { FormEventHandler, useState, useEffect } from 'react';

import useApiData from '../helpers/useApiData';
import { EntityId, Greetings } from '../types/api';


const CreateOrUpdateGreetingForm = () => {
  const [greet, setGreet] = useState(false);
  const [isSavingGreeting, setIsSavingGreeting] = useState(false);
  const [saveGreetingError, setSaveGreetingError] = useState(null);
  const [isSuccessMessageVisible, setIsSuccessMessageVisible] = useState(false);
  
  const {
    data: greetings,
    error,
  } = useApiData<Greetings[]>({
    path: '/greetings',
    sendCredentials: true,
  });

  useEffect(() => {
    console.log(greetings);
    if (greetings) {
      setGreet(true);
    }
  }, [greetings]);
 


  const onSubmit: FormEventHandler = event => {
    event.preventDefault();
    setIsSavingGreeting(true);

    fetch(
      `${process.env.REACT_APP_API_ORIGIN}/greetings`,
      {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      }
    )
      .then(res => res.json())
      .then(({ data, error }) => {
        setIsSavingGreeting(false);
        if (error) {
          setSaveGreetingError(error);
        }
        if (data) {
          setGreet(true);
          setIsSuccessMessageVisible(true);
        }
      })
      .catch(error => {
        setIsSavingGreeting(false);
        setSaveGreetingError(error);
      });
  };
  return (
    <form onSubmit={onSubmit}>
      {greet && (
        <h2>HELLOOO YOOOUUU!!!</h2>
      )}
      <Card>
        {saveGreetingError && (
          <CardContent>
            <Alert
              onClose={() => setSaveGreetingError(null)}
              severity="error"
            >
              The Greeting was not saved.
            </Alert>
          </CardContent>
        )}
        <CardContent>
          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSavingGreeting}
          >
            Activate Greeting
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
            The Greeting was saved.
          </Alert>
        </Snackbar>
      )}
    </form>
  );
};

export default CreateOrUpdateGreetingForm;
