import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import {
  Alert,
  AlertTitle,
  Container,
  Collapse,
  // Link,
  Stack,
  Button,
  Snackbar,
  // Paper,
  // TableContainer,
  // TextField,
  // FormControlLabel,
  // Radio,
  Grid,
  Chip,
  // FormGroup,
  // IconButton,
} from '@mui/material';
import Box from '@mui/material/Box';
// import Drawer from '@mui/material/Drawer';
// import AppBar from '@mui/material/AppBar';
// import CssBaseline from '@mui/material/CssBaseline';
// import Toolbar from '@mui/material/Toolbar';
// import Card from '@mui/material/Card';
// import CardActions from '@mui/material/CardActions';
// import CardContent from '@mui/material/CardContent';
// import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import InfoIcon from '@mui/icons-material/Info';
// import ImageIcon from '@mui/icons-material/Image';
import InventoryIcon from '@mui/icons-material/Inventory';
// import WorkIcon from '@mui/icons-material/Work';
// import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import Divider from '@mui/material/Divider';
import CircularProgress, {
  CircularProgressProps,
} from '@mui/material/CircularProgress';
import Switch from '@mui/material/Switch';
import LinearProgress from '@mui/material/LinearProgress';
// import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';
// import PendingOutlinedIcon from '@mui/icons-material/PendingOutlined';
import PendingIcon from '@mui/icons-material/Pending';
// import RadioGroup from '@mui/material/RadioGroup';
// import FormControl from '@mui/material/FormControl';
// import FormLabel from '@mui/material/FormLabel';
// import InputLabel from '@mui/material/InputLabel';
// import MenuItem from '@mui/material/MenuItem';
// import Select, { SelectChangeEvent } from '@mui/material/Select';
// import {
//   green,
//   pink,
//   blue,
//   yellow,
//   orange,
//   amber,
//   indigo,
// } from '@mui/material/colors';

import TimerIcon from '@mui/icons-material/Timer';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
// import PublishIcon from '@mui/icons-material/Publish';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// import ArchiveIcon from '@mui/icons-material/Archive';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import {
  assessmentList,
  exampleTestQuestionsList,
  exampleTestSubmissionList,
  AssessmentSubmission,
  Question,
  AssessmentChosenAnswer,
} from '../assets/data';
import { formatDateTime } from '../helpers/dateTime';
import QuestionCard from './QuestionCard';

const LinearProgressWithLabel = (
  numOfAnsweredQuestion: number,
  numOfTotalQuestion: number
) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress
          variant="determinate"
          value={Math.round((numOfAnsweredQuestion * 100) / numOfTotalQuestion)}
        />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography
          variant="body2"
          color="text.secondary"
        >{`${numOfAnsweredQuestion}/${numOfTotalQuestion}`}</Typography>
      </Box>
    </Box>
  );
};

