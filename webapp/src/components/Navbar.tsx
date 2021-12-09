import { Button, Grid, IconButton } from '@mui/material';
import React from 'react';

import EventNoteIcon from '@mui/icons-material/EventNote';

interface NavbarProps {
  loggedIn: boolean | null;
  handleCalendarClick: () => void;
}

const Navbar = ({ loggedIn, handleCalendarClick }: NavbarProps) => (
  <Grid alignItems="center" container>
    <Grid item xs>
      <h1>Rhizone</h1>
    </Grid>
    <Grid item xs="auto">
      {loggedIn === false && (
        <Button
          component="a"
          href={`${process.env.REACT_APP_API_ORIGIN}/auth/github/login`}
          variant="contained"
        >
          Sign In
        </Button>
      )}
      {loggedIn === true && (
        <>
          <IconButton sx={{ mr: 1 }} onClick={() => handleCalendarClick()}>
            <EventNoteIcon />
          </IconButton>
          <Button
            component="a"
            href={`${process.env.REACT_APP_API_ORIGIN}/auth/logout`}
          >
            Sign Out
          </Button>
        </>
      )}
    </Grid>
  </Grid>
);

export default Navbar;
