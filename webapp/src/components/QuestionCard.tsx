import React from 'react';
import {
  TextField,
  FormControlLabel,
  Radio,
  Card,
  CardContent,
  Typography,
  RadioGroup,
  FormControl,
  MenuItem,
} from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import {Question, AssessmentResponse, Answer, AssessmentSubmission} from '../types/api.d'

interface QuestionCardProps {
  question: Question;
  assessmentResponse:AssessmentResponse;
  handleUpdatedResponse: (
    questionId: number,
    answerId?: number,
    response?: string
  ) => void;
  submissionState: string;
}

const QuestionCard = ({
  question,
  assessmentResponse,
  handleUpdatedResponse,
  submissionState,
}: QuestionCardProps) => {
  const [radioValue, setRadioValue] = React.useState('');
  const handleChangeRadio = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRadioValue(event.target.value);
    handleUpdatedResponse(question.id!, parseInt(event.target.value), undefined);
  };

  const [selectValue, setSelectValue] = React.useState('');
  const handleChangeSelect = (event: SelectChangeEvent) => {
    setSelectValue(event.target.value);
    handleUpdatedResponse(question.id!, parseInt(event.target.value), undefined);
  };

  const handleChangeText = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleUpdatedResponse(
      question.id!,
      undefined,
      event.target.value === '' ? undefined : event.target.value
    );
  };

  const TableRowWrapper = (question: Question) => {
    if (
      question.question_type === 'single choice' &&
      question.answers?.length &&
      question.answers?.length < 5
    ) {
      return (
        <FormControl>
          <RadioGroup value={radioValue} onChange={handleChangeRadio}>
            {question.answers?.map(a => (
              <FormControlLabel
                control={<Radio disabled={submissionState !== 'Opened'} />}
                value={a.id}
                key={a.id}
                label={a.title}
                checked={assessmentResponse.answer_id === a.id}
              />
            ))}
          </RadioGroup>
        </FormControl>
      );
    } else if (question.question_type === 'single choice') {
      return (
        <FormControl style={{ width: '50%' }}>
          <Select
            required
            onChange={handleChangeSelect}
            value={selectValue}
            disabled={submissionState !== 'Opened'}
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
          label={assessmentResponse.response}
          multiline
          variant="standard"
          fullWidth
          onChange={handleChangeText}
          disabled={submissionState !== 'Opened'}
        />
      );
    }
  };
  return (
    <Card>
      <CardContent>
        <Typography gutterBottom variant="h6" component="div">
          {question.sort_order}. {question.title}
        </Typography>
        {TableRowWrapper(question)}
      </CardContent>
    </Card>
  );
};

export default QuestionCard;
