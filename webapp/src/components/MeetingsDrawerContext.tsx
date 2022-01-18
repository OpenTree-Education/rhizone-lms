import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { Divider, Drawer, List, ListItem, Typography } from '@mui/material';
import React, { createContext, ReactNode, useEffect, useState } from 'react';

import { Meeting } from '../types/api';
import MeetingDateTime from './MeetingDateTime';

const MeetingsDrawerContext = createContext({
  isOpen: false,
  open: () => {},
  close: () => {},
});

declare interface MeetingsDrawerProviderProps {
  children: ReactNode;
}

export const MeetingsDrawerProvider = ({
  children,
}: MeetingsDrawerProviderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const [upcomingMeetings, setUpcomingMeetings] = useState<Meeting[]>([]);
  const [pastMeetings, setPastMeetings] = useState<Meeting[]>([]);
  useEffect(() => {
    if (!isOpen) {
      return;
    }
    fetch(`${process.env.REACT_APP_API_ORIGIN}/meetings`, {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(({ data: allMeetings }) => {
        const now = Date.now();
        let startIndexOfPastMeeting = allMeetings.length;
        for (let i = 0; i < allMeetings.length; i++) {
          if (Date.parse(allMeetings[i].starts_at) < now) {
            startIndexOfPastMeeting = i;
            break;
          }
        }
        setUpcomingMeetings(
          allMeetings.slice(0, startIndexOfPastMeeting).reverse()
        );
        setPastMeetings(allMeetings.slice(startIndexOfPastMeeting));
      });
  }, [isOpen]);
  return (
    <MeetingsDrawerContext.Provider value={{ isOpen, open, close }}>
      {children}
      <Drawer
        variant="persistent"
        anchor="right"
        open={isOpen}
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
            onClick={close}
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
          {upcomingMeetings.map(meeting => (
            <MeetingDateTime key={meeting.id} meeting={meeting} />
          ))}
          {upcomingMeetings.length === 0 && <Divider />}
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
          {pastMeetings.map(meeting => (
            <MeetingDateTime key={meeting.id} meeting={meeting} />
          ))}
        </List>
      </Drawer>
    </MeetingsDrawerContext.Provider>
  );
};

export default MeetingsDrawerContext;
