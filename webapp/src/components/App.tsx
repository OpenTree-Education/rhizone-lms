import { Box, Container, Grid, Typography } from '@mui/material';

import React, { Component } from 'react';

import CreateJournalEntryForm from './CreateJournalEntryForm';
import JournalEntriesList from './JournalEntriesList';
import { JournalEntry } from '../types/api';
import Navbar from './Navbar';
import MeetingsDrawer from './MeetingsDrawer';

interface AppState {
  loggedIn: boolean | null;
  journalEntries: JournalEntry[];
  isMeetingDrawerOpen: boolean;
}

interface AppProps {}

class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      loggedIn: null,
      journalEntries: [],
      isMeetingDrawerOpen: false,
    };
  }

  async componentDidMount() {
    const fetchSessionInfo = await fetch(
      `${process.env.REACT_APP_API_ORIGIN}/auth/session`,
      { credentials: 'include' }
    );
    if (fetchSessionInfo.ok) {
      const { data: sessionInfo } = await fetchSessionInfo.json();
      this.setState({ loggedIn: sessionInfo.authenticated });
      if (sessionInfo.authenticated) {
        this.fetchJournalEntries();
      }
    }
  }

  fetchJournalEntries = async () => {
    const fetchJournalEntries = await fetch(
      `${process.env.REACT_APP_API_ORIGIN}/reflections`,
      { credentials: 'include' }
    );
    if (fetchJournalEntries.status === 401) {
      this.setState({ loggedIn: false });
    }
    if (fetchJournalEntries.ok) {
      const { data: journalEntries } = await fetchJournalEntries.json();
      this.setState({ loggedIn: true, journalEntries });
    }
  };

  handleCalendarClick = () => {
    this.setState({ isMeetingDrawerOpen: !this.state.isMeetingDrawerOpen });
  };

  updateLoggedIn = (isLoggedIn: boolean) => {
    this.setState({ loggedIn: isLoggedIn });
  };

  render() {
    return (
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
    );
  }
}

export default App;
