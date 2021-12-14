import { ListItem, ListItemText } from '@mui/material';
import React from 'react';

import { formatDate, formatTime } from '../helpers/dateTime';
import { Meeting } from '../types/api';

interface MeetingDateTimeProps {
  meeting: Meeting;
}

const MeetingDateTime = ({ meeting }: MeetingDateTimeProps) => (
  <>
    <ListItem>
      <ListItemText
        primary={formatDate(meeting.starts_at)}
        secondary={formatTime(meeting.starts_at)}
      />
    </ListItem>
  </>
);

export default MeetingDateTime;
