import { CircularProgress, Stack } from '@mui/material';
import React, { useEffect, useState } from 'react';

import App from './App';
import { User } from '../types/api';
import UserContext from './UserContext';
import WelcomePage from './WelcomePage';

const AuthWall = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    setIsLoading(true);
    fetch(`${process.env.REACT_APP_API_ORIGIN}/user`, {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(
        ({ data: user }) => {
          setUser(user);
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
  if (!user) {
    return null;
  }
  return user.principal_id === null ? (
    <WelcomePage />
  ) : (
    <UserContext.Provider value={user}>
      <App />
    </UserContext.Provider>
  );
};

export default AuthWall;
