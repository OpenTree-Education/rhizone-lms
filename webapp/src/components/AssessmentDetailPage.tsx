import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';

import {
  Alert,
  AlertTitle,
  Button,
  Container,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

import { assessmentDetailPageExampleData } from '../assets/data';
import { AssessmentResponse, SavedAssessment } from '../types/api';

import AssessmentMetadataBar from './AssessmentMetadataBar';
import AssessmentDisplay from './AssessmentDisplay';
import AssessmentSubmitBar from './AssessmentSubmitBar';
import useApiData from '../helpers/useApiData';

const AssessmentDetailPage = () => {
  const { assessmentId, submissionId } = useParams();
  const assessmentIdNumber = Number(assessmentId);
  const submissionIdNumber = Number(submissionId);
  const path = Number.isInteger(submissionIdNumber)
    ? `/assessments/submissions/${submissionIdNumber}`
    : `/assessments/program/${assessmentIdNumber}/submissions/new`;
  const {
    data: fetchAssessment,
    error,
    isLoading,
  } = useApiData<SavedAssessment>({
    deps: [submissionIdNumber],
    path: path,
    sendCredentials: true,
  });

  // Previously used to find the assessment details, but that will be covered by
  // the call to the backend:

  // const assessment = assessmentList.find(
  //   assessment => assessment.id === assessmentIdNumber
  // );

  const [assessment, setAssessment] = useState<SavedAssessment>(
    fetchAssessment!
  );
  const [numOfAnsweredQuestions, setNumOfAnsweredQuestions] = useState(0);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [secondsRemaining, setSecondsRemaining] = useState<number | null>(null);
  const [submissionDisabled, setSubmissionDisabled] = useState(false);

  // First, let's load the example data. This will be replaced by the backend
  // API call in a future ticket.
  useEffect(() => {
    // setAssessment(assessmentDetailPageExampleData);
    // if(fetchAssessment){
    //   setAssessment(fetchAssessment);
    //   }
  }, []);

  useEffect(() => {
    // By default, the submission won't have responses when first opened; or,
    // let's also cover the state where we do have some responses but not all of
    // them for some reason.
    if (
      assessment &&
      assessment.curriculum_assessment &&
      typeof assessment.curriculum_assessment.questions !== 'undefined' &&
      assessment.submission &&
      (typeof assessment.submission.responses === 'undefined' ||
        assessment.submission.responses.length !==
          assessment.curriculum_assessment.questions.length)
    ) {
      const assessmentWithResponses = structuredClone(assessment);
      assessmentWithResponses.submission.responses =
        assessment.curriculum_assessment.questions.map(question => {
          return {
            assessment_id: assessment.program_assessment.id,
            submission_id: assessment.submission.id,
            question_id: question.id,
          } as AssessmentResponse;
        });
      // TODO: handle the case where we have some but not all responses
      setAssessment(assessmentWithResponses);
    }

    // Now that we have assessment data (hopefully), we can set the end time and
    // the number of seconds remaining.
    if (assessment) {
      const openedDate = new Date(assessment.submission.opened_at);
      const dueDate = new Date(assessment.program_assessment.due_date + 'Z');
      if (assessment.submission.submitted_at) {
        setEndTime(new Date(assessment.submission.submitted_at + 'Z'));
        setSecondsRemaining(null);
      } else if (
        assessment.curriculum_assessment.time_limit &&
        openedDate.getTime() +
          assessment.curriculum_assessment.time_limit * 60 * 1000 <
          dueDate.getTime()
      ) {
        const newEndTime = new Date(
          openedDate.getTime() +
            assessment.curriculum_assessment.time_limit * 60 * 1000
        );
        setSecondsRemaining(
          Math.floor((newEndTime.getTime() - new Date().getTime()) / 1000)
        );
        setEndTime(newEndTime);
      } else {
        setSecondsRemaining(
          Math.floor((dueDate.getTime() - new Date().getTime()) / 1000)
        );
        setEndTime(dueDate);
      }
    }

    // And now that we have submission data, we can disable form input depending
    // on the state of the submission.
    if (assessment && assessment.submission) {
      if (
        ['Submitted', 'Graded', 'Expired', 'Disabled'].includes(
          assessment.submission.assessment_submission_state
        )
      ) {
        setSubmissionDisabled(true);
      }
    }
  }, [assessment]);

  // COUNTDOWN TIMER LOGIC -----------------------------------------------------

  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();

  const animate = (time: number) => {
    if (previousTimeRef.current !== undefined && endTime) {
      if (new Date() < endTime) {
        setSecondsRemaining(
          Math.floor((endTime.getTime() - new Date().getTime()) / 1000)
        );
      } else {
        setSecondsRemaining(0);
      }
    }
    previousTimeRef.current = time;
    if (
      secondsRemaining !== null &&
      secondsRemaining > 0 &&
      !submissionDisabled
    ) {
      requestRef.current = requestAnimationFrame(animate);
    } else {
      if (assessment && !submissionDisabled && secondsRemaining === 0) {
        const completedAssessment = structuredClone(assessment);
        completedAssessment!.submission.assessment_submission_state = 'Expired';
        setAssessment(completedAssessment);
      }
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    }
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  });

  // END COUNTDOWN TIMER LOGIC -------------------------------------------------

  // Behavior to execute when responding to a question in the assessment
  const handleUpdatedResponse = (
    questionId: number,
    answerId?: number,
    responseText?: string
  ) => {
    if (
      !(
        assessment &&
        assessment.submission &&
        typeof assessment.submission.responses !== 'undefined'
      )
    ) {
      return;
    }

    const assessmentWithUpdatedResponses = structuredClone(assessment);

    if (answerId) {
      assessmentWithUpdatedResponses.submission.responses!.find(
        response => response.question_id === questionId
      )!.answer_id = answerId;
      setAssessment(assessmentWithUpdatedResponses);
    }

    assessmentWithUpdatedResponses.submission.responses!.find(
      response => response.question_id === questionId
    )!.response_text = responseText;
    setAssessment(assessmentWithUpdatedResponses);

    setNumOfAnsweredQuestions(
      assessmentWithUpdatedResponses.submission.responses!.filter(
        a =>
          Number.isInteger(a.answer_id) ||
          typeof a.response_text !== 'undefined'
      ).length
    );
  };

  // Behavior to handle what should happen when we press the submit button
  const handleSubmit = (event?: React.SyntheticEvent) => {
    if (event) {
      event.preventDefault();
    }
    if (!(assessment && typeof assessment.submission !== 'undefined')) {
      return;
    }
    setShowSubmitDialog(false);
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
    const completedAssessment = structuredClone(assessment);
    completedAssessment.submission.assessment_submission_state = 'Submitted';

    // Replace the following lines when switching out with the API call:
    const submissionTime = new Date().getTime() - 7 * 60 * 60 * 1000;
    completedAssessment.submission.submitted_at = new Date(submissionTime)
      .toISOString()
      .slice(0, 19)
      .replace('T', ' ');
    setAssessment(completedAssessment);
  };

  if (
    !Number.isInteger(assessmentIdNumber) ||
    //!Number.isInteger(submissionIdNumber) ||
    assessmentIdNumber < 1 //||
    //submissionIdNumber < 1
  ) {
    return (
      <Alert severity="error">
        <AlertTitle>Sorry!</AlertTitle>
        The assessment ID and submission ID must be valid.
      </Alert>
    );
  }

  if (
    !assessment ||
    (assessment && typeof assessment.curriculum_assessment === 'undefined') ||
    (assessment &&
      typeof assessment.curriculum_assessment.questions === 'undefined') ||
    (Array.isArray(assessment.curriculum_assessment.questions) &&
      assessment.curriculum_assessment.questions.length === 0) ||
    typeof assessment.submission.responses === 'undefined' ||
    (Array.isArray(assessment.submission.responses) &&
      assessment.submission.responses.length === 0) ||
    !endTime
  ) {
    return (
      <Alert severity="error">
        <AlertTitle>Sorry!</AlertTitle>
        <p>There was a problem loading this assessment or submission.</p>
      </Alert>
    );
  }

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <h1>{assessment.curriculum_assessment.title}</h1>
        </Grid>

        <Grid item xs={12} md={12}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <AssessmentMetadataBar
                assessment={assessment}
                secondsRemaining={secondsRemaining}
                endTime={endTime}
                submissionDisabled={submissionDisabled}
              />
            </Grid>

            <Grid
              id="assessment_display"
              item
              xs={12}
              md={7.5}
              sx={{
                height: '75vh',
                overflowX: 'auto',
                overflowY: 'scroll',
                backgroundColor: '#fafafa',
                boxShadow: '0 0 0.25em rgba(0,0,0,0.35)',
              }}
            >
              <AssessmentDisplay
                assessment={assessment}
                handleUpdatedResponse={handleUpdatedResponse}
                questionsDisabled={submissionDisabled}
              />
            </Grid>

            <Grid item xs={12} md={1.5}>
              <AssessmentSubmitBar
                assessment={assessment}
                numOfAnsweredQuestions={numOfAnsweredQuestions}
                setShowSubmitDialog={setShowSubmitDialog}
                submitButtonDisabled={submissionDisabled}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      )
      <Dialog
        open={showSubmitDialog}
        onClose={() => setShowSubmitDialog(false)}
      >
        <DialogTitle>
          Are you sure you would like to submit this assessment?
        </DialogTitle>
        {numOfAnsweredQuestions <
          assessment.curriculum_assessment.questions!.length && (
          <DialogContent>
            <DialogContentText>
              {`You have only responded to ${numOfAnsweredQuestions} out of ` +
                assessment.curriculum_assessment.questions!.length +
                ' questions.'}
            </DialogContentText>
          </DialogContent>
        )}
        <DialogActions>
          <Button onClick={() => setShowSubmitDialog(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AssessmentDetailPage;
