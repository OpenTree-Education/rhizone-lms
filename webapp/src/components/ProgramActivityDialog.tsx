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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
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
      maxWidth="xs"
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle
        id="alert-dialog-title"
        sx={{ textAlign: 'center', fontWeight: 'bold' }}
      >
        {contents.title}
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ textAlign: 'center' }}>
        <DialogContentText>{timeRange()}</DialogContentText>
      </DialogContent>
      <Divider />
      <DialogContent>
        <TableContainer>
          <Table size="small">
            <TableBody>
              <TableRow>
                <TableCell
                  component="th"
                  scope="row"
                  sx={{
                    fontWeight: 'bold',
                    border: 'none',
                    verticalAlign: 'top',
                    textAlign: 'right',
                  }}
                >
                  Program:
                </TableCell>
                <TableCell sx={{ border: 'none', fontWeight: 'bold' }}>
                  {contents.programTitle}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  component="th"
                  scope="row"
                  sx={{
                    fontWeight: 'bold',
                    border: 'none',
                    verticalAlign: 'top',
                    textAlign: 'right',
                  }}
                >
                  Activity Type:
                </TableCell>
                <TableCell
                  sx={{
                    border: 'none',
                    fontWeight: 'bold',
                    textTransform: 'capitalize',
                  }}
                >
                  {contents.activityType}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  component="th"
                  scope="row"
                  sx={{
                    fontWeight: 'bold',
                    border: 'none',
                    verticalAlign: 'top',
                    textAlign: 'right',
                  }}
                >
                  Description:
                </TableCell>
                <TableCell sx={{ border: 'none' }}>
                  {contents.description}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
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
