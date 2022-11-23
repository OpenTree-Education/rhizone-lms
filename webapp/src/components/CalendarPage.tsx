import React from 'react';
import { Container } from '@mui/material';

import Program from './Program';
import useApiData from '../helpers/useApiData';
import { ProgramWithActivities } from '../types/api';

const CalendarPage = () => {
  const {
    data: programs,
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
      <Container fixed>
        <div>Loading...</div>
      </Container>
    );
  }
  if (!programs) {
    return null;
  }
  return (
    <Container fixed>
      <h2>Programs</h2>
      {programs.map(program => {
        return (
          <Program
            key={program.id}
            title={program.title}
            startDate={program.start_date}
            endDate={program.end_date}
            activities={program.activities}
          />
        );
      })}
    </Container>
  );
};

export default CalendarPage;
