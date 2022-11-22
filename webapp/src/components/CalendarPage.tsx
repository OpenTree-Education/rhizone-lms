import { Container } from '@mui/material';
import {Calendar, luxonLocalizer, Event as RBCEvent} from 'react-big-calendar';
import React, {useCallback} from 'react';
import { DateTime, Settings } from 'luxon';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import useApiData from '../helpers/useApiData';
import { ProgramWithActivities } from '../types/api';
import Program from './Program';

Settings.defaultZone = 'America/Los_Angeles';
const localizer = luxonLocalizer(DateTime);

//   return (
//     <Container fixed>
//       <h2>Programs</h2>
//       {programs.map(program => {
//         return (
//           <Program
//             key={program.id}
//             id={program.id}
//             title={program.title}
//             startDate={program.start_date}
//             endDate={program.end_date}
//             timeZone={program.time_zone}
//             curriculumId={program.curriculum_id}
//             activities={program.activities}
//           />
//         );
//       })}
//     </Container>
//   );
// };

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
