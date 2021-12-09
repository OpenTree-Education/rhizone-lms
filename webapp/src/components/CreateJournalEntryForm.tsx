import React, { ChangeEventHandler, Component, FormEventHandler } from 'react';

import { CreationResponseEnvelope } from '../types/api';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

interface CreateJournalEntryFormProps {
  onJournalEntryCreated?: (response: CreationResponseEnvelope) => void;
}

interface OptionId {
  id: number;
}

interface CreateJournalEntryFormState {
  journalEntryText: string;
  selectedOptions: OptionId[];
  rows: number;
  loading: boolean;
  errorVisibility: boolean;
  successVisibility: boolean;
}

class CreateJournalEntryForm extends Component<
  CreateJournalEntryFormProps,
  CreateJournalEntryFormState
> {
  constructor(props: CreateJournalEntryFormProps) {
    super(props);
    this.state = {
      journalEntryText: '',
      selectedOptions: [],
      rows: 1,
      loading: false,
      errorVisibility: false,
      successVisibility: false,
    };
  }
  handleChangeJournalEntryText: ChangeEventHandler<HTMLTextAreaElement> =
    event => {
      this.setState({ journalEntryText: event.target.value });
    };

  handleSubmit: FormEventHandler = async event => {
    event.preventDefault();
    this.setState({ loading: true });

    try {
      const createJournalEntry = await fetch(
        `${process.env.REACT_APP_API_ORIGIN}/reflections`,
        {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            raw_text: this.state.journalEntryText,
            options: this.state.selectedOptions,
          }),
        }
      );
      if (createJournalEntry.ok && this.props.onJournalEntryCreated) {
        this.props.onJournalEntryCreated(await createJournalEntry.json());

        this.setState({
          successVisibility: true,
          errorVisibility: false,
          journalEntryText: '',
        });
      } else {
        this.setState({ errorVisibility: true });
      }
    } catch (err) {
      this.setState({ errorVisibility: true });
    }
    this.setState({ loading: false });
  };

  handleOptionsSelection: ChangeEventHandler<HTMLInputElement> = event => {
    this.setState({ selectedOptions: [{ id: Number(event.target.value) }] });
  };

  render() {
    // HACK Until the questionnaire can be loaded from the API, the ids for the
    //   options in the outlook check-in form are taken from this environment
    //   variable in the format "#,#,#,#,#" where "#" represents an option id
    //   in order of `options.sort_order` for the outlook prompt. If the
    //   environment variable is unavailable or does not have five values, the
    //   outlook check-in form is hidden to prevent save errors.
    const outlookOptionIds = process.env.REACT_APP_TEMP_OUTLOOK_OPTIONS
      ? process.env.REACT_APP_TEMP_OUTLOOK_OPTIONS.split(',')
      : [];
    return (
      <form onSubmit={this.handleSubmit}>
        <Card sx={{ maxWidth: 1000 }}>
          <CardContent>
            <Typography variant="h4" component="h1" sx={{ mb: 5 }}>
              New Reflection
            </Typography>
            {outlookOptionIds.length === 5 && (
              <>
                <Typography variant="inherit" component="h2">
                  Outlook
                </Typography>
                <FormControl component="fieldset">
                  <FormLabel component="legend">
                    How are you feeling about your current endevours?
                  </FormLabel>
                  <RadioGroup
                    row
                    aria-label="mood"
                    name="row-radio-buttons-group"
                    onChange={this.handleOptionsSelection}
                  >
                    <Stack direction="row" sx={{ my: 3, textAlign: 'center' }}>
                      <FormControlLabel
                        value={outlookOptionIds[0]}
                        control={<Radio />}
                        label="Very discouraged"
                        labelPlacement="bottom"
                      />
                      <FormControlLabel
                        value={outlookOptionIds[1]}
                        control={<Radio />}
                        label="A little discouraged"
                        labelPlacement="bottom"
                      />
                      <FormControlLabel
                        value={outlookOptionIds[2]}
                        control={<Radio />}
                        label="I don't know"
                        labelPlacement="bottom"
                      />
                      <FormControlLabel
                        value={outlookOptionIds[3]}
                        control={<Radio />}
                        label="A little hopeful"
                        labelPlacement="bottom"
                      />
                      <FormControlLabel
                        value={outlookOptionIds[4]}
                        control={<Radio />}
                        label="Very hopeful"
                        labelPlacement="bottom"
                      />
                    </Stack>
                  </RadioGroup>
                </FormControl>
              </>
            )}
          </CardContent>
          <CardContent sx={{ paddingBottom: 0 }}>
            <Typography variant="inherit" component="h2">
              Journal
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              Write a new journal entry (optional)
            </Typography>
            <TextField
              fullWidth
              label="How is it going?"
              onFocus={() => {
                this.setState({ rows: 4 });
              }}
              minRows={this.state.rows}
              multiline
              onChange={this.handleChangeJournalEntryText}
              value={this.state.journalEntryText}
            />
          </CardContent>
          <CardContent>
            {this.state.successVisibility && (
              <Snackbar
                open={true}
                autoHideDuration={6000}
                onClose={() => {
                  this.setState({ successVisibility: false });
                }}
                message="Reflection created"
              >
                <Alert
                  onClose={() => {
                    this.setState({ successVisibility: false });
                  }}
                  severity="success"
                  sx={{ width: '100%' }}
                >
                  Reflection created
                </Alert>
              </Snackbar>
            )}
            {this.state.errorVisibility && (
              <Alert
                onClose={() => {
                  this.setState({ errorVisibility: false });
                }}
                severity="error"
                sx={{ mb: 2 }}
              >
                Reflection was not saved!
              </Alert>
            )}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: 220,
              }}
            >
              <Button
                type="submit"
                variant="contained"
                disabled={this.state.loading}
              >
                Save reflection
              </Button>
              {this.state.loading && <CircularProgress />}
            </Box>
          </CardContent>
        </Card>
      </form>
    );
  }
}

export default CreateJournalEntryForm;
