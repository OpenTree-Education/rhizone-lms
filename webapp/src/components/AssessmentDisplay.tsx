import React from 'react';

import { Alert, AlertTitle, Card, Collapse, Grid } from '@mui/material';

import {Question, AssessmentResponse, Answer, AssessmentSubmission} from '../types/api.d'
import QuestionCard from './QuestionCard';

interface AssessmentsDisplayProps {
  submissionState: string;
  questioins: Question[];
  assessmentResponse:AssessmentResponse[]
  handleUpdatedResponse: (
    questionId: number,
    answerId?: number,
    response?: string
  ) => void;
}

const AssessmentsDisplay = ({
  submissionState,
  questioins,
  assessmentResponse,
  handleUpdatedResponse,
}: AssessmentsDisplayProps) => {
  return (
    <>
      <Grid item xs={1} /> 
      <Grid item xs={10}>
        <Card>
          <Collapse in={submissionState === 'Submitted'}>
            <Alert severity="success">
              <AlertTitle>Success</AlertTitle>
              The assessment has been submitted successfully!
            </Alert>
          </Collapse>{' '}
        </Card>
      </Grid>
      <Grid item xs={1} />
      {questioins.sort(q => q.sort_order).map(question => (
        <>
          <Grid item xs={1} />
          <Grid item xs={10}>
            <QuestionCard
              question={question}
              assessmentResponse={assessmentResponse.find(response => response.question_id === question.id)!}
              handleUpdatedResponse={handleUpdatedResponse}
              submissionState={submissionState}
            />
          </Grid>
          <Grid item xs={1} />
        </>
      ))}
    </>
  );
};

export default AssessmentsDisplay;