const AssessmentsDetailPage = () => {
  const id = useParams();
  const assessment = assessmentList.find(
    assessment => assessment.id === parseInt(id.id ? id.id : '')
  );
  const [progress] = React.useState(10);

  let assessmentAnswersArr = new Array<AssessmentChosenAnswer>(
    exampleTestQuestionsList.length
  );
  for (var i = 0; i < exampleTestQuestionsList.length; i++) {
    assessmentAnswersArr[i] = {
      chosenAnswerId: undefined,
      responseText: undefined,
    };
  }
  const [assessmentAnswers, setAssessmentAnswers] =
    useState(assessmentAnswersArr);
  const [numOfAnsweredQuestion, setNumOfAnsweredQuestion] = useState(0);

  const handleNewAnswer = (
    question: Question,
    chosenAnswerId?: number,
    responseText?: string
  ) => {
    assessmentAnswers[question.sortOrder - 1].chosenAnswerId = chosenAnswerId;
    assessmentAnswers[question.sortOrder - 1].responseText = responseText;
    setAssessmentAnswers(assessmentAnswers);
    setNumOfAnsweredQuestion(
      assessmentAnswers.filter(a => a.chosenAnswerId || a.responseText).length
    );
  };

  const [assessmentQuestions] = useState(exampleTestQuestionsList);

  // TODO: update ending time with the logic we talked about in Discord:
  // - if there's a time limit
  //   - if (start time + time limit) > due date
  //     - due date
  //   - else
  //     - (start time + time limit)
  // - else
  //   - due date

  const lastSubmission: AssessmentSubmission = exampleTestSubmissionList.reduce(
    (max, submission) => (max.id > submission.id ? max : submission)
  );
  const dueTime = new Date(assessment?.dueDate!);
  const currentTime = new Date();
  const [endingTime, setEndingTime] = useState(dueTime);

  const [secondsRemaining, setSecondsRemaining] = useState(
    (endingTime!.getTime() - new Date().getTime()) / 1000
  );

  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();

  const animate = (time: number) => {
    if (previousTimeRef.current !== undefined) {
      // TODO: check if time remaining would be less than zero, then set to 0 instead
      if (endingTime!.getTime() < new Date().getTime()) {
        setSecondsRemaining(0);
      } else {
        setSecondsRemaining(
          Math.round((endingTime!.getTime() - new Date().getTime()) / 1000)
        );
      }
    }
    previousTimeRef.current = time;
    // TODO: if time remaining is not zero, then execute the next line
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  });

  const [showTimer, setChecked] = React.useState(true);

  const handleToggle = (showTimer: boolean) => () => {
    setChecked(showTimer);
  };

  const [open, setOpen] = React.useState(false);
  const [currentStatus, setCurrentStatus] = React.useState('Opened');
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (event?: React.SyntheticEvent) => {
    if (event) {
      event.preventDefault();
    }
    setOpen(false);
    //store the form data into database
    setCurrentStatus('Submitted');
    document.querySelector('#assessment_display')!.scrollTo(0, 0);
  };

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Typography
            variant="h4"
            style={{ marginBottom: '20px', marginTop: '20px' }}
          >
            {assessment?.title}
          </Typography>
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <List
              sx={{
                width: '100%',
                maxWidth: 360,
              }}
            >
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <InfoIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText secondary={assessment?.description} />
              </ListItem>
              <Divider variant="middle" />
              <ListItem>
                <ListItemAvatar>
                  {/* {showTimer? (
                  <CircularProgressWithLabel value={progress} />
                ) : ( */}
                  <Avatar>
                    {/* <Avatar sx={{ bgcolor: amber[500] }}> */}
                    <TimerIcon />
                  </Avatar>
                  {/* )} */}
                </ListItemAvatar>
                <ListItemText
                  secondary={showTimer ? `Time Remaining` : `Time Limit`}
                  primary={
                    showTimer
                      ? `${Math.floor(secondsRemaining / 60)}m ${
                          secondsRemaining % 60
                        }s`
                      : assessment?.testDuration + `m`
                  }
                />
                <Switch
                  edge="end"
                  onChange={handleToggle(!showTimer)}
                  checked={showTimer}
                  inputProps={{
                    'aria-labelledby': 'switch-list-label-wifi',
                  }}
                />
              </ListItem>
              <Divider variant="middle" component="li" />
              <ListItem>
                <ListItemAvatar>
                  {/* <Avatar  sx={{ bgcolor: orange[500] }}> */}
                  <Avatar>
                    <CalendarMonthIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  secondary="Due Date"
                  primary={formatDateTime(
                    assessment?.dueDate ? assessment?.dueDate : ''
                  )}
                />
              </ListItem>
              <Divider variant="middle" />
              <ListItem>
                <ListItemAvatar>
                  {/* <Avatar sx={{ bgcolor: indigo[500] }}> */}
                  <Avatar>
                    <InventoryIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  secondary="Submissions"
                  primary={`First out of ${assessment?.maxNumSubmissions}`}
                />
              </ListItem>
              <ListItem>
                <ListItemAvatar />
                <ListItemText
                  secondary="Last Submission Date"
                  primary={formatDateTime(
                    assessment?.submittedDate
                      ? assessment?.submittedDate
                      : '2023-03-31'
                  )}
                />
              </ListItem>
              <Divider variant="middle" component="li" />
              <ListItem>
                <ListItemAvatar>
                  {/* <Avatar sx={{ bgcolor: green[500] }}> */}
                  <Avatar>
                    <CheckCircleIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText secondary="Score" primary="90" />
              </ListItem>
            </List>
          </Grid>
          <Grid
            id="assessment_display"
            container
            xs={12}
            md={7.5}
            spacing={2}
            sx={{
              height: '75vh',
              overflow: 'auto',
              marginTop: 0,
              marginLeft: 0,
              paddingTop: '15px',
              paddingBottom: '20px',
              backgroundColor: '#fafafa',
              border: '1px solid #bbb',
            }}
          >
            <Grid item xs={1} />
            <Grid item xs={10}>
              <Collapse in={currentStatus === 'Submitted'}>
                <Alert severity="success">
                  <AlertTitle>Success</AlertTitle>
                  {assessment!.type} submitted successfully!
                </Alert>
              </Collapse>
            </Grid>
            <Grid item xs={1} />
            {exampleTestQuestionsList.map(q => (
              <>
                <Grid item xs={1} />
                <Grid item xs={10}>
                  {/* {assessmentAnswers[q.sortOrder - 1] &&
                  assessmentAnswers[q.sortOrder - 1].chosenAnswerId}
                {assessmentAnswers[q.sortOrder - 1] &&
                  assessmentAnswers[q.sortOrder - 1].responseText} */}
                  <QuestionCard
                    question={q}
                    assessmentAnswers={assessmentAnswers}
                    handleNewAnswer={handleNewAnswer}
                    currentStatus={currentStatus}
                  />
                </Grid>
                <Grid item xs={1} />
              </>
            ))}
          </Grid>
          <Grid item xs={12} md={1.5}>
            <List style={{ paddingLeft: 0 }}>
              <ListItem sx={{ justifyContent: 'center' }}>
                <Button
                  variant={`${
                    numOfAnsweredQuestion === assessmentQuestions.length
                      ? 'contained'
                      : 'outlined'
                  }`}
                  size="medium"
                  onClick={handleClickOpen}
                >
                  Submit
                </Button>
              </ListItem>
              <Divider variant="middle" />
              <ListItem>
                <ListItemText
                  primary={LinearProgressWithLabel(
                    numOfAnsweredQuestion,
                    assessmentQuestions.length
                  )}
                />
              </ListItem>
              <ListItem>
                <Box sx={{ flexWrap: 'wrap', justifyContent: 'center' }}>
                  {assessmentQuestions.map(a => (
                    <Chip
                      style={{ marginLeft: 1, marginBottom: 3 }}
                      label={a.sortOrder}
                      key={a.id}
                      color={`${
                        assessmentAnswers[a.sortOrder - 1].chosenAnswerId ||
                        assessmentAnswers[a.sortOrder - 1].responseText
                          ? 'primary'
                          : 'default'
                      }`}
                    />
                  ))}
                </Box>
              </ListItem>
            </List>
          </Grid>
        </Grid>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle id="alert-dialog-title">
            Are you sure you would like to submit this assessmnet?
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              You have filled {numOfAnsweredQuestion} out of{' '}
              {assessmentQuestions.length}.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained">
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
    </Container>
  );
};

export default AssessmentsDetailPage;
