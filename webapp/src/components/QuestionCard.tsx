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

import { Question, AssessmentResponse } from '../types/api.d';

interface QuestionCardProps {
  question: Question;
  assessmentResponse: AssessmentResponse;
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
  const [singleChoiceValue, setSingleChoiceValue] = React.useState(
    assessmentResponse.answer_id ? assessmentResponse.answer_id : 0
  );
  const handleChangeSingleChoice = (event: SelectChangeEvent) => {
    setSingleChoiceValue(Number(event.target.value));
    handleUpdatedResponse(question.id!, Number(event.target.value), undefined);
  };

  const [responseTextValue, setResponseTextValue] = React.useState(
    assessmentResponse.response ? assessmentResponse.response : ''
  );

  const handleChangeText = (event: React.ChangeEvent<HTMLInputElement>) => {
    setResponseTextValue(event.target.value);
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
          <RadioGroup
            value={singleChoiceValue}
            onChange={handleChangeSingleChoice}
          >
            {question.answers?.map(a => (
              <>
                <FormControlLabel
                  control={
                    <Radio
                      disabled={
                        submissionState !== 'Opened' &&
                        submissionState !== 'In Progress'
                      }
                    />
                  }
                  value={a.id}
                  key={a.id}
                  label={a.title}
                  checked={assessmentResponse.answer_id === a.id}
                />
                {a.description && (
                  <Typography variant="caption" sx={{ marginLeft: '3em' }}>
                    ({a.description})
                  </Typography>
                )}{' '}
              </>
            ))}
          </RadioGroup>
        </FormControl>
      );
    } else if (question.question_type === 'single choice') {
      return (
        <FormControl style={{ width: '50%' }}>
          <Select
            required
            onChange={handleChangeSingleChoice}
            value={singleChoiceValue === 0 ? '' : singleChoiceValue.toString()}
            disabled={
              submissionState !== 'Opened' && submissionState !== 'In Progress'
            }
          >
            {question.answers?.map(a => (
              <MenuItem value={a.id} key={a.id}>
                {a.title}
                {a.description && (
                  <Typography variant="caption">({a.description})</Typography>
                )}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      );
    } else {
      return (
        <TextField
          required
          multiline
          variant="standard"
          fullWidth
          label="Answer"
          value={responseTextValue}
          onChange={handleChangeText}
          disabled={
            submissionState !== 'Opened' && submissionState !== 'In Progress'
          }
        />
      );
    }
  };
  return (
    <Card>
      <CardContent>
        <Typography gutterBottom variant="h6" component="div">
          {question.sort_order}. {question.title}
          {question.description && (
            <Typography variant="caption" sx={{ marginLeft: '1em' }}>
              ({question.description})
            </Typography>
          )}
        </Typography>
        {TableRowWrapper(question)}
      </CardContent>
    </Card>
  );
};

export default QuestionCard;
