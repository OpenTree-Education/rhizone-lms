import React from 'react';
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
  participantActivitiesCompletionList,
} from '../types/api';

interface ProgramCalendarProps {
  program: ProgramWithActivities;
  selectedProgram: number;
  windowWidth: number;
  currentView: View;
  setCurrentView: (manualView: View) => void;
  viewOptions: View[];
}

let correspondingProgramTitle = '';

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
        programTitle: correspondingProgramTitle,
      } as CalendarEvent)
  );
};

const ProgramCalendar = ({
  program,
  selectedProgram,
  windowWidth,
  currentView,
  setCurrentView,
  viewOptions,
}: ProgramCalendarProps) => {
console.log(program.activities); 
const {
  data: participantActivitiesCompletionList,
  error,
  isLoading,
} = useApiData<participantActivitiesCompletionList>({
  deps: [],
  path: `/programs/activityStatus/${selectedProgram+1}`,
  sendCredentials: true,
});
console.log( participantActivitiesCompletionList);
console.log(program.activities);
if(participantActivitiesCompletionList){
  for(var i = 0; i < program.activities.length; i++){
    for(var j = 0; j < participantActivitiesCompletionList?.participantActivities.length; j++){ 
        if(program.activities[i].curriculum_activity_id=== participantActivitiesCompletionList.participantActivities[j].activity_id){
          program.activities[i].completed = participantActivitiesCompletionList.participantActivities[j].completed === 1
        }else{
          program.activities[i].completed = null
        }
    }
  }
}
console.log(program.activities);

  const [dialogShow, setDialogShow] = React.useState(false);
  const [dialogContents, setDialogContents] = React.useState<CalendarEvent>({
    title: '',
    description: '',
    allDay: false,
    start: new Date(),
    end: new Date(),
    programTitle: '',
  });

  const handleClickActivity = (activity: CalendarEvent) => {
    setDialogShow(true);
    setDialogContents(activity);
  };

  const TimeGutter = () => <p style={{ textAlign: 'center' }}>All Day</p>;

  const closeDialog = () => setDialogShow(false);

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
        events={activitiesForCalendar(program.activities)}
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
        handleClose={closeDialog}
      />
    </>
  );
};

export default ProgramCalendar;
