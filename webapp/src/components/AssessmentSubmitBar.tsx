import React, { Dispatch, SetStateAction } from 'react';

import {
  Box,
  Button,
  Chip,
  Divider,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';
import { styled } from '@mui/system';

import { SavedAssessment, Question } from '../types/api.d';

const LinearProgressWithLabel = (
  numOfAnsweredQuestions: number,
  numOfTotalQuestions: number
) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress
          variant="determinate"
          value={Math.round(
            (numOfAnsweredQuestions * 100) / numOfTotalQuestions
          )}
        />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography
          variant="body2"
          color="text.secondary"
        >{`${numOfAnsweredQuestions}/${numOfTotalQuestions}`}</Typography>
      </Box>
    </Box>
  );
};

const StyledNumChip = styled(Chip)(() => ({
  borderRadius: '50%',
  width: '3em',
  height: '3em',
}));

interface AssessmentSubmitBarProps {
  assessment: SavedAssessment;
  numOfAnsweredQuestions: number;
  setShowSubmitDialog: Dispatch<SetStateAction<boolean>>;
  submitButtonDisabled: boolean;
}

const AssessmentSubmitBar = ({
  assessment,
  numOfAnsweredQuestions,
  setShowSubmitDialog,
  submitButtonDisabled,
}: AssessmentSubmitBarProps) => {
  if (
    !assessment.curriculum_assessment.questions ||
    !Array.isArray(assessment.curriculum_assessment.questions) ||
    !assessment.submission.responses
  ) {
    return null;
  }
  return (
    <>
      <List style={{ paddingLeft: 0 }}>
        <ListItem
          sx={{
            justifyContent: 'center',
            display: submitButtonDisabled ? 'none' : 'block',
          }}
        >
          <Button
            variant={`${
              numOfAnsweredQuestions ===
              assessment.curriculum_assessment.questions.length
                ? 'contained'
                : 'outlined'
            }`}
            size="medium"
            onClick={() => setShowSubmitDialog(true)}
            disabled={submitButtonDisabled}
          >
            Submit
          </Button>
        </ListItem>
        <Divider
          variant="middle"
          sx={{ display: submitButtonDisabled ? 'none' : 'block' }}
        />
        <ListItem>
          <ListItemText
            primary={LinearProgressWithLabel(
              numOfAnsweredQuestions,
              assessment.curriculum_assessment.questions.length
            )}
          />
        </ListItem>
        <ListItem>
          <Box sx={{ flexWrap: 'wrap', justifyContent: 'center' }}>
            {assessment.curriculum_assessment.questions.map(
              (question: Question) => (
                <StyledNumChip
                  sx={{ marginLeft: '1px', marginBottom: '3px' }}
                  label={question.sort_order}
                  key={question.id}
                  color={`${
                    assessment.submission.responses!.find(
                      a => a.question_id === question.id
                    )!.answer_id ||
                    assessment.submission.responses!.find(
                      a => a.question_id === question.id
                    )!.response_text
                      ? 'primary'
                      : 'default'
                  }`}
                />
              )
            )}
          </Box>
        </ListItem>
      </List>
    </>
  );
};

export default AssessmentSubmitBar;
