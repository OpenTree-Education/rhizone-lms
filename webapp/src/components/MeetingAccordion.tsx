import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Link as MuiLink,
  Typography,
} from '@mui/material';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import IconButton from '@mui/material/IconButton';
import { Link as ReactRouterLink } from 'react-router-dom';
import React from 'react';

import { formatDate, formatTime } from '../helpers/dateTime';
import MeetingQuickView from './MeetingQuickView';
import { Meeting as APIMeeting } from '../types/api';

interface MeetingAccordionProps {
  meeting: APIMeeting;
}

const MeetingAccordion = ({ meeting }: MeetingAccordionProps) => {
  return (
    <Accordion>
      <AccordionSummary
        expandIcon={
          <IconButton>
            <ExpandMoreIcon />
          </IconButton>
        }
        sx={{
          '&:hover': {
            backgroundColor: 'grey.200',
          },
        }}
      >
        <MuiLink
          component={ReactRouterLink}
          to={`/meetings/${meeting.id}`}
          underline="none"
          sx={{ color: 'text.primary' }}
          onClick={e => {
            e.stopPropagation();
          }}
        >
          <Typography variant="body1">
            Meeting on {formatDate(meeting.starts_at)}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              opacity: 0.87,
            }}
          >
            {formatTime(meeting.starts_at)}
          </Typography>
        </MuiLink>
      </AccordionSummary>
      <AccordionDetails>
        <MeetingQuickView meetingId={meeting.id} />
      </AccordionDetails>
    </Accordion>
  );
};

export default MeetingAccordion;
