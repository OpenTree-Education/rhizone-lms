import { Button, Grid, IconButton } from '@mui/material';
import React, { useContext } from 'react';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PeopleIcon from '@mui/icons-material/People';
import MeetingsDrawerContext from './MeetingsDrawerContext';

const Navbar = () => {
  const { open: openMeetingsDrawer } = useContext(MeetingsDrawerContext);
  return (
    <Grid alignItems="center" container px={3}>
      <Grid item xs>
        <h1>Rhizone</h1>
      </Grid>
      <Grid item xs="auto">
        <IconButton sx={{ mr: 1 }} href="/calendar">
          <CalendarMonthIcon />
        </IconButton>
        <IconButton sx={{ mr: 1 }} onClick={openMeetingsDrawer}>
          <PeopleIcon />
        </IconButton>
        <Button
          component="a"
          href={`${process.env.REACT_APP_API_ORIGIN}/auth/logout`}
        >
          Sign Out
        </Button>
      </Grid>
    </Grid>
  );
};

export default Navbar;
