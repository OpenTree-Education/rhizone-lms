import { Button, Grid, IconButton } from '@mui/material';
import EventNoteIcon from '@mui/icons-material/EventNote';
import React, { useContext } from 'react';

import MeetingsDrawerContext from './MeetingsDrawerContext';

const Navbar = () => {
  const { open: openMeetingsDrawer } = useContext(MeetingsDrawerContext);
  return (
    <Grid alignItems="center" container px={3}>
      <Grid item xs>
        <h1>Rhizone</h1>
      </Grid>
      <Grid item xs="auto">
        <IconButton sx={{ mr: 1 }} onClick={openMeetingsDrawer}>
          <EventNoteIcon />
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
