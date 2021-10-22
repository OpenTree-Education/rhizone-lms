import { Container } from '@mui/material';
import React, { Component } from 'react';

import CreateJournalEntryForm from './CreateJournalEntryForm';
import JournalEntriesTable from './JournalEntriesTable';
import { JournalEntry } from '../types/api';
import Navbar from "./Navbar";

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

  componentDidMount() {
    this.fetchJournalEntries();
  }

  fetchJournalEntries = async () => {
    const fetchJournalEntries = await fetch(
      `${process.env.REACT_APP_API_ORIGIN}/journalentries`,
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
          <>
            <CreateJournalEntryForm
              onJournalEntryCreated={this.fetchJournalEntries}
            />
            <JournalEntriesTable journalEntries={this.state.journalEntries} />
          </>
        )}
      </Container>
    );
  }
}

export default App;
