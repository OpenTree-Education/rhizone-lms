import { Divider, Drawer, List, ListItem, ListItemText, Typography } from '@mui/material';
import ArrowRightIcon from '@mui/icons-material/ArrowRight'; //close drawer icon

import React, { Component } from 'react'
import { formatDate, formatTime } from '../helpers/dateTime';
import { MeetingInfo } from '../types/api';

interface MeetingsDrawerProps {
  open: boolean;
  loggedIn: boolean | null;
  handleCalendarClick: () => void;
  updateLoggedIn: (isLoggedIn: boolean) => void;
}

interface MeetingsDrawerState {
  allMeetingsList: MeetingInfo[];
  upcomingMeetingsList: MeetingInfo[];
  pastMeetingsList: MeetingInfo[];
}

class MeetingsDrawer extends Component <MeetingsDrawerProps, MeetingsDrawerState> {
  constructor(props: MeetingsDrawerProps) {
    super(props);
    this.state = {
      allMeetingsList: [],
      upcomingMeetingsList: [],
      pastMeetingsList: [],
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
      const { data: allMeetingsList } = await fetchMeetings.json();
      this.props.updateLoggedIn(true)
      this.setState({ allMeetingsList });
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
                Past meetings
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
    )
  }
}

export default MeetingsDrawer