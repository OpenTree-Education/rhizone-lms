import React from 'react';
import { DateTime, Settings } from 'luxon';
import { Container } from '@mui/material';
import {
  Calendar,
  luxonLocalizer,
  Event as RBCEvent,
} from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import { formatDate } from '../helpers/dateTime';
import { ProgramActivity } from '../types/api';

Settings.defaultZone = 'America/Vancouver';
const localizer = luxonLocalizer(DateTime);

interface ProgramProps {
  title: string;
  startDate: string;
  endDate: string;
  activities: ProgramActivity[];
}

const Program = ({ title, startDate, endDate, activities }: ProgramProps) => {
  const programEventsActivities: RBCEvent[] = activities.map(activity => {
    return {
      title: activity.title,
      start: new Date(activity.start_time),
      end: new Date(activity.end_time),
      description: activity.description_text,
      allDay: activity.duration === 0,
    };
  });
  return (
    <>
      <Container fixed>
        <p>Program: {title}</p>
        <p>Start Date: {formatDate(startDate)}</p>
        <p>End Date: {formatDate(endDate)}</p>
      </Container>
      <Calendar
        localizer={localizer}
        events={programEventsActivities}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
      />
    </>
  );
};

export default Program;
