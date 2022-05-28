import { Box, Container, Grid } from '@mui/material';
import React, { useState } from 'react';

import UserData from './UserData';
import CreateOrUpdateUserDataForm from './CreateOrUpdataUserDataForm';
import { EntityId, Competency as APICompetency } from '../types/api';
import useApiData from '../helpers/useApiData';

interface UserDataProps {
  description: string;
  id: EntityId;
  label: string;
  onUserDataChanged?: (id: EntityId) => void;
  principalId: EntityId;
}

const UserDataPage = () => {
  const [changedUserDataIds, setChangedUserDataIds] = useState<EntityId[]>([]);
  const { data: userData, error } = useApiData<APICompetency[]>({
    deps: [changedUserDataIds],
    path: `/current-user`,
    sendCredentials: true,
  });

  console.log('userData:', userData);
  console.log(typeof userData);

  if (error) {
    return <p>There was an error loading the userdata.</p>;
  }
  if (!userData) {
    return null;
  }
  return (
    <Container fixed>
      <h1>User Data</h1>
      <Grid container justifyContent="center">
        <Grid item xs={12} md={8}>
          <Box>
            <CreateOrUpdateUserDataForm
              onUserDataChanged={id =>
                setChangedUserDataIds([...changedUserDataIds, id])
              }
            />
          </Box>
          <Box my={6}>
            {userData.length === 0 && <p>There is no user data.</p>}
            {/* {userData && (
                <UserData
                    key={userData.id}
                    id={userData.id}
                    description={userData.description}
                    label={userData.label}
                    principalId={userData.principalId}
                    onUserDataChanged={userData.id =>
                    setChangedUserDataIds([...changedUserDataIds, id])
                    }
                />
            )} */}
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default UserDataPage;
