import { Divider, Drawer, List, ListItem, ListItemText, Typography } from '@mui/material';
import ArrowRightIcon from '@mui/icons-material/ArrowRight'; //close drawer icon

import React, { Component } from 'react'
import { formatDate, formatTime } from '../helpers/dateTime';
import { Meeting } from '../types/api';

interface MeetingsDrawerProps {
  open: boolean;
  loggedIn: boolean | null;
  handleCalendarClick: () => void;
  updateLoggedIn: (isLoggedIn: boolean) => void;
}

interface MeetingsDrawerState {
  allMeetings: Meeting[];
  upcomingMeetings: Meeting[];
  pastMeetings: Meeting[];
}

class MeetingsDrawer extends Component <MeetingsDrawerProps, MeetingsDrawerState> {
  constructor(props: MeetingsDrawerProps) {
    super(props);
    this.state = {
      allMeetings: [],
      upcomingMeetings: [],
      pastMeetings: [],
    }
  }

  async componentDidMount() {
    this.fetchMeetingsInfoList();
  
  }

  fetchMeetingsInfoList = async () => {
    const fetchMeetings = await fetch(
      `${process.env.REACT_APP_API_ORIGIN}/meetings`,
      { credentials: 'include' }
    );
    if (fetchMeetings.status === 401) {
      this.props.updateLoggedIn(false)
    }
    if (fetchMeetings.ok) {
      const { data: allMeetings } = await fetchMeetings.json();
      this.props.updateLoggedIn(true)
      this.setState({ allMeetings });
      let startIndexOfPastMeeting = 0;
      for (let i = 0; i < this.state.allMeetings.length; i++) {
        if (Date.parse(this.state.allMeetings[i].starts_at) < Date.now()) {
          startIndexOfPastMeeting = i;
          break;
        }
      }
      this.setState({
        upcomingMeetings: this.state.allMeetings.slice(
          0,
          startIndexOfPastMeeting
        ).reverse(),
        pastMeetings: this.state.allMeetings.slice(
          startIndexOfPastMeeting
        ),
      });
    }
  };

  render() {
    return (
      <Drawer
          variant="persistent"
          anchor="right"
          open={this.props.open}
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
              onClick={() => this.props.handleCalendarClick()}
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
                Upcoming meetings
              </Typography>
            </ListItem>
            {this.state.upcomingMeetings.map(meeting =>
              <div key={meeting.id}>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary={formatDate(meeting.starts_at)}
                    secondary={formatTime(meeting.starts_at)}
                  />
                </ListItem>
              </div>
            )}
            <Divider />
            <ListItem
              sx={{
                backgroundColor: 'primary.main',
                py: 2,
              }}
            >
              <Typography variant="h5" sx={{ color: 'common.white' }}>
                Past meetings
              </Typography>
            </ListItem>

            {this.state.pastMeetings.map(meeting => 
                <div key={meeting.id}>
                  <ListItem>
                    <ListItemText
                      primary={formatDate(meeting.starts_at)}
                      secondary={formatTime(meeting.starts_at)}
                    />
                  </ListItem>
                  <Divider />
                </div>
            )}
          </List>
        </Drawer>
    )
  }
}

export default MeetingsDrawer