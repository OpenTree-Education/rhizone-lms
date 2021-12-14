import React from 'react';
import { Box, Grid } from '@mui/material';
import CreateJournalEntryForm from './CreateJournalEntryForm';
import JournalEntriesList from './JournalEntriesList';
import { JournalEntry } from '../types/api';

interface ReflectionsState {
  journalEntries: JournalEntry[];
}

interface ReflectionsProps {}

class Reflections extends React.Component<ReflectionsProps, ReflectionsState> {
  constructor(props: ReflectionsProps) {
    super(props);
    this.state = {
      journalEntries: [],
    };
  }

  async componentDidMount() {
    this.fetchJournalEntries();
  }

  fetchJournalEntries = async () => {
    const fetchJournalEntries = await fetch(
      `${process.env.REACT_APP_API_ORIGIN}/reflections`,
      { credentials: 'include' }
    );

    if (fetchJournalEntries.ok) {
      const { data: journalEntries } = await fetchJournalEntries.json();
      this.setState({ journalEntries });
    }
  };

  render() {
    return (
      <Grid container justifyContent="center">
        <Grid item xs={12} md={8}>
          <Box my={12}>
            <CreateJournalEntryForm
              onJournalEntryCreated={this.fetchJournalEntries}
            />
          </Box>
          {this.state.journalEntries.length > 0 && (
            <JournalEntriesList journalEntries={this.state.journalEntries} />
          )}
        </Grid>
      </Grid>
    );
  }
}

export default Reflections;
