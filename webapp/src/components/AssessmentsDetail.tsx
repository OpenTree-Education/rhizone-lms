import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

import {
  Container,
  Link,
  Stack,
  Button,
  Paper,
  TableContainer,
  TextField,
  FormControlLabel,
  Radio,
  Grid,
  FormGroup,
  IconButton,
} from '@mui/material';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ImageIcon from '@mui/icons-material/Image';
import InventoryIcon from '@mui/icons-material/Inventory';
import WorkIcon from '@mui/icons-material/Work';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import Divider from '@mui/material/Divider';
import { assessmentList, exampleTestQuestionsList } from '../assets/data';
import CircularProgress, {
  CircularProgressProps,
} from '@mui/material/CircularProgress';
import Switch from '@mui/material/Switch';
import LinearProgress, {
  LinearProgressProps,
} from '@mui/material/LinearProgress';
import PendingOutlinedIcon from '@mui/icons-material/PendingOutlined';
import PendingIcon from '@mui/icons-material/Pending';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { formatDateTime } from '../helpers/dateTime';
import {
  green,
  pink,
  blue,
  yellow,
  orange,
  amber,
  indigo,
} from '@mui/material/colors';

import TimerIcon from '@mui/icons-material/Timer';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PublishIcon from '@mui/icons-material/Publish';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArchiveIcon from '@mui/icons-material/Archive';

import QuestionCard from './QuestionCard';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

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

function LinearProgressWithLabel(
  props: LinearProgressProps & { value: number }
) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          props.value
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

// arrow = arrow function. You name the function and then the curly brackets defines what the function does.
// our conventions say that we should be following the const with arrow function format
const AssessmentsDetail = () => {
  const id = useParams();
  const assessment = assessmentList.find(
    assessment => assessment.id === parseInt(id.id ? id.id : '')
  );
  const [progress, setProgress] = React.useState(10);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prevProgress =>
        prevProgress >= 100 ? 0 : prevProgress + 10
      );
    }, 800);
    return () => {
      clearInterval(timer);
    };
  }, []);

  const [checked, setChecked] = React.useState(-1);

  const handleToggle = (value: number) => () => {
    setChecked(value);
  };

  const [age, setAge] = React.useState('');

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value as string);
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
      >
        <h1>Assessments</h1>
        {/* <Link href="/assessment/">back</Link> */}
      </Stack>
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <List
            sx={{
              width: '100%',
              maxWidth: 360,
              bgcolor: 'background.paper',
            }}
          >
            <ListItem>
              <ListItemText
                primary={`${assessment?.type}: ${assessment?.title}`}
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
                primary={<LinearProgressWithLabel value={progress} />}
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
                secondary="Time Limit"
                primary={`${assessment?.testDuration} minutes`}
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
                primary={`0 out of ${assessment?.maxNumSubmissions}`}
              />
            </ListItem>
            {/* <Divider variant="middle" component="li" /> */}
            <ListItem>
              <ListItemAvatar>
                {/* <Avatar>
                  <BeachAccessIcon />
                </Avatar> */}
              </ListItemAvatar>
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
                  size="medium"
                  onClick={handleClickOpen}
                >
                  Submit
                </Button>
              </ListItemText>
            </ListItem>
          </List>
        </Grid>
        <Grid container xs={9} spacing={2}>
          <Grid item xs={1.5} />
          <Grid item xs={9}>
            <Card>
              <CardContent>
                <Typography gutterBottom variant="h4" component="div">
                  {assessment?.type}: {assessment?.title}
                </Typography>
                <Typography gutterBottom variant="body1" component="div">
                  {assessment?.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={1.5} />
          {exampleTestQuestionsList.map(q => (
            <>
              <Grid item xs={1.5} />
              <Grid item xs={9}>
                <QuestionCard question={q} />
              </Grid>
              <Grid item xs={1.5} />
            </>
          ))}
          <Grid item xs={1.5} />
          <Grid item xs={9}>
            <Card>
              <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                  {exampleTestQuestionsList[0].title}
                </Typography>
                <FormControl>
                  <RadioGroup>
                    <FormControlLabel
                      value="female"
                      control={<Radio />}
                      label="Female"
                    />
                    <FormControlLabel
                      value="male"
                      control={<Radio />}
                      label="Male"
                    />
                    <FormControlLabel
                      value="other"
                      control={<Radio />}
                      label="Other"
                    />
                  </RadioGroup>
                </FormControl>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={1.5} />
          <Grid item xs={1.5} />
          <Grid item xs={9}>
            <Card>
              <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                  {exampleTestQuestionsList[0].title}
                </Typography>
                <TextField
                  required
                  id="address1"
                  name="address1"
                  label="Answer"
                  multiline
                  style={{ width: '50%' }} //how to turn full width when screen width is smaller
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={1.5} />
          <Grid item xs={1.5} />
          <Grid item xs={9}>
            <Card>
              <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                  {exampleTestQuestionsList[0].title}
                </Typography>
                <FormControl style={{ width: '50%' }}>
                  <InputLabel id="demo-simple-select-label">Select</InputLabel>
                  <Select
                    required
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={age}
                    label="Select"
                    onChange={handleChange}
                  >
                    <MenuItem value={10}>Ten</MenuItem>
                    <MenuItem value={20}>Twenty</MenuItem>
                    <MenuItem value={30}>Thirty</MenuItem>
                  </Select>
                </FormControl>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={1.5} />
          <Grid item xs={1.5} />
          <Grid item xs={9}>
            <Button variant="contained" size="large" onClick={handleClickOpen}>
              Submit
            </Button>
            <Dialog
              open={open}
              onClose={handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                {"Use Google's location service?"}
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                You have filled (javascript questions answered.length) out of (total question length). 
                Are you sure you would like to submit your assessmnet? 
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>Disagree</Button>
                <Button onClick={handleClose} >
                  Agree
                </Button>
              </DialogActions>
            </Dialog>
          </Grid>
          <Grid item xs={1.5} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default AssessmentsDetail;
