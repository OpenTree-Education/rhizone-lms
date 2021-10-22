import { Button, Grid } from '@mui/material';
import React from 'react';

interface NavbarProps {
  loggedIn: boolean | null;
}

const Navbar = ({ loggedIn }: NavbarProps) => (
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
        <Button
          component="a"
          href={`${process.env.REACT_APP_API_ORIGIN}/auth/logout`}
        >
          Sign Out
        </Button>
      )}
    </Grid>
  </Grid>
);

export default Navbar;
