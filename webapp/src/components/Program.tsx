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

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';

import Stack from '@mui/material/Stack';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

Settings.defaultZone = 'America/Vancouver';
const localizer = luxonLocalizer(DateTime);

interface ProgramProps {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
  activities: ProgramActivity[];
}

const Program = ({
  id,
  title,
  startDate,
  endDate,
  activities,
}: ProgramProps) => {
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
      <Stack direction="row" justifyContent="flex-start" alignItems="center">
        <FormControl sx={{ mb: 0.6, minWidth: 450, maxWidth: 600 }}>
          <InputLabel id="demo-simple-select-label">Program</InputLabel>
          <Select
            labelId="program-select-label"
            id="program-select"
            value={id}
            label="Program"
          >
            <MenuItem value={id}>
              <strong>{title}</strong> ({formatDate(startDate)} &ndash;{' '}
              {formatDate(endDate)})
            </MenuItem>
          </Select>
        </FormControl>
      </Stack>

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
