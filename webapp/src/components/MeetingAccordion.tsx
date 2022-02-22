import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Link as MuiLink,
  ListItem,
  ListItemText,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Link as ReactRouterLink } from 'react-router-dom';
import React from 'react';

import { formatDate, formatTime } from '../helpers/dateTime';
import Meeting from './Meeting';
import { Meeting as APIMeeting } from '../types/api';

interface MeetingAccordionProps {
  meeting: APIMeeting;
}

const MeetingAccordion = ({ meeting }: MeetingAccordionProps) => {
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <ListItem>
          <MuiLink
            component={ReactRouterLink}
            to={`/meetings/${meeting.id}`}
            underline="none"
            sx={{ color: 'text.primary' }}
            onClick={e => {
              e.stopPropagation();
            }}
          >
            <ListItemText
              primary={formatDate(meeting.starts_at)}
              secondary={formatTime(meeting.starts_at)}
            />
          </MuiLink>
        </ListItem>
      </AccordionSummary>
      <AccordionDetails>
        <Meeting meetingId={meeting.id} />
      </AccordionDetails>
    </Accordion>
  );
};

export default MeetingAccordion;
