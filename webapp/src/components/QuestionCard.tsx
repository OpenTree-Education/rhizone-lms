import React from 'react';
import { Question } from '../assets/data';
import { TextField, FormControlLabel, Radio, Snackbar } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import { AssessmentChosenAnswer } from '../assets/data';

interface QuestionCardProps {
  question: Question;
  assessmentAnswers: AssessmentChosenAnswer[];
  handleNewAnswer: (
    question: Question,
    chosenAnswerId?: number,
    responseText?: string
  ) => void;
  currentStatus: string;
}

const QuestionCard = ({
  question,
  assessmentAnswers,
  handleNewAnswer,
  currentStatus,
}: QuestionCardProps) => {
  const [radioValue, setRadioValue] = React.useState('');
  const handleChangeRadio = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRadioValue(event.target.value);
    handleNewAnswer(question, parseInt(event.target.value), undefined);
  };

  const [selectValue, setSelectValue] = React.useState('');
  const handleChangeSelect = (event: SelectChangeEvent) => {
    setSelectValue(event.target.value);
    handleNewAnswer(question, parseInt(event.target.value), undefined);
  };

  const handleChangeText = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleNewAnswer(
      question,
      undefined,
      event.target.value === '' ? undefined : event.target.value
    );
  };

  const TableRowWrapper = (question: Question) => {
    if (
      question.questionType === 'single choice' &&
      question.answers?.length &&
      question.answers?.length < 5
    ) {
      return (
        <FormControl>
          <RadioGroup value={radioValue} onChange={handleChangeRadio}>
            {question.answers?.map(a => (
              <FormControlLabel
                control={<Radio disabled={currentStatus === 'Submitted'} />}
                value={a.id}
                key={a.id}
                label={a.title}
              />
            ))}
          </RadioGroup>
        </FormControl>
      );
    } else if (question.questionType === 'single choice') {
      return (
        <FormControl style={{ width: '50%' }}>
          <Select
            required
            onChange={handleChangeSelect}
            value={selectValue}
            disabled={currentStatus === 'Submitted'}
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
          label="Answer"
          multiline
          variant="standard"
          fullWidth
          onChange={handleChangeText}
          disabled={currentStatus === 'Submitted'}
        />
      );
    }
  };
  return (
    <Card>
      <CardContent>
        <Typography gutterBottom variant="h6" component="div">
          {question.sortOrder}. {question.title}
        </Typography>
        {TableRowWrapper(question)}
      </CardContent>
      <Snackbar
        open={currentStatus === 'Submitted'}
        autoHideDuration={6000}
        onClose={() => {}}
        message="Assignment submitted successfully!"
      />
    </Card>
  );
};

export default QuestionCard;
