import React, { Dispatch, SetStateAction } from 'react';

import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';
import { styled } from '@mui/system';

import { Question, AssessmentChosenAnswer } from '../assets/data';

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

const StyledNumChip = styled(Chip)(() => ({
  borderRadius: '50%',
  width: '3em',
  height: '3em',
}));

interface AssessmentSubmitBarProps {
  submissionState: string;
  assessmentQuestions: Question[];
  assessmentAnswers: AssessmentChosenAnswer[];
  numOfAnsweredQuestion: number;
  showSubmitDialog: boolean;
  setShowSubmitDialog: Dispatch<SetStateAction<boolean>>;
  handleSubmit: () => void;
}

const AssessmentSubmitBar = ({
  submissionState,
  assessmentQuestions,
  assessmentAnswers,
  numOfAnsweredQuestion,
  showSubmitDialog,
  setShowSubmitDialog,
  handleSubmit,
}: AssessmentSubmitBarProps) => {
  const handleOpenSubmitDialog = () => {
    setShowSubmitDialog(true);
  };

  const handleCloseSubmitDialog = () => {
    setShowSubmitDialog(false);
  };

  return (
    <>
      <List style={{ paddingLeft: 0 }}>
        <ListItem sx={{ justifyContent: 'center' }}>
          <Button
            variant={`${
              numOfAnsweredQuestion === assessmentQuestions.length
                ? 'contained'
                : 'outlined'
            }`}
            size="medium"
            onClick={handleOpenSubmitDialog}
            disabled={submissionState !== 'Opened'}
          >
            Submit
          </Button>
        </ListItem>
        <Divider variant="middle" />
        <ListItem>
          <ListItemText
            primary={LinearProgressWithLabel(
              numOfAnsweredQuestion,
              assessmentQuestions.length
            )}
          />
        </ListItem>
        <ListItem>
          <Box sx={{ flexWrap: 'wrap', justifyContent: 'center' }}>
            {assessmentQuestions.map(a => (
              <StyledNumChip
                sx={{ marginLeft: '1px', marginBottom: '3px' }}
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
      </List>
      <Dialog open={showSubmitDialog} onClose={handleCloseSubmitDialog}>
        <DialogTitle>
          Are you sure you would like to submit this assessmnet?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            You have filled {numOfAnsweredQuestion} out of{' '}
            {assessmentQuestions.length}.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSubmitDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AssessmentSubmitBar;
