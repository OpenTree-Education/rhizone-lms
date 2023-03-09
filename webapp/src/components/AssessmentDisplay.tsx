import React from 'react';

import { Alert, AlertTitle, Card, Collapse, Grid } from '@mui/material';

import {
  exampleTestQuestionsList,
  Question,
  AssessmentSubmission,
} from '../assets/data';
import QuestionCard from './QuestionCard';

interface AssessmentsDisplayProps {
  submission: AssessmentSubmission;
  handleNewAnswer: (
    question: Question,
    chosenAnswerId?: number,
    responseText?: string
  ) => void;
}

const AssessmentsDisplay = ({
  submission,
  handleNewAnswer,
}: AssessmentsDisplayProps) => {
  return (
    <>
      <Grid item xs={1} />
      <Grid item xs={10}>
        <Card>
          <Collapse in={submission.state === 'Submitted'}>
            <Alert severity="success">
              <AlertTitle>Success</AlertTitle>
              The assessment has been submitted successfully!
            </Alert>
          </Collapse>{' '}
        </Card>
      </Grid>
      <Grid item xs={1} />
      {exampleTestQuestionsList.map(q => (
        <>
          <Grid item xs={1} />
          <Grid item xs={10}>
            <QuestionCard
              question={q}
              handleNewAnswer={handleNewAnswer}
              currentStatus={submission.state}
            />
          </Grid>
          <Grid item xs={1} />
        </>
      ))}
    </>
  );
};

export default AssessmentsDisplay;
