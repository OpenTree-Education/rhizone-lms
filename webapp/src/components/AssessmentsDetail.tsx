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
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ImageIcon from '@mui/icons-material/Image';
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
              <ListItemAvatar>
                <Avatar>
                  <PendingIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary="Progress"
                secondary={<LinearProgressWithLabel value={progress} />}
              />
            </ListItem>
            <Divider variant="middle" />
            <ListItem>
              <ListItemAvatar>
                {checked === 1 ? (
                  <CircularProgressWithLabel value={progress} />
                ) : (
                  <Avatar>
                    <PendingIcon />
                  </Avatar>
                )}
              </ListItemAvatar>
              <ListItemText primary="Timer" secondary="120min total" />
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
                <Avatar>
                  <BeachAccessIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Vacation" secondary="July 20, 2014" />
            </ListItem>
          </List>
        </Grid>
        <Grid container xs={9} spacing={2}>
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
                  style={{ width: '50%' }}
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
        </Grid>
      </Grid>
    </Container>
  );
};

export default AssessmentsDetail;
