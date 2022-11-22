import {
  Calendar,
  luxonLocalizer,
  Event as RBCEvent,
} from 'react-big-calendar';
import { Container } from '@mui/material';
import { DateTime, Settings } from 'luxon';
import { ProgramWithActivities } from '../types/api';
import React from 'react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import useApiData from '../helpers/useApiData';

Settings.defaultZone = 'America/Los_Angeles';
const localizer = luxonLocalizer(DateTime);

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
  const programEventsActivities: RBCEvent[] = programs[0].activities.map(
    activity => {
      return {
        title: activity.title,
        start: new Date(activity.start_time),
        end: new Date(activity.end_time),
        description: activity.description_text,
      };
    }
  );
  return (
    <Container fixed>
      <Calendar
        localizer={localizer}
        events={programEventsActivities}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
      />
    </Container>
  );
};

export default CalendarPage;
