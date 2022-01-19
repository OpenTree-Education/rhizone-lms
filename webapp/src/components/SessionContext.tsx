import { CircularProgress, Stack } from '@mui/material';
import React, { createContext, ReactNode, useEffect, useState } from 'react';

import { EntityId, SessionData } from '../types/api';

const SessionContext = createContext<{
  isAuthenticated: boolean;
  principalId: EntityId;
}>({
  isAuthenticated: false,
  principalId: null,
});

interface SessionProviderProps {
  children: ReactNode;
}

export const SessionProvider = ({ children }: SessionProviderProps) => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [session, setSession] = useState<SessionData>({
    id: null,
    principal_id: null,
  });
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
  return (
    <SessionContext.Provider
      value={{
        isAuthenticated: !!session.principal_id,
        principalId: session.principal_id,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export default SessionContext;
