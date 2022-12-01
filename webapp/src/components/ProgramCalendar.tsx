import React from 'react';
import { decodeHTML } from 'entities';
import { DateTime } from 'luxon';
import { Calendar, luxonLocalizer, Views } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import ProgramActivityDialog from './ProgramActivityDialog';

import {
  CalendarEvent,
  ProgramWithActivities,
  ProgramActivity,
} from '../types/api';

interface ProgramCalendarProps {
  program: ProgramWithActivities;
}

const activitiesForCalendar = (
  activities: ProgramActivity[]
): CalendarEvent[] => {
  return activities.map(
    activity =>
      ({
        title: decodeHTML(activity.title),
        start: new Date(activity.start_time),
        end: new Date(activity.end_time),
        description: decodeHTML(activity.description_text),
        allDay: !activity.duration,
        activityType: decodeHTML(activity.activity_type),
      } as CalendarEvent)
  );
};

const ProgramCalendar = ({ program }: ProgramCalendarProps) => {
  const [dialogShow, setDialogShow] = React.useState(false);
  const [dialogContents, setDialogContents] = React.useState<CalendarEvent>({
    title: '',
    description: '',
    allDay: false,
    start: new Date(),
    end: new Date(),
    activityType: '',
  });

  const handleClickActivity = (activity: CalendarEvent) => {
    setDialogShow(true);
    setDialogContents(activity);
  };

  const TimeGutter = () => <p style={{ textAlign: 'center' }}>All Day</p>;

  const closeDialog = () => setDialogShow(false);

  return (
    <>
      <Calendar
        events={activitiesForCalendar(program.activities)}
        onSelectEvent={handleClickActivity}
        localizer={luxonLocalizer(DateTime)}
        defaultView={Views.WEEK}
        startAccessor="start"
        endAccessor="end"
        getNow={() => DateTime.local().toJSDate()}
        scrollToTime={DateTime.local().set({ hour: 8, minute: 0 }).toJSDate()}
        style={{ height: 500 }}
        components={{
          timeGutterHeader: TimeGutter,
        }}
        popup
      />
      <ProgramActivityDialog
        show={dialogShow}
        contents={dialogContents}
        handleClose={closeDialog}
      />
    </>
  );
};

export default ProgramCalendar;
