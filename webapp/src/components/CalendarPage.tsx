import React from 'react';
import {
  Container,
  Stack,
  Select,
  SelectChangeEvent,
  MenuItem,
  InputLabel,
  FormControl,
} from '@mui/material';

import { formatDate } from '../helpers/dateTime';
import useApiData from '../helpers/useApiData';
import { ProgramWithActivities } from '../types/api';

import ActivityDialog from './ActivityDialog';
import { Program } from './Program';

const CalendarPage = () => {
  const [selectedProgram, setSelectedProgram] = React.useState(0);
  const [dialogShow, setDialogShow] = React.useState(false);
  const [dialogContents, setDialogContents] = React.useState('');

  const handleClickActivity = (clickEvent?: any) => {
    if (dialogShow) {
      setDialogShow(false);
      setDialogContents('');
    } else {
      setDialogShow(true);
      setDialogContents(clickEvent.title);
    }
  };

  const {
    data: apiPrograms,
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
  if (!apiPrograms) {
    return null;
  }
  const programs = apiPrograms.map(
    program =>
      new Program({
        id: program.id,
        title: program.title,
        startDate: program.start_date,
        endDate: program.end_date,
        activities: program.activities,
      })
  );
  const changeProgram = (event: SelectChangeEvent) => {
    setSelectedProgram(parseInt(event.target.value));
  };
  return (
    <Container>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <h2>Program Activities</h2>
        <FormControl sx={{ my: 3, minWidth: 450, maxWidth: 600 }}>
          <InputLabel id="program-select-label">Program</InputLabel>
          <Select
            labelId="program-select-label"
            id="program-select"
            value={selectedProgram.toString()}
            label="Program"
            onChange={changeProgram}
          >
            {programs.map((program, index) => (
              <MenuItem value={index} key={index}>
                <strong>{program.title}</strong>&nbsp; (
                {formatDate(program.startDate)} &ndash;{' '}
                {formatDate(program.endDate)})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
      {programs[selectedProgram].getCalendar(handleClickActivity)}
      <ActivityDialog
        show={dialogShow}
        contents={dialogContents}
        handleClose={handleClickActivity}
      />
    </Container>
  );
};

export default CalendarPage;
