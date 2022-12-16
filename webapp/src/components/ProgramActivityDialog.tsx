import React, {
  useState,
  Dispatch,
  MouseEvent as RMouseEvent,
  SetStateAction,
} from 'react';
import { decodeHTML } from 'entities';
import { Cancel, Close, TaskAlt } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormGroup,
  IconButton,
  Snackbar,
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
  updateContents: (updatedActivity: CalendarEvent) => void;
  handleClose: () => void;
}

const tableHeaderCellStyle = {
  fontWeight: 'bold',
  border: 'none',
  verticalAlign: 'top',
  textAlign: 'right',
  pr: { xs: '0.375rem', sm: '1rem' },
};

const sendAPIPutRequest = (
  path: string,
  body: { completed: boolean },
  setIsUpdateSuccess: Dispatch<SetStateAction<boolean | null>>,
  setIsMessageVisible: Dispatch<SetStateAction<boolean>>,
  setIsLoading: Dispatch<SetStateAction<boolean>>,
  setMessage: Dispatch<SetStateAction<string>>
) => {
  let loadingDelay = setTimeout(() => setIsLoading(true), 200);
  if ('completed' in body && body.completed === null) {
    return;
  }
  return fetch(`${process.env.REACT_APP_API_ORIGIN}${path}`, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
    .then(res => res.json())
    .then(({ data, error }) => {
      clearTimeout(loadingDelay);
      setIsLoading(false);
      let completed = null;
      if (data) {
        setMessage('Assignment status updated successfully.');
        ({ completed } = data);
        setIsUpdateSuccess(true);
      } else if (error && error.message) {
        setMessage(`"${error.message}"`);
        setIsUpdateSuccess(false);
      } else {
        setMessage('An unknown error occurred.');
        setIsUpdateSuccess(false);
      }
      setIsMessageVisible(true);
      return completed;
    })
    .catch(error => {
      if (error.name === 'AbortError') {
        return;
      }
      clearTimeout(loadingDelay);
      setIsLoading(false);
      setMessage(`Encountered a ${error.name} when marking task completed.`);
      setIsUpdateSuccess(false);
      setIsMessageVisible(true);
      return null;
    });
};

const timeRange = (start?: Date, end?: Date, allDay?: boolean) => {
  if (!(start && start.getTime() > 0 && end && end.getTime() > 0)) {
    return;
  }
  if (allDay) {
    return formatDate(start.toDateString());
  }
  let timeRangeString = '';
  timeRangeString += formatDate(start.toString()) + ' ';
  timeRangeString += formatTime(start.toString());
  if (start.toString() === end.toString()) {
    return timeRangeString;
  }
  timeRangeString += decodeHTML('&nbsp;&ndash;&nbsp;');
  if (start.toDateString() !== end.toDateString()) {
    timeRangeString += formatDate(end.toString()) + ' ';
  }
  timeRangeString += formatTime(end.toString());
  return timeRangeString;
};

const ProgramActivityDialog = ({
  show,
  contents,
  updateContents,
  handleClose,
}: ProgramActivityDialogProps) => {
  const [isUpdateSuccess, setIsUpdateSuccess] = useState<boolean | null>(null);
  const [isMessageVisible, setIsMessageVisible] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const sendCompletedStatus = async (
    event: RMouseEvent<HTMLButtonElement, MouseEvent>,
    completed: boolean
  ) => {
    if (event.type !== 'click') return;
    event.preventDefault();
    contents.completed = await sendAPIPutRequest(
      `/programs/activityStatus/${contents.program_id}/${contents.curriculum_activity_id}`,
      { completed: completed },
      setIsUpdateSuccess,
      setIsMessageVisible,
      setIsLoading,
      setMessage
    );
    const updatedContents = { ...contents };
    updateContents(updatedContents);
    contents = updatedContents;
  };

  const closeDialog = () => {
    setIsUpdateSuccess(null);
    setIsMessageVisible(false);
    setMessage('');
    setIsLoading(false);
    handleClose();
  };

  return (
    <Dialog
      open={show}
      onClose={closeDialog}
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
        {contents.completed === true && <TaskAlt sx={{ ml: 1 }} />}
        <IconButton
          aria-label="close"
          onClick={closeDialog}
          sx={{
            position: 'absolute',
            ml: 10,
            right: 8,
            top: 8,
            color: theme => theme.palette.grey[500],
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ textAlign: 'center' }}>
        <DialogContentText sx={{ fontSize: { xs: '89%', sm: '100%' } }}>
          {timeRange(contents.start, contents.end, contents.allDay)}
        </DialogContentText>
      </DialogContent>
      <Divider />
      <DialogContent>
        <TableContainer>
          <Table size="small">
            <TableBody>
              <TableRow>
                <TableCell component="th" scope="row" sx={tableHeaderCellStyle}>
                  Program:
                </TableCell>
                <TableCell
                  sx={{
                    border: 'none',
                    fontWeight: 'bold',
                    px: { xs: '0rem', sm: '1rem' },
                  }}
                >
                  {contents.program_title}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row" sx={tableHeaderCellStyle}>
                  Activity Type:
                </TableCell>
                <TableCell
                  sx={{
                    border: 'none',
                    fontWeight: 'bold',
                    verticalAlign: 'top',
                    textAlign: 'left',
                    textTransform: 'capitalize',
                    px: { xs: '0', sm: '1rem' },
                  }}
                >
                  {contents.activity_type}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row" sx={tableHeaderCellStyle}>
                  Description:
                </TableCell>
                <TableCell
                  sx={{ border: 'none', px: { xs: '0rem', sm: '1rem' } }}
                >
                  {contents.description}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      {contents.activity_type === 'assignment' && (
        <>
          <Divider />
          <DialogActions>
            <FormGroup
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-end',
              }}
              id="form"
            >
              <LoadingButton
                onClick={event => {
                  sendCompletedStatus(event, !contents.completed);
                }}
                type="submit"
                form="form"
                variant={
                  contents.completed === false ? 'contained' : 'outlined'
                }
                loading={isLoading}
                sx={{ width: '15em' }}
                disabled={isUpdateSuccess === false}
                startIcon={
                  contents.completed === false ? <TaskAlt /> : <Cancel />
                }
              >
                {contents.completed === false
                  ? 'Mark Complete'
                  : 'Mark Incomplete'}
              </LoadingButton>
              {isMessageVisible && (
                <Snackbar
                  open={true}
                  autoHideDuration={1500}
                  onClose={() => setIsMessageVisible(false)}
                >
                  <Alert
                    onClose={() => setIsMessageVisible(false)}
                    severity={isUpdateSuccess ? 'success' : 'error'}
                    sx={{ width: '100%' }}
                  >
                    {message}
                  </Alert>
                </Snackbar>
              )}
            </FormGroup>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};

export default ProgramActivityDialog;
