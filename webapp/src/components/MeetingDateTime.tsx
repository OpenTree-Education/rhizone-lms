import { ListItem, ListItemText } from '@mui/material';
import React from 'react';
import MuiLink from '@mui/material/Link';
import { Link as ReactLink } from 'react-router-dom';

import { formatDate, formatTime } from '../helpers/dateTime';
import { Meeting } from '../types/api';

interface MeetingDateTimeProps {
  meeting: Meeting;
}

const MeetingDateTime = ({ meeting }: MeetingDateTimeProps) => (
  <MuiLink
    component={ReactLink}
    to={`/meetings/${meeting.id}`}
    underline="none"
  >
    <ListItem
      sx={{
        backgroundColor: 'common.white',
        '&:hover': { backgroundColor: 'grey.200' },
      }}
    >
      <ListItemText
        primary={formatDate(meeting.starts_at)}
        secondary={formatTime(meeting.starts_at)}
        sx={{ color: 'black' }}
      />
    </ListItem>
  </MuiLink>
);

export default MeetingDateTime;
