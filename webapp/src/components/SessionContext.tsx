import { CircularProgress, Stack } from '@mui/material';
import React, { createContext, PropsWithChildren } from 'react';

import { EntityId, SessionData } from '../types/api';
import useApiData from '../helpers/useApiData';

const SessionContext = createContext<{
  isAuthenticated: boolean;
  principalId: EntityId;
}>({
  isAuthenticated: false,
  principalId: null,
});

export const SessionProvider = ({ children }: PropsWithChildren<{}>) => {
  const {
    data: session,
    error,
    isLoading,
  } = useApiData<SessionData>({ path: '/auth/session', sendCredentials: true });
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
