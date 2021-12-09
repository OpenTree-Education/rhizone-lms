import {
  Box,
  Container,
  Grid,
  Typography,
  Stack,
  Drawer,
  List,
  ListItem,
  Divider,
  ListItemText,
} from '@mui/material';
import ArrowRightIcon from '@mui/icons-material/ArrowRight'; //close drawer icon

import React, { Component } from 'react';

import CreateJournalEntryForm from './CreateJournalEntryForm';
import JournalEntriesList from './JournalEntriesList';
import { JournalEntry, MeetingInfo } from '../types/api';
import Navbar from './Navbar';
import { formatDate, formatTime } from '../helpers/dateTime';

interface AppState {
  loggedIn: boolean | null;
  journalEntries: JournalEntry[];
  isMeetingDrawerOpen: boolean;
  allMeetingsList: MeetingInfo[];
  upcomingMeetingsList: MeetingInfo[];
  pastMeetingsList: MeetingInfo[];
}

interface AppProps {}

class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      loggedIn: null,
      journalEntries: [],
      isMeetingDrawerOpen: false,
      allMeetingsList: [],
      upcomingMeetingsList: [],
      pastMeetingsList: [],
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
        this.fetchMeetingsInfoList();
      }
    }
  }

  fetchMeetingsInfoList = async () => {
    const fetchMeetings = await fetch(
      `${process.env.REACT_APP_API_ORIGIN}/meetings`,
      { credentials: 'include' }
    );
    if (fetchMeetings.status === 401) {
      this.setState({ loggedIn: false });
    }
    if (fetchMeetings.ok) {
      const { data: allMeetingsList } = await fetchMeetings.json();
      this.setState({ loggedIn: true, allMeetingsList });
      let startIndexOfPastMeeting = 0;
      for (let i = 0; i < this.state.allMeetingsList.length; i++) {
        if (Date.parse(this.state.allMeetingsList[i].starts_at) < Date.now()) {
          startIndexOfPastMeeting = i;
          break;
        }
      }
      this.setState({
        upcomingMeetingsList: this.state.allMeetingsList.slice(
          0,
          startIndexOfPastMeeting
        ),
        pastMeetingsList: this.state.allMeetingsList.slice(
          startIndexOfPastMeeting
        ),
      });
    }
  };

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

  render() {
    return (
      <div>
        <Stack px={3}>
          <Navbar
            loggedIn={this.state.loggedIn}
            handleCalendarClick={this.handleCalendarClick}
          />
        </Stack>
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
        <Drawer
          variant="persistent"
          anchor="right"
          open={this.state.isMeetingDrawerOpen}
          transitionDuration={400}
          PaperProps={{
            sx: {
              '@media (max-width: 360px)': { width: '100vw' },
              width: '360px',
            },
          }}
        >
          <List sx={{ pt: 0 }}>
            <ListItem
              sx={{
                backgroundColor: 'primary.main',
                color: 'common.white',
                p: 1,
                '&:hover': {
                  cursor: 'pointer',
                },
              }}
              onClick={() => this.setState({ isMeetingDrawerOpen: false })}
            >
              <ArrowRightIcon />
            </ListItem>
            <Divider />
            <ListItem
              sx={{
                backgroundColor: 'primary.main',
                py: 2,
              }}
            >
              <Typography variant="h5" sx={{ color: 'common.white' }}>
                Upcoming Meetings
              </Typography>
            </ListItem>
            {this.state.upcomingMeetingsList.reverse().map(meeting => {
              return (
                <div key={meeting.id}>
                  <ListItem>
                    <ListItemText
                      primary={formatDate(meeting.starts_at)}
                      secondary={formatTime(meeting.starts_at)}
                    />
                  </ListItem>
                  <Divider />
                </div>
              );
            })}

            <ListItem
              sx={{
                backgroundColor: 'primary.main',
                py: 2,
              }}
            >
              <Typography variant="h5" sx={{ color: 'common.white' }}>
                Past Meetings
              </Typography>
            </ListItem>

            {this.state.pastMeetingsList.map(meeting => {
              return (
                <div key={meeting.id}>
                  <ListItem>
                    <ListItemText
                      primary={formatDate(meeting.starts_at)}
                      secondary={formatTime(meeting.starts_at)}
                    />
                  </ListItem>
                  <Divider />
                </div>
              );
            })}
          </List>
        </Drawer>
      </div>
    );
  }
}

export default App;
