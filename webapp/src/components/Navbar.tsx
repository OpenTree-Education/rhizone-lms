import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Button, Grid, IconButton } from '@mui/material';
import styled from '@emotion/styled';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';

import MeetingsDrawerContext from './MeetingsDrawerContext';

const StyledLogo = styled.span`
  &:hover {
    color: #1565c0;
  }
`;

const Navbar = () => {
  const { open: openMeetingsDrawer } = useContext(MeetingsDrawerContext);
  return (
    <Grid alignItems="center" container px={3}>
      <Grid item xs>
        <Link to="/" style={{ textDecoration: 'none', color: 'black' }}>
          <StyledLogo>
            <h1>Rhizone</h1>
          </StyledLogo>
        </Link>
      </Grid>
      <Grid item xs="auto">
        <IconButton sx={{ mr: 1 }} href="/">
          <HomeIcon />
        </IconButton>
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
