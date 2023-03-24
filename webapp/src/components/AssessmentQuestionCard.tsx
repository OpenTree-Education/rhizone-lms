import React, { useState } from 'react';
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

import { Question, AssessmentResponse } from '../types/api';

interface QuestionCardProps {
  assessmentQuestion: Question;
  submissionResponse: AssessmentResponse;
  handleUpdatedResponse: (
    questionId: number,
    answerId?: number,
    response?: string
  ) => void;
  disabled: boolean;
}

const AssessmentQuestionCard = ({
  assessmentQuestion,
  submissionResponse,
  handleUpdatedResponse,
  disabled,
}: QuestionCardProps) => {
  const [singleChoiceValue, setSingleChoiceValue] = useState(
    submissionResponse.answer_id ? submissionResponse.answer_id : 0
  );
  const handleChangeSingleChoice = (event: SelectChangeEvent) => {
    setSingleChoiceValue(Number(event.target.value));
    handleUpdatedResponse(
      Number(assessmentQuestion.id),
      Number(event.target.value)
    );
  };

  const [responseTextValue, setResponseTextValue] = useState(
    submissionResponse.response_text ? submissionResponse.response_text : ''
  );

  const handleChangeText = (event: React.ChangeEvent<HTMLInputElement>) => {
    setResponseTextValue(event.target.value);
    handleUpdatedResponse(
      Number(assessmentQuestion.id),
      undefined,
      event.target.value === '' ? undefined : event.target.value
    );
  };

  const TableRowWrapper = (question: Question) => {
    if (
      assessmentQuestion.question_type === 'single choice' &&
      assessmentQuestion.answers?.length &&
      assessmentQuestion.answers?.length < 5
    ) {
      return (
        <FormControl>
          <RadioGroup
            value={singleChoiceValue}
            onChange={handleChangeSingleChoice}
          >
            {assessmentQuestion.answers?.map(answer => (
              <React.Fragment key={answer.id}>
                <FormControlLabel
                  control={<Radio disabled={disabled} />}
                  value={answer.id}
                  key={answer.id}
                  label={answer.title}
                  checked={submissionResponse.answer_id === answer.id}
                />
                {answer.description && (
                  <Typography variant="caption" sx={{ marginLeft: '3em' }}>
                    ({answer.description})
                  </Typography>
                )}{' '}
              </React.Fragment>
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
            disabled={disabled}
          >
            {question.answers?.map(answer => (
              <MenuItem value={Number(answer.id)} key={Number(answer.id)}>
                {answer.title}
                {answer.description && (
                  <Typography variant="caption">
                    ({answer.description})
                  </Typography>
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
          disabled={disabled}
        />
      );
    }
  };
  return (
    <Card>
      <CardContent>
        <Typography gutterBottom variant="h6" component="div">
          {assessmentQuestion.sort_order}. {assessmentQuestion.title}
          {assessmentQuestion.description && (
            <Typography variant="caption" sx={{ marginLeft: '1em' }}>
              ({assessmentQuestion.description})
            </Typography>
          )}
        </Typography>
        {TableRowWrapper(assessmentQuestion)}
      </CardContent>
    </Card>
  );
};

export default AssessmentQuestionCard;
