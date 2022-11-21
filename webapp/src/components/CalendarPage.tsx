import { Container } from '@mui/material';
import {Calendar, luxonLocalizer, Event as RBCEvent} from 'react-big-calendar';
import React from 'react';
import { DateTime, Settings } from 'luxon';
import 'react-big-calendar/lib/css/react-big-calendar.css';

Settings.defaultZone = 'America/Los_Angeles';
const localizer = luxonLocalizer(DateTime);
/**
 * Assume this is the response from the API. Use this data to fill in the
 * calendar on the front end.
 */
const programsList = {
  "data": [
    {
      "id": 1,
      "title": "Cohort 4",
      "start_date": "2022-10-24",
      "end_date": "2022-12-16",
      "time_zone": "America/Los_Angeles",
      "curriculum_id": 1,
      "activities": [
        {
          "title": "Morning Standup",
          "description_text": "",
          "program_id": 1,
          "curriculum_activity_id": 1,
          "activity_type": "standup",
          "start_time": "2022-10-24T17:00:00.000Z",
          "end_time": "2022-10-24T18:00:00.000Z",
          "duration": 60
        },
        {
          "title": "Self-introduction",
          "description_text": "Get to know each other.",
          "program_id": 1,
          "curriculum_activity_id": 2,
          "activity_type": "class",
          "start_time": "2022-10-24T18:10:00.000Z",
          "end_time": "2022-10-24T19:00:00.000Z",
          "duration": 50
        },
        {
          "title": "Self-assessment",
          "description_text": "",
          "program_id": 1,
          "curriculum_activity_id": 3,
          "activity_type": "assignment",
          "start_time": "2022-10-25T07:00:00.000Z",
          "end_time": "2022-10-25T07:00:00.000Z",
          "duration": 0
        },
        {
          "title": "PMP Introduction",
          "description_text": "Overview of the project and technological environment.",
          "program_id": 1,
          "curriculum_activity_id": 4,
          "activity_type": "class",
          "start_time": "2022-10-25T18:00:00.000Z",
          "end_time": "2022-10-25T19:00:00.000Z",
          "duration": 60
        }
      ]
    }
  ]
};

const CalendarPage = () => {

  const programEventsActivities :  RBCEvent[] = programsList.data[0].activities.map((activity) => {
    return (
      {
        title: activity.title,
        start: new Date(activity.start_time),
        end: new Date(activity.end_time),
        description: activity.description_text
      }
    )
  })

 
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
