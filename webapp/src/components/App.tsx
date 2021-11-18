import { Box, Container, Grid, Typography } from '@mui/material';
import React, { Component } from 'react';

import CreateJournalEntryForm from './CreateJournalEntryForm';
import JournalEntriesList from './JournalEntriesList';
import { JournalEntry } from '../types/api';
import Navbar from './Navbar';

interface AppState {
  loggedIn: boolean | null;
  journalEntries: JournalEntry[];
}

interface AppProps {}

class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      loggedIn: null,
      journalEntries: [],
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

  render() {
    return (
      <Container fixed>
        <Navbar loggedIn={this.state.loggedIn} />
        {this.state.loggedIn === true && (
          <Grid container justifyContent="center">
            <Grid item md={6}>
              <Box sx={{ my: 8 }}>
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
    );
  }
}

export default App;
