import React, { useState, useEffect } from 'react';
import { CircularProgress, Container, Stack } from '@mui/material';
import { View, Views } from 'react-big-calendar';

import ProgramPicker from './ProgramPicker';
import ProgramCalendar from './ProgramCalendar';

import useApiData from '../helpers/useApiData';
import { ProgramWithActivities } from '../types/api';

const ProgramsPage = () => {
  const [selectedProgram, setSelectedProgram] = useState(0);
  const [windowWidth, setWindowWidth] = useState(720);
  const [currentView, setCurrentView] = useState<View>(Views.WEEK);
  const [manuallyChosenView, setManuallyChosenView] = useState<View>(
    Views.WEEK
  );
  const [viewOptions, setViewOptions] = useState<View[]>([
    Views.MONTH,
    Views.WEEK,
    Views.DAY,
    Views.AGENDA,
  ]);

  const handleViewChange = (manualView: View) => {
    setCurrentView(windowWidth <= 600 ? Views.DAY : manualView);
    setManuallyChosenView(manualView);
  };

  const handleResize = () => {
    if (window.innerWidth < windowWidth) {
      setCurrentView(window.innerWidth <= 600 ? Views.DAY : manuallyChosenView);
      setViewOptions(
        window.innerWidth <= 600
          ? [Views.DAY]
          : [Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]
      );
    } else {
      setViewOptions(
        window.innerWidth <= 600
          ? [Views.DAY]
          : [Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]
      );
      setCurrentView(window.innerWidth <= 600 ? Views.DAY : manuallyChosenView);
    }
  };

  const setWidth = (e: Event) => {
    if (!e || !e.target) return;
    const window = e.target as Window;
    const { innerWidth } = window;
    if (innerWidth) {
      setWindowWidth(innerWidth);
    }
  };

  useEffect(() => {
    window.addEventListener('resize', setWidth);
    return () => {
      window.removeEventListener('resize', setWidth);
    };
  });

  useEffect(handleResize, [manuallyChosenView, windowWidth]);

  const {
    data: programsList,
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
      <Stack
        alignItems="center"
        justifyContent="center"
        sx={{ height: '40em' }}
      >
        <CircularProgress size={100} disableShrink />
      </Stack>
    );
  }
  if (!programsList) {
    return null;
  }

  return (
    <Container>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', md: 'center' }}
      >
        <h1>Program Activities</h1>
        <ProgramPicker
          programs={programsList}
          selectedProgram={selectedProgram}
          setSelectedProgram={setSelectedProgram}
        />
      </Stack>
      <ProgramCalendar
        program={programsList[selectedProgram]}
        currentView={currentView}
        setCurrentView={handleViewChange}
        viewOptions={viewOptions}
      />
    </Container>
  );
};

export default ProgramsPage;
