import React from 'react';
import { CircularProgress, Container, Stack } from '@mui/material';

import ProgramPicker from './ProgramPicker';
import ProgramCalendar from './ProgramCalendar';

import useApiData from '../helpers/useApiData';
import { ProgramWithActivities } from '../types/api';

const ProgramsPage = () => {
  const [selectedProgram, setSelectedProgram] = React.useState(0);

  const {
    data: programsList,
    error,
    isLoading,
  } = useApiData<ProgramWithActivities[]>({
    deps: [],
    path: '/programs',
    sendCredentials: true,
  });
  if (error) {
    return (
      <Container fixed>
        <p>There was an error loading the programs.</p>
      </Container>
    );
  }
  if (isLoading) {
    return (
      <Stack
        alignItems="center"
        justifyContent="center"
        sx={{ height: '40em' }}
      >
        <CircularProgress size={100} disableShrink />
      </Stack>
    );
  }
  if (!programsList) {
    return null;
  }
  return (
    <Container>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', md: 'center' }}
      >
        <h1>Program Activities</h1>
        <ProgramPicker
          programs={programsList}
          selectedProgram={selectedProgram}
          setSelectedProgram={setSelectedProgram}
        />
      </Stack>
      <ProgramCalendar program={programsList[selectedProgram]} />
    </Container>
  );
};

export default ProgramsPage;
