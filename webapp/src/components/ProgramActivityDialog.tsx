import React, { FormEventHandler, useState } from 'react';
import { decodeHTML } from 'entities';
import CancelIcon from '@mui/icons-material/Cancel';
import CloseIcon from '@mui/icons-material/Close';
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
import IconButton from '@mui/material/IconButton';
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
  const [completed, setCompleted] = useState<boolean | null>(null);
  // const [markCompletedError, setMarkCompletedError] = useState(null);
  // const [isSuccessMessageVisible, setIsSuccessMessageVisible] = useState(false);

  const sendAPIGetRequest = (path: string) => {
    if (contents.activityType !== 'assignment') return;
    return fetch(`${process.env.REACT_APP_API_ORIGIN}${path}`, {
      method: 'GET',
      credentials: 'include',
    })
      .then(res => res.json())
      .then(async ({ data }) => {
        if (data) {
          setCompleted(data.completed);
        }
      });
  };
  const sendAPIPutRequest = (path: string, body: Object) => {
    if ('completed' in body && body.completed === null) {
      return;
    }
    fetch(`${process.env.REACT_APP_API_ORIGIN}${path}`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
      .then(res => res.json())
      .then(({ data }) => {
        if (data) {
          setCompleted(data.completed);
        }
      });
  };

  React.useEffect(() => {
    async function fetchData() {
      setCompleted(null);
      if (show) {
        await sendAPIGetRequest(
          `/programs/activityStatus/${contents.programId}/${contents.curriculumActivityId}`
        );
      }
    }
    fetchData();
  }, [contents, show]);

  const markCompleted: FormEventHandler = event => {
    event.preventDefault();
    if (event.type !== 'click') return;
    sendAPIPutRequest(
      `/programs/activityStatus/${contents.programId}/${contents.curriculumActivityId}`,
      { completed: true }
    );
  };
  const markIncomplete: FormEventHandler = event => {
    event.preventDefault();
    if (event.type !== 'click') return;
    sendAPIPutRequest(
      `/programs/activityStatus/${contents.programId}/${contents.curriculumActivityId}`,
      { completed: false }
    );
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
  const tableHeaderCellStyle = {
    fontWeight: 'bold',
    border: 'none',
    verticalAlign: 'top',
    textAlign: 'right',
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
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            ml: 10,
            right: 8,
            top: 8,
            color: theme => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ textAlign: 'center' }}>
        <DialogContentText sx={{ fontSize: { xs: '89%', sm: '100%' } }}>
          {timeRange()}
        </DialogContentText>
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
                    pr: { xs: '0.375rem', sm: '1rem' },
                  }}
                >
                  Program:
                </TableCell>
                <TableCell
                  sx={{
                    border: 'none',
                    fontWeight: 'bold',
                    px: { xs: '0rem', sm: '1rem' },
                  }}
                >
                  {contents.programTitle}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row" sx={tableHeaderCellStyle}>
                  Activity Type:
                </TableCell>
                <TableCell
                  sx={{
                    border: 'none',
                    fontWeight: 'bold',
                    verticalAlign: 'top',
                    textAlign: 'right',
                    pr: { xs: '0.375rem', sm: '1rem' },
                  }}
                >
                  {contents.activityType}
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
      {contents.activityType === 'assignment' && (
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
              {!completed ? (
                <Button
                  onClick={markCompleted}
                  type="submit"
                  form="form"
                  variant="contained"
                >
                  <TaskAltIcon sx={{ mr: 1 }} />
                  Mark Complete
                </Button>
              ) : (
                <Button
                  onClick={markIncomplete}
                  type="submit"
                  variant="outlined"
                >
                  <CancelIcon sx={{ mr: 1 }} />
                  Mark Incomplete
                </Button>
              )}
            </FormGroup>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};
export default ProgramActivityDialog;
