import React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  let navigate = useNavigate();
  const routeChangeCompetency = () => {
    const path = `/competencies`;
    navigate(path);
  };

  const routeChangeJournal = () => {
    const path = `/`;
    navigate(path);
  };

  return (
    <div>
      Profile
      <Stack spacing={2} direction="row">
        <Button variant="outlined" onClick={routeChangeJournal}>
          Journal
        </Button>
        <Button variant="outlined" onClick={routeChangeCompetency}>
          Competencies
        </Button>
      </Stack>
    </div>
  );
};

export default Profile;
