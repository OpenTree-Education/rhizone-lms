import React, { ChangeEventHandler, Component, FormEventHandler } from 'react';

import { CreationResponseEnvelope } from '../types/api';
import {Button, TextField} from '@mui/material';

interface CreateJournalEntryFormProps {
  onJournalEntryCreated?: (response: CreationResponseEnvelope) => void;
}

interface CreateJournalEntryFormState {
  journalEntryText: string;
}

class CreateJournalEntryForm extends Component<
  CreateJournalEntryFormProps,
  CreateJournalEntryFormState
> {
  constructor(props: CreateJournalEntryFormProps) {
    super(props);
    this.state = {
      journalEntryText: '',
    };
  }
  handleChangeJournalEntryText: ChangeEventHandler<HTMLTextAreaElement> =
    event => {
      this.setState({ journalEntryText: event.target.value });
    };

  handleSubmit: FormEventHandler = async event => {
    event.preventDefault();
    const createJournalEntry = await fetch(
      `${process.env.REACT_APP_API_ORIGIN}/journalentries`,
      {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ raw_text: this.state.journalEntryText }),
      }
    );
    if (createJournalEntry.ok && this.props.onJournalEntryCreated) {
      this.props.onJournalEntryCreated(await createJournalEntry.json());
    }
  };
  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <h2>Write a new journal entry</h2>
        <TextField
          fullWidth
          label="How is it going?"
          minRows={4}
          multiline
          onChange={this.handleChangeJournalEntryText}
          value={this.state.journalEntryText}
        />
        <p>
          <Button type="submit" variant="contained">Save</Button>
        </p>
      </form>
    );
  }
}

export default CreateJournalEntryForm;
