import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import {
  Alert,
  AlertTitle,
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  LinearProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Grid,
  Tooltip,
  Typography,
  Switch,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import InventoryIcon from '@mui/icons-material/Inventory';
import TimerIcon from '@mui/icons-material/Timer';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import { blue } from '@mui/material/colors';

import {
  assessmentList,
  exampleTestQuestionsList,
  exampleTestSubmissionList,
  Question,
  AssessmentChosenAnswer,
  SubmissionStatus,
  AssessmentType,
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

  const dueTime = new Date(assessment?.dueDate!);
  //TODO: use the opened date from the submission
  const [openedTime] = useState(new Date());
  const [secondsRemaining, setSecondsRemaining] = useState(
    assessment?.testDuration! * 60
  );

  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();

  const animate = (time: number) => {
    if (previousTimeRef.current !== undefined) {
      if (new Date().getTime() > dueTime.getTime()) {
        setSecondsRemaining(0);
      } else if (
        new Date().getTime() + assessment?.testDuration! * 60 * 1000 >
        dueTime.getTime()
      ) {
        setSecondsRemaining(
          Math.round((dueTime.getTime() - new Date().getTime()) / 1000)
        );
      } else {
        setSecondsRemaining(
          Math.round(
            (openedTime.getTime() +
              assessment?.testDuration! * 60 * 1000 -
              new Date().getTime()) /
              1000
          )
        );
      }
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  });

  const [showTimer, setShowTimer] = React.useState(true);

  const handleSetShowTimer = (showTimer: boolean) => () => {
    setShowTimer(showTimer);
  };

  const [showSubmitDialog, setShowSubmitDialog] = React.useState(false);
  const [currentStatus, setCurrentStatus] = React.useState('Opened');
  const handleOpenSubmitDialog = () => {
    setShowSubmitDialog(true);
  };

  const handleCloseSubmitDialog = () => {
    setShowSubmitDialog(false);
  };

  const [submissionIndex, setNextSubmission] = React.useState(0);

  const handleNextSubmission = () => {
    if (submissionIndex === 3) {
      setNextSubmission(0);
      setSubmission(exampleTestSubmissionList[0]);
    } else {
      setNextSubmission(submissionIndex + 1);
      setSubmission(exampleTestSubmissionList[submissionIndex + 1]);
    }
  };
  const [submission, setSubmission] = React.useState(
    exampleTestSubmissionList[submissionIndex]
  );

  const handleSubmit = (event?: React.SyntheticEvent) => {
    if (event) {
      event.preventDefault();
    }
    setShowSubmitDialog(false);
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
                  <Avatar sx={{ bgcolor: blue[600] }}>
                    {/* <Avatar> */}
                    <InfoIcon />
                  </Avatar>
                </ListItemAvatar>
                {/* <ListItemText secondary={assessment?.description} /> */}
                <ListItemText>
                  <Typography variant="body2">
                    {assessment?.description}
                  </Typography>
                  <ListItemText
                    // primary=
                    secondary={`Type: ${assessment?.type}`}
                  />
                </ListItemText>
              </ListItem>
              {/* <Divider variant="middle" /> */}
              {/* <ListItem>
              <ListItemAvatar/> */}
              {/* <Avatar sx={{ bgcolor: blue[500] }}> */}
              {/* <Avatar>
                  <AssessmentIcon />
                </Avatar> */}
              {/* </ListItemAvatar> */}
              {/* <ListItemText
                primary={assessment?.type}
                secondary="Type"
              />
            </ListItem> */}
              <Divider variant="middle" />
              <ListItem>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: blue[600] }}>
                    {/* <Avatar> */}
                    <LightbulbIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={`${
                    submission?.state === SubmissionStatus.Opened
                      ? `Active`
                      : `${submission?.state}`
                  }`}
                  secondary="Status"
                />
              </ListItem>
              {submission.state === SubmissionStatus.Graded && (
                <>
                  {/* <Divider variant="middle" component="li" /> */}
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: blue[600] }}>
                        {/* <Avatar> */}
                        <CheckCircleIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      secondary="Score"
                      primary={submission.score}
                    />
                  </ListItem>
                </>
              )}
              {submission.state === SubmissionStatus.Opened && (
                <ListItem>
                  <ListItemAvatar />
                  <ListItemText
                    secondary="Attempts"
                    primary={`${submission.id} out of max ${assessment?.maxNumSubmissions}`}
                  />
                </ListItem>
              )}
              {(submission.state === SubmissionStatus.Submitted ||
                submission.state === SubmissionStatus.Graded) && (
                <>
                  <ListItem>
                    {/* <ListItemAvatar/> */}
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: blue[600] }}>
                        {/* <Avatar> */}
                        <InventoryIcon />
                      </Avatar>
                    </ListItemAvatar>{' '}
                    <ListItemText
                      secondary="Submissions"
                      primary={`${submission.id} out of ${assessment?.maxNumSubmissions}`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemAvatar />
                    <ListItemText
                      secondary="Submitted At"
                      primary={formatDateTime(
                        new Date(submission.submitAt!).toDateString()
                      )}
                    />
                  </ListItem>
                </>
              )}
              <Divider variant="middle" component="li" />
              <ListItem>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: blue[600] }}>
                    {/* <Avatar> */}
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
              {assessment!.type === AssessmentType.Test &&
                submission.state === SubmissionStatus.Opened && (
                  <>
                    {/* <Divider variant="middle" /> */}
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: blue[600] }}>
                          {/* <Avatar> */}
                          <TimerIcon />
                        </Avatar>
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
                      <Tooltip
                        title={showTimer ? `Hide Timer` : `Show Timer`}
                        placement="top"
                        arrow
                      >
                        <Switch
                          edge="end"
                          onChange={handleSetShowTimer(!showTimer)}
                          checked={showTimer}
                          // color="warning"
                          inputProps={{
                            'aria-labelledby': 'switch-list-label-wifi',
                          }}
                        />
                      </Tooltip>
                    </ListItem>
                  </>
                )}
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
                  onClick={handleOpenSubmitDialog}
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
                      onClick={handleNextSubmission} //temp code for demenstraing different submissions
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
      </Grid>
      <Dialog open={showSubmitDialog} onClose={handleCloseSubmitDialog}>
        <DialogTitle>
          Are you sure you would like to submit this assessmnet?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            You have filled {numOfAnsweredQuestion} out of{' '}
            {assessmentQuestions.length}.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSubmitDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AssessmentsDetailPage;
