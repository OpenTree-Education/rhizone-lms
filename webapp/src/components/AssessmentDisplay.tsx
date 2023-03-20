import React, { useRef, useEffect } from 'react';

import { Alert, AlertTitle, Card, Grid } from '@mui/material';

import { OpenedAssessment } from '../types/api.d';
import AssessmentQuestionCard from './AssessmentQuestionCard';

interface AssessmentsDisplayProps {
  assessment: OpenedAssessment;
  handleUpdatedResponse: (
    questionId: number,
    answerId?: number,
    response?: string
  ) => void;
  questionsDisabled: boolean;
}

const AssessmentDisplay = ({
  assessment,
  handleUpdatedResponse,
  questionsDisabled,
}: AssessmentsDisplayProps) => {
  const successMessageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      assessment.submission.assessment_submission_state === 'Submitted' &&
      successMessageRef.current
    ) {
      successMessageRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [assessment.submission.assessment_submission_state]);

  if (typeof assessment.curriculum_assessment.questions === 'undefined') {
    return (
      <Card
        sx={{
          margin: '1em 2em',
        }}
      >
        <Alert severity="error">
          <AlertTitle>Sorry!</AlertTitle>
          This assessment contains no questions.
        </Alert>
      </Card>
    );
  }

  return (
    <Grid container>
      <div ref={successMessageRef}></div>
      <Grid
        item
        xs={10}
        sx={{
          margin: '1em auto',
          display:
            assessment.submission.assessment_submission_state === 'Submitted'
              ? 'block'
              : 'none',
        }}
      >
        <Card>
          <Alert severity="success">
            <AlertTitle>Success</AlertTitle>
            The assessment has been submitted successfully!
          </Alert>
        </Card>
      </Grid>
      {assessment.curriculum_assessment.questions
        .sort(question => question.sort_order)
        .map(question => (
          <Grid item key={question.id} xs={10} sx={{ margin: '1em auto' }}>
            <AssessmentQuestionCard
              assessmentQuestion={question}
              submissionResponse={
                assessment.submission.responses!.filter(
                  response => response.question_id === question.id
                )[0]
              }
              handleUpdatedResponse={handleUpdatedResponse}
              disabled={questionsDisabled}
            />
          </Grid>
        ))}
    </Grid>
  );
};

export default AssessmentDisplay;
