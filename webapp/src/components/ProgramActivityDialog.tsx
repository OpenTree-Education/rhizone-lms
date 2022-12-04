import React, { FormEventHandler, useState } from 'react';
import { decodeHTML } from 'entities';
import CancelIcon from '@mui/icons-material/Cancel';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormGroup,
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
  const [completed, setCompleted] = useState(false);
  // const [markCompletedError, setMarkCompletedError] = useState(null);
  // const [isSuccessMessageVisible, setIsSuccessMessageVisible] = useState(false);

  //Using onClick for UI demo but onSubmit should be used in future development
  const onClick: FormEventHandler = event => {
    event.preventDefault();
    setCompleted(!completed);
    // fetch(
    //   `${process.env.REACT_APP_API_ORIGIN}/programs/activityStatus/${programId}/${activityId}`,
    //   {
    //     method: 'PATCH',
    //     credentials: 'include',
    //     headers: { 'Content-Type': 'application/json' },
    //   }
    // )
    //   .then(res => res.json())
    //   .then(({ data, error }) => {
    //     setCompleted(!completed);
    //     if (error) {
    //       setMarkCompletedError(error);
    //     }
    //     if (data) {
    //       setIsSuccessMessageVisible(true);
    //     }
    //   })
    //   .catch(error => {
    //     setCompleted(completed);
    //     setMarkCompletedError(error);
    //   });
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
      maxWidth="sm"
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle
        id="alert-dialog-title"
        sx={{
          textAlign: 'center',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {contents.title}
        {completed && <TaskAltIcon sx={{ ml: 1 }} />}
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
        {contents.activityType === 'assignment' && (
          <FormGroup
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-end',
              marginTop: '1em',
            }}
            // onSubmit={onSubmit}
          >
            {completed === false ? (
              <Button onClick={onClick} type="submit" variant="contained">
                <TaskAltIcon sx={{ mr: 1 }} />
                Mark Complete
              </Button>
            ) : (
              <Button onClick={onClick} type="submit" variant="outlined">
                <CancelIcon sx={{ mr: 1 }} />
                Mark Incomplete
              </Button>
            )}
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
