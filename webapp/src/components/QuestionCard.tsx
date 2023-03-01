import { Container } from '@mui/material';
import React from 'react';
import { useParams } from 'react-router-dom';
import { Question } from '../assets/data';
import {
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

const TableRowWrapper = (question: Question) => {
  if (
    question.questionType === 'single choice' &&
    question.answers?.length &&
    question.answers?.length < 5
  ) {
    return (
      <FormControl>
        {question.answers?.map(a => (
          <FormControlLabel
            value={a.id}
            key={a.id}
            control={<Radio />}
            label={a.title}
          />
        ))}
      </FormControl>
    );
  } else if (question.questionType === 'single choice') {
    return (
      <FormControl style={{ width: '50%' }}>
        {/* <InputLabel id={question.id}>Select</InputLabel> */}
        <Select
          required
          // labelId="demo-simple-select-label"
          // id="demo-simple-select"
          // value={age}
          // label="Select"
          // onChange={handleChange}
        >
          {question.answers?.map(a => (
            <MenuItem value={a.id} key={a.id}>
              {a.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  } else {
    return (
      <TextField
        required
        // id=${question.id?}
        // name="address1"
        label="Answer"
        multiline
        style={{ width: '50%' }} //how to turn full width when screen width is smaller
      />
    );
  }
};

const QuestionCard = (props: { question: Question }) => {
  //why (props: { question: Question })  not (question: Question)
  return (
    <Card>
      <CardContent>
        <Typography gutterBottom variant="h6" component="div">
          {props.question.sortOrder}. {props.question.title}
        </Typography>
        {TableRowWrapper(props.question)}
      </CardContent>
    </Card>
  );
};

export default QuestionCard;
