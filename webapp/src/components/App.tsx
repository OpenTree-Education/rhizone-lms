<<<<<<< Updated upstream
import {
  Box,
  Container,
  Grid,
  Typography,
  Stack
} from '@mui/material';


=======
import { Box, Container, Typography } from '@mui/material';
>>>>>>> Stashed changes
import React, { Component } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import MeetingNotesShow from './MeetingNotesShow';
import Navbar from './Navbar';
<<<<<<< Updated upstream
import MeetingsDrawer from './MeetingsDrawer';

interface AppState {
  loggedIn: boolean | null;
  journalEntries: JournalEntry[];
  isMeetingDrawerOpen: boolean;
=======
import Reflections from './Reflections';

interface AppState {
  loggedIn: boolean | null;
>>>>>>> Stashed changes
}

interface AppProps { }

class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      loggedIn: null,
<<<<<<< Updated upstream
      journalEntries: [],
      isMeetingDrawerOpen: false,
=======
>>>>>>> Stashed changes
    };

    this.updateLoggedIn = this.updateLoggedIn.bind(this);
  }

  async componentDidMount() {
    const fetchSessionInfo = await fetch(
      `${process.env.REACT_APP_API_ORIGIN}/auth/session`,
      { credentials: 'include' }
    );
    if (fetchSessionInfo.ok) {
      const { data: sessionInfo } = await fetchSessionInfo.json();
      this.setState({ loggedIn: sessionInfo.authenticated });
    }
  }

  updateLoggedIn(loggedInStatus: boolean) {
    this.setState({ loggedIn: loggedInStatus });
  }

  handleCalendarClick = () => {
    this.setState({ isMeetingDrawerOpen: !this.state.isMeetingDrawerOpen });
  };

  updateLoggedIn = (isLoggedIn: boolean) => {
    this.setState({ loggedIn: isLoggedIn })
  }

  render() {
    return (
<<<<<<< Updated upstream
      <div>
          <Navbar
            loggedIn={this.state.loggedIn}
            handleCalendarClick={this.handleCalendarClick}
          />
        <Container fixed>
          {this.state.loggedIn === true && (
            <Grid container justifyContent="center">
              <Grid item md={8}>
                <Box sx={{ my: 12 }}>
                  <CreateJournalEntryForm
                    onJournalEntryCreated={this.fetchJournalEntries}
                  />
                </Box>
                {this.state.journalEntries.length > 0 && (
                  <JournalEntriesList
                    journalEntries={this.state.journalEntries}
                  />
                )}
              </Grid>
            </Grid>
          )}
          <Box sx={{ my: 12 }}>
            <Typography align="center">
              <small>© OpenTree Education Inc.</small>
            </Typography>
          </Box>
        </Container>
        <MeetingsDrawer
          open={this.state.isMeetingDrawerOpen}
          handleCalendarClick={this.handleCalendarClick}
          loggedIn={this.state.loggedIn}
          updateLoggedIn={this.updateLoggedIn}
        />
      </div>
=======
      <Container fixed>
        <Navbar loggedIn={this.state.loggedIn} />
        <Router>
          <Routes>
            {this.state.loggedIn ? (
              <Route
                path="/"
                element={<Reflections updateLoggedIn={this.updateLoggedIn} />}
              />
            ) : (
              ''
            )}
            {this.state.loggedIn ? (
              <Route path="meetings/:id" element={<MeetingNotesShow />} />
            ) : (
              ''
            )}
          </Routes>
        </Router>
        <Box sx={{ my: 12 }}>
          <Typography align="center">
            <small>© OpenTree Education Inc.</small>
          </Typography>
        </Box>
      </Container>
>>>>>>> Stashed changes
    );
  }
}

export default App;
