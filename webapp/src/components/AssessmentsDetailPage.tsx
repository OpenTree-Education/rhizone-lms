import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import {
  Container,
  // Link,
  Stack,
  Button,
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
  Question,
  AssessmentChosenAnswer
} from '../assets/data';
import { formatDateTime } from '../helpers/dateTime';
import QuestionCard from './QuestionCard';

function CircularProgressWithLabel(
  props: CircularProgressProps & { value: number }
) {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress variant="determinate" {...props} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography
          variant="caption"
          component="div"
          color="text.secondary"
        >{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}

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

  // console.log(assessmentAnswers);
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

  // define a state variable whose value is exampleTestQuestionsList
  const [assessmentQuestions] = useState(
    exampleTestQuestionsList
  );

  // TODO: (task b) before we start answering questions, update the
  // [task a]
  // with an array of the correct number of all of those objects

  // TODO: (task c) define a function that takes as parameters the question id and the updated answer choice / updated text response for an answer

  // TODO: update ending time with the logic we talked about in Discord:
  // - if there's a time limit
  //   - if (start time + time limit) > due date
  //     - due date
  //   - else
  //     - (start time + time limit)
  // - else
  //   - due date

  const [endingTime] = useState(new Date(assessment?.dueDate!));
  const [secondsRemaining, setSecondsRemaining] = useState(
    (endingTime.getTime() - new Date().getTime()) / 1000
  );

  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();

  const animate = (time: number) => {
    if (previousTimeRef.current !== undefined) {
      // TODO: check if time remaining would be less than zero, then set to 0 instead
      setSecondsRemaining(
        Math.round((endingTime.getTime() - new Date().getTime()) / 1000)
      );
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

  // React.useEffect(() => {
  //   const timer = setInterval(() => {
  //     setProgress(prevProgress =>
  //       prevProgress >= 100 ? 0 : prevProgress + 10
  //     );
  //   }, 800);
  //   return () => {
  //     clearInterval(timer);
  //   };
  // }, []);

  const [checked, setChecked] = React.useState(-1);

  const handleToggle = (value: number) => () => {
    setChecked(value);
  };

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Container>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', md: 'center' }}
        sx={{ marginBottom: '1em' }}
      >
        <h1>{assessment?.title}</h1>
      </Stack>
      <Grid container spacing={2}>
        <Grid item xs={3}>
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
              <ListItemText
                secondary={assessment?.description}
              />
            </ListItem>
            <Divider variant="middle" />
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <PendingIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                secondary="Progress"
                primary={LinearProgressWithLabel(
                  numOfAnsweredQuestion,
                  assessmentQuestions.length
                )}
              />
            </ListItem>
            <Divider variant="middle" />
            <ListItem>
              <ListItemAvatar>
                {checked === 1 ? (
                  <CircularProgressWithLabel value={progress} />
                ) : (
                  <Avatar>
                    {/* <Avatar sx={{ bgcolor: amber[500] }}> */}
                    <TimerIcon />
                  </Avatar>
                )}
              </ListItemAvatar>
              <ListItemText
                secondary="Time Remaining"
                primary={`${secondsRemaining} seconds`}
              />
              <Switch
                edge="end"
                onChange={handleToggle(-checked)}
                checked={checked === 1}
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
            <Divider variant="middle" />
            <ListItem>
              <ListItemAvatar>
                {/* <Avatar sx={{ bgcolor: blue[500] }}> */}
                <Avatar>
                  <AssignmentTurnedInIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText>
                <Button
                  variant="contained"
                  // variant="outlined"
                  size="medium"
                  onClick={handleClickOpen}
                >
                  Submit
                </Button>
              </ListItemText>
            </ListItem>
          </List>
        </Grid>
        <Grid
          container
          xs={7.5}
          spacing={2}
          style={{
            height: '75vh',
            overflow: 'auto',
            marginTop: 0,
            marginLeft: 0,
          }}
          bgcolor="#fafafa"
        >
          <Grid item xs={1} />
          <Grid item xs={10}>
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
                />
              </Grid>
              <Grid item xs={1} />
            </>
          ))}
          <Grid item xs={12} />
        </Grid>
        <Grid item xs={1.5}>
          <List style={{ paddingLeft: 0 }}>
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
            <Divider variant="middle" />
            <ListItem sx={{ justifyContent: 'center' }}>
              <Button
                variant="outlined"
                size="medium"
                onClick={handleClickOpen}
              >
                Submit
              </Button>{' '}
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
          <Button onClick={handleClose} variant="contained">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AssessmentsDetailPage;
