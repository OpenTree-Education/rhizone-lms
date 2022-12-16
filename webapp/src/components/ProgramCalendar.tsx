import React, { useEffect, useState } from 'react';
import { decodeHTML } from 'entities';
import { DateTime } from 'luxon';
import { Calendar, luxonLocalizer, View } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Box } from '@mui/material';

import ProgramActivityDialog from './ProgramActivityDialog';

import useApiData from '../helpers/useApiData';

import {
  CalendarEvent,
  ProgramWithActivities,
  ProgramActivity,
  ParticipantActivityForProgram,
} from '../types/api';

interface ProgramCalendarProps {
  program: ProgramWithActivities;
  currentView: View;
  setCurrentView: (manualView: View) => void;
  viewOptions: View[];
}

let correspondingProgramTitle = '';

const activitiesForCalendar = (
  activities: ProgramActivity[],
  activitiesCompletion: ParticipantActivityForProgram
): CalendarEvent[] => {
  for (const completionStatus of activitiesCompletion.participant_activities) {
    for (const activity of activities) {
      if (activity.curriculum_activity_id === completionStatus.activity_id) {
        activity.completed = completionStatus.completed;
      }
    }
  }
  return activities.map(
    activity =>
      ({
        title: decodeHTML(activity.title),
        start: new Date(activity.start_time),
        end: new Date(activity.end_time),
        description: decodeHTML(activity.description_text),
        allDay: !activity.duration,
        activity_type: activity.activity_type,
        program_title: correspondingProgramTitle,
        program_id: activity.program_id,
        curriculum_activity_id: activity.curriculum_activity_id,
        completed: activity.completed,
      } as CalendarEvent)
  );
};

const defaultDialogContents: CalendarEvent = {
  title: '',
  description: '',
  allDay: false,
  start: new Date(0),
  end: new Date(0),
  activity_type: '',
  program_title: '',
  program_id: 0,
  curriculum_activity_id: 0,
};

const ProgramCalendar = ({
  program,
  currentView,
  setCurrentView,
  viewOptions,
}: ProgramCalendarProps) => {
  const [dialogShow, setDialogShow] = useState(false);
  const [dialogContents, setDialogContents] = useState<CalendarEvent>(
    defaultDialogContents
  );
  const [activitiesCompletion, setActivitiesCompletion] =
    useState<ParticipantActivityForProgram>({
      program_id: 0,
      participant_activities: [],
    });

  const updateActivity = (updatedActivity: CalendarEvent) => {
    const updatedCalendarActivities = calendarActivities.map(
      calendarActivity => {
        if (
          calendarActivity.curriculum_activity_id ===
          updatedActivity.curriculum_activity_id
        ) {
          return updatedActivity;
        } else {
          return calendarActivity;
        }
      }
    );
    setCalendarActivities(updatedCalendarActivities);
  };

  const { data: participantActivitiesCompletionList, error } =
    useApiData<ParticipantActivityForProgram>({
      deps: [program],
      path: `/programs/activityStatus/${Number(program.id || 0)}`,
      sendCredentials: true,
    });

  const [calendarActivities, setCalendarActivities] = useState<CalendarEvent[]>(
    activitiesForCalendar(program.activities, activitiesCompletion)
  );

  useEffect(() => {
    if (participantActivitiesCompletionList) {
      setActivitiesCompletion(participantActivitiesCompletionList);
      setCalendarActivities(
        activitiesForCalendar(
          program.activities,
          participantActivitiesCompletionList
        )
      );
    }
  }, [participantActivitiesCompletionList, program.activities]);

  if (error) {
    return <div>There was an error loading part of the calendar.</div>;
  }

  const handleClickActivity = (activity: CalendarEvent) => {
    setDialogShow(true);
    setDialogContents(activity);
  };

  const TimeGutter = () => <p style={{ textAlign: 'center' }}>All Day</p>;

  const closeDialog = () => {
    setDialogShow(false);
    setTimeout(() => {
      setDialogContents(defaultDialogContents);
    }, 200);
  };

  const eventStyleGetter = (event: any) => {
    let style;
    if (currentView === 'week') {
      style = {
        flexDirection: 'row' as 'row',
        minHeight: '4%',
      };
    } else if (currentView === 'day') {
      style = {
        flexDirection: 'column' as 'column',
        minHeight: '4%',
      };
    }
    if (event.allDay && currentView !== 'agenda') {
      style = {
        backgroundColor: 'midnightblue',
      };
    }

    return { style: style };
  };

  const CustomWeekEvent = (event: any) => {
    const getValueProperty = (event: any) => {
      const durationEvent = (event.event.end - event.event.start) / 1000 / 60;
      if (durationEvent <= 60) {
        return 'nowrap';
      } else {
        return 'normal';
      }
    };

    return (
      <Box
        className="rbc-event-content-custom"
        sx={{
          display: 'block',
          height: '100%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: getValueProperty(event),
        }}
      >
        {event.title}
      </Box>
    );
  };

  correspondingProgramTitle = program.title;

  return (
    <>
      <Calendar
        events={calendarActivities}
        onSelectEvent={handleClickActivity}
        localizer={luxonLocalizer(DateTime)}
        defaultView={currentView}
        startAccessor="start"
        endAccessor="end"
        getNow={() => DateTime.local().toJSDate()}
        scrollToTime={DateTime.local().set({ hour: 8, minute: 0 }).toJSDate()}
        style={{ height: 500 }}
        components={{
          timeGutterHeader: TimeGutter,
          week: { event: CustomWeekEvent },
        }}
        popup
        onView={(newView: View) => {
          setCurrentView(newView);
        }}
        view={currentView}
        eventPropGetter={eventStyleGetter}
        views={viewOptions}
      />
      <ProgramActivityDialog
        show={dialogShow}
        contents={dialogContents}
        updateContents={updateActivity}
        handleClose={closeDialog}
      />
    </>
  );
};

export default ProgramCalendar;
