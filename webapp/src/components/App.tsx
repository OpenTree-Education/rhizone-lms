import React, { Component } from 'react';

import CreateJournalEntryForm from './CreateJournalEntryForm';
import JournalEntriesTable from './JournalEntriesTable';
import { JournalEntry } from '../types/api';

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
      <div className="App">
        {this.state.loggedIn === false && (
          <p>
            <a href={`${process.env.REACT_APP_API_ORIGIN}/auth/github/login`}>
              Sign In
            </a>
          </p>
        )}
        {this.state.loggedIn === true && (
          <>
            <p>
              <a href={`${process.env.REACT_APP_API_ORIGIN}/auth/logout`}>
                Sign Out
              </a>
            </p>
            <h1>Rhizone</h1>
            <CreateJournalEntryForm
              onJournalEntryCreated={this.fetchJournalEntries}
            />
            <JournalEntriesTable journalEntries={this.state.journalEntries} />
          </>
        )}
      </div>
    );
  }
}

export default App;
