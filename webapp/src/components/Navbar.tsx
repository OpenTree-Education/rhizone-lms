import { Button, Grid, IconButton, Tooltip } from '@mui/material';
import EventNoteIcon from '@mui/icons-material/EventNote';
import React, { useContext } from 'react';
import PersonIcon from '@mui/icons-material/Person';
import MeetingsDrawerContext from './MeetingsDrawerContext';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const { open: openMeetingsDrawer } = useContext(MeetingsDrawerContext);
  return (
    <Grid alignItems="center" container px={3}>
      <Grid item xs>
        <Link style={{ textDecoration: 'none', color: 'black' }} to="/">
          <h1>Rhizone</h1>
        </Link>
      </Grid>
      <Grid item xs="auto">
        <Tooltip title="Profile">
          <IconButton component="a" sx={{ mr: 1 }} href={'/profile'}>
            <PersonIcon />
          </IconButton>
        </Tooltip>
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
