import { CircularProgress, Stack } from '@mui/material';
import React, { useEffect, useState } from 'react';

import App from './App';
import { SessionData } from '../types/api';
import SessionContext from './SessionContext';
import WelcomePage from './WelcomePage';

const AuthWall = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [session, setSession] = useState<SessionData | null>(null);
  useEffect(() => {
    setIsLoading(true);
    fetch(`${process.env.REACT_APP_API_ORIGIN}/auth/session`, {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(
        ({ data }) => {
          setSession(data);
          setIsLoading(false);
        },
        error => {
          setError(error);
          setIsLoading(false);
        }
      );
  }, []);
  if (error) {
    return (
      <Stack
        alignItems="center"
        justifyContent="center"
        sx={{ height: '100vh' }}
      >
        There was an error determining the status of your session.
      </Stack>
    );
  }
  if (isLoading) {
    return (
      <Stack
        alignItems="center"
        justifyContent="center"
        sx={{ height: '100vh' }}
      >
        <CircularProgress />
      </Stack>
    );
  }
  if (!session) {
    return null;
  }
  return session.principal_id === null ? (
    <WelcomePage />
  ) : (
    <SessionContext.Provider value={session}>
      <App />
    </SessionContext.Provider>
  );
};

export default AuthWall;
