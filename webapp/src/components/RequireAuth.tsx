import React, { useContext } from 'react';

import SessionContext from './SessionContext';
import LoginPage from './LoginPage';

interface RequireAuthProps {
  children: JSX.Element;
}

const RequireAuth = ({ children }: RequireAuthProps) => {
  const { principalId } = useContext(SessionContext);
  return principalId ? children : <LoginPage />;
};

export default RequireAuth;
