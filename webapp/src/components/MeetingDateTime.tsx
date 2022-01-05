import { Link as MuiLink, ListItem, ListItemText } from '@mui/material';
import React from 'react';
import { Link as ReactRouterLink } from 'react-router-dom';

import { formatDate, formatTime } from '../helpers/dateTime';
import { Meeting } from '../types/api';

interface MeetingDateTimeProps {
  meeting: Meeting;
}

const MeetingDateTime = ({ meeting }: MeetingDateTimeProps) => (
  <ListItem
    sx={{
      backgroundColor: 'common.white',
      '&:hover': { backgroundColor: 'grey.200' },
    }}
  >
    <MuiLink
      component={ReactRouterLink}
      to={`/meetings/${meeting.id}`}
      underline="none"
      sx={{ color: 'text.primary' }}
    >
      <ListItemText
        primary={formatDate(meeting.starts_at)}
        secondary={formatTime(meeting.starts_at)}
      />
    </MuiLink>
  </ListItem>
);

export default MeetingDateTime;
