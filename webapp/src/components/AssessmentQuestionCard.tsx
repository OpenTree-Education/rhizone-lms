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
  const [singleChoiceValue, setSingleChoiceValue] = React.useState(
    submissionResponse.answer_id ? submissionResponse.answer_id : 0
  );
  const handleChangeSingleChoice = (event: SelectChangeEvent) => {
    setSingleChoiceValue(Number(event.target.value));
    handleUpdatedResponse(assessmentQuestion.id!, Number(event.target.value));
  };

  const [responseTextValue, setResponseTextValue] = React.useState(
    submissionResponse.response ? submissionResponse.response : ''
  );

  const handleChangeText = (event: React.ChangeEvent<HTMLInputElement>) => {
    setResponseTextValue(event.target.value);
    handleUpdatedResponse(
      assessmentQuestion.id!,
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
            {assessmentQuestion.answers?.map(a => (
              <React.Fragment key={a.id}>
                <FormControlLabel
                  control={<Radio disabled={disabled} />}
                  value={a.id}
                  key={a.id}
                  label={a.title}
                  checked={submissionResponse.answer_id === a.id}
                />
                {a.description && (
                  <Typography variant="caption" sx={{ marginLeft: '3em' }}>
                    ({a.description})
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
