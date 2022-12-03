import React from 'react';
import { decodeHTML } from 'entities';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
} from '@mui/material';

import { formatDate, formatTime } from '../helpers/dateTime';
import { CalendarEvent } from '../types/api';

interface ProgramActivityDialogProps {
  show: boolean;
  contents: CalendarEvent;
  handleClose: () => void;
}

const ProgramActivityDialog = ({
  show,
  contents,
  handleClose,
}: ProgramActivityDialogProps) => {
  const timeRange = () => {
    if (
      !(
        contents.start &&
        contents.end &&
        contents.description &&
        contents.title
      )
    ) {
      return;
    }
    if (contents.allDay) {
      return formatDate(contents.start.toDateString());
    }

    let timeRangeString = '';

    timeRangeString += formatDate(contents.start.toString()) + ' ';
    timeRangeString += formatTime(contents.start.toString());

    if (contents.start.toString() === contents.end.toString()) {
      return timeRangeString;
    }

    timeRangeString += decodeHTML('&nbsp;&ndash;&nbsp;');

    if (contents.start.toDateString() !== contents.end.toDateString()) {
      timeRangeString += formatDate(contents.end.toString()) + ' ';
    }
    timeRangeString += formatTime(contents.end.toString());

    return timeRangeString;
  };

  return (
    <Dialog
      open={show}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title" sx={{ textAlign: 'center' }}>
        {contents.title}
      </DialogTitle>

      <Divider />

      <DialogContent>
        <DialogContentText id="alert-dialog-description" sx={{ mb: 1 }}>
          {timeRange()}
        </DialogContentText>

        <DialogContentText>
          <strong>Program:</strong>
          {contents.programTitle}
        </DialogContentText>

        <DialogContentText id="alert-dialog-description">
          <strong>Description:</strong> {contents.description}
        </DialogContentText>
      </DialogContent>

      <Divider />

      <DialogActions>
        <Button onClick={handleClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProgramActivityDialog;
