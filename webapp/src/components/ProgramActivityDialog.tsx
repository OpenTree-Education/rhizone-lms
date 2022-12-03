import React, { useState } from 'react';
import { decodeHTML } from 'entities';
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControlLabel,
  FormGroup,
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
  const [checked, setChecked] = useState(true);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  const timeRange = () => {
    if (
      !(
        contents.start &&
        contents.end &&
        contents.description &&
        contents.title &&
        contents.activityType
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
        <DialogContentText id="alert-dialog-description">
          <b>Activity Type:</b> {contents.activityType}
        </DialogContentText>
        <DialogContentText>
          <strong>Program:</strong>
          {contents.programTitle}
        </DialogContentText>

        <DialogContentText id="alert-dialog-description">
          <strong>Description:</strong> {contents.description}
        </DialogContentText>
        {contents.activityType === 'assignment' && (
          <FormGroup
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-end',
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={checked}
                  onChange={handleChange}
                  inputProps={{ 'aria-label': 'controlled' }}
                />
              }
              label="Mark Completed"
            />
          </FormGroup>
        )}
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
