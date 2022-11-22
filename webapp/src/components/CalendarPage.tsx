import { Container } from '@mui/material';
import React from 'react';
import useApiData from '../helpers/useApiData';

import { ProgramWithActivities } from '../types/api';
import Program from './Program';

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
    return <p>There was an error loading the programs.</p>;
  }
  if (isLoading) {
    return <div>Loading...</div>;
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
            id={program.id}
            title={program.title}
            startDate={program.start_date}
            endDate={program.end_date}
            timeZone={program.time_zone}
            curriculumId={program.curriculum_id}
            activities={program.activities}
          />
        );
      })}
    </Container>
  );
};

export default CalendarPage;
