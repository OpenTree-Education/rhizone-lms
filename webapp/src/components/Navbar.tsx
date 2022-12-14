import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import EngineeringIcon from '@mui/icons-material/Engineering';
import { Button, Grid, IconButton, Tooltip } from '@mui/material';
import styled from '@emotion/styled';

import MeetingsDrawerContext from './MeetingsDrawerContext';

const StyledLogo = styled.span`
  cursor: auto;
  h1:hover {
    color: #1565c0;
    cursor: pointer;
  }
`;

const Navbar = () => {
  const { open: openMeetingsDrawer } = useContext(MeetingsDrawerContext);
  return (
    <Grid alignItems="center" container px={3}>
      <Grid item xs>
        <Link to="/" style={{ textDecoration: 'none', color: 'black' }}>
          <StyledLogo>
            <h1 style={{ height: '50px', width: '125px' }}>Rhizone</h1>
          </StyledLogo>
        </Link>
      </Grid>

      <Grid item xs="auto">
        <Tooltip title="Home">
          <Link to="/">
            <IconButton sx={{ mr: 1 }}>
              <HomeIcon />
            </IconButton>
          </Link>
        </Tooltip>
        <Tooltip title="Competencies">
          <Link to="/competencies">
            <IconButton sx={{ mr: 1 }}>
              <EngineeringIcon />
            </IconButton>
          </Link>
        </Tooltip>
        <Tooltip title="Program Activities">
          <Link to="/calendar">
            <IconButton sx={{ mr: 1 }}>
              <CalendarMonthIcon />
            </IconButton>
          </Link>
        </Tooltip>
        <Tooltip title="Meetings">
          <IconButton sx={{ mr: 1 }} onClick={openMeetingsDrawer}>
            <PeopleIcon />
          </IconButton>
        </Tooltip>
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
