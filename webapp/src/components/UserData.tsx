import { Button } from '@mui/material';
import React, { useContext, useState } from 'react';

import CreateOrUpdateUserDataForm from './CreateOrUpdataUserDataForm';
import { EntityId } from '../types/api';
import SessionContext from './SessionContext';

interface UserDataProps {
  description: string;
  id: EntityId;
  label: string;
  onUserDataChanged?: (id: EntityId) => void;
  principalId: EntityId;
}

const UserData = ({
  description,
  id,
  label,
  onUserDataChanged,
  principalId,
}: UserDataProps) => {
  const { principalId: sessionPrincipalId } = useContext(SessionContext);
  const [isFormShown, setIsFormShown] = useState(false);

  return (
    <div>
      <h2>{label}</h2>
      <p>{description}</p>
      {principalId === sessionPrincipalId && (
        <Button onClick={() => setIsFormShown(!isFormShown)}>
          Edit User Data
        </Button>
      )}
      {isFormShown && (
        <CreateOrUpdateUserDataForm
          principalId={id}
          onUserDataChanged={id => {
            if (onUserDataChanged) {
              onUserDataChanged(id);
            }
            setIsFormShown(false);
          }}
          defaultLabel={label}
          defaultDescription={description}
        />
      )}
    </div>
  );
};

export default UserData;
