import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { Divider, Drawer, List, ListItem, Typography } from '@mui/material';
import React, {
  createContext,
  PropsWithChildren,
  useMemo,
  useState,
} from 'react';

import { Meeting as APIMeeting } from '../types/api';
import MeetingQuickView from './MeetingQuickView';
import useApiData from '../helpers/useApiData';

const MeetingsDrawerContext = createContext({
  isOpen: false,
  open: () => {},
  close: () => {},
});

export const MeetingsDrawerProvider = ({ children }: PropsWithChildren<{}>) => {
  const [isOpen, setIsOpen] = useState(false);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const { data: meetings } = useApiData<APIMeeting[]>({
    deps: [isOpen],
    path: '/meetings',
    sendCredentials: true,
    shouldFetch: () => isOpen,
  });
  const [upcomingMeetings, pastMeetings] = useMemo(() => {
    if (!meetings) {
      return [[], []];
    }
    const now = Date.now();
    let startIndexOfPastMeeting = meetings.length;
    for (let i = 0; i < meetings.length; i++) {
      if (Date.parse(meetings[i].starts_at) < now) {
        startIndexOfPastMeeting = i;
        break;
      }
    }
    return [
      meetings.slice(0, startIndexOfPastMeeting).reverse(),
      meetings.slice(startIndexOfPastMeeting),
    ];
  }, [meetings]);
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
            <MeetingQuickView key={meeting.id} meeting={meeting} />
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
            <MeetingQuickView key={meeting.id} meeting={meeting} />
          ))}
        </List>
      </Drawer>
    </MeetingsDrawerContext.Provider>
  );
};

export default MeetingsDrawerContext;
