import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DateTime } from 'luxon';

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
  Stack,
  CircularProgress,
} from '@mui/material';

import { AssessmentSubmission, SavedAssessment } from '../types/api';
import useApiData from '../helpers/useApiData';

import AssessmentMetadataBar from './AssessmentMetadataBar';
import AssessmentDisplay from './AssessmentDisplay';
import AssessmentSubmitBar from './AssessmentSubmitBar';

const AssessmentDetailPage = () => {
  const { assessmentId, submissionId } = useParams();
  const assessmentIdNumber = Number(assessmentId);
  const submissionIdNumber = Number(submissionId);

  const [apiPath, setApiPath] = useState<string>('');
  const [assessmentState, setAssessmentState] = useState<SavedAssessment>();
  const [numOfAnsweredQuestions, setNumOfAnsweredQuestions] = useState(0);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [endTime, setEndTime] = useState<DateTime | null>(null);
  const [secondsRemaining, setSecondsRemaining] = useState<number | null>(null);
  const [submissionDisabled, setSubmissionDisabled] = useState(false);
  const navigate = useNavigate();

  if (Number.isInteger(submissionIdNumber) && submissionIdNumber > 0) {
    if (apiPath !== `submissions/${submissionIdNumber}`) {
      setApiPath(`submissions/${submissionIdNumber}`);
    }
  } else if (submissionId === 'new') {
    if (Number.isInteger(assessmentIdNumber) && assessmentIdNumber > 0) {
      if (apiPath !== `program/${assessmentIdNumber}/submissions/new`) {
        setApiPath(`program/${assessmentIdNumber}/submissions/new`);
      }
    }
  }

  const {
    data: assessment,
    error: getError,
    isLoading: isLoadingGet,
  } = useApiData<SavedAssessment>({
    deps: [],
    method: 'GET',
    path: `/assessments/${apiPath}`,
    sendCredentials: true,
  });

  const {
    data: assessmentSubmission,
    error: putError,
    // isLoading: isLoadingPut,
  } = useApiData<AssessmentSubmission>({
    body: assessmentState?.submission,
    deps: [apiPath, assessmentState],
    method: 'PUT',
    path: `/assessments/${apiPath}`,
    sendCredentials: true,
    shouldFetch: () => {
      return (
        typeof assessmentState !== 'undefined' &&
        assessmentState.submission &&
        typeof assessmentState.submission !== 'undefined'
      );
    },
  });

  useEffect(() => {
    if (
      assessment &&
      assessment.submission &&
      typeof assessment.submission !== 'undefined'
    ) {
      if (submissionId === 'new') {
        navigate(
          `/assessments/${assessmentId}/submissions/${assessment.submission.id}`,
          { replace: true }
        );
      }
    }
  }, [assessment, assessmentId, navigate, submissionId]);

  useEffect(() => {
    if (
      assessment &&
      typeof assessment !== 'undefined' &&
      typeof assessmentState === 'undefined'
    ) {
      setAssessmentState(assessment);

      const openedDate = DateTime.fromISO(assessment.submission.opened_at);
      const dueDate = DateTime.fromISO(assessment.program_assessment.due_date);
      if (assessment.submission.submitted_at) {
        setEndTime(DateTime.fromISO(assessment.submission.submitted_at));
        setSecondsRemaining(null);
      } else if (
        assessment.curriculum_assessment.time_limit &&
        openedDate.plus({
          minutes: assessment.curriculum_assessment.time_limit,
        }) < dueDate
      ) {
        const newEndTime = openedDate.plus({
          minutes: assessment.curriculum_assessment.time_limit,
        });
        setSecondsRemaining(
          Math.floor(newEndTime.diff(DateTime.now()).as('seconds'))
        );
        setEndTime(newEndTime);
      } else {
        setSecondsRemaining(
          Math.floor(dueDate.diff(DateTime.now()).as('seconds'))
        );
        setEndTime(dueDate);
      }

      if (
        ['Submitted', 'Graded', 'Expired', 'Disabled'].includes(
          assessment.submission.assessment_submission_state
        )
      ) {
        setSubmissionDisabled(true);
      }
    }
  }, [assessment, assessmentState]);

  useEffect(() => {
    if (
      assessmentState &&
      assessmentSubmission &&
      typeof assessmentSubmission !== 'undefined'
    ) {
      if (
        DateTime.fromISO(assessmentSubmission.last_modified) >
        DateTime.fromISO(assessmentState.submission.last_modified)
      ) {
        const assessmentWithResponses = structuredClone(assessmentState);
        assessmentWithResponses.submission =
          structuredClone(assessmentSubmission);
        assessmentWithResponses.submission.last_modified =
          assessmentSubmission.last_modified;
        setAssessmentState(assessmentWithResponses);
      }
    }
  }, [assessmentSubmission, assessmentState]);

  // COUNTDOWN TIMER LOGIC -----------------------------------------------------

  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();

  const animate = (time: number) => {
    if (previousTimeRef.current !== undefined && endTime) {
      if (DateTime.now() < endTime) {
        const newSecondsRemaining = Math.floor(
          endTime.diff(DateTime.now()).as('seconds')
        );
        setSecondsRemaining(newSecondsRemaining);
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
      if (
        assessmentState &&
        !submissionDisabled &&
        secondsRemaining === 0 &&
        assessmentState.submission.assessment_submission_state === 'In Progress'
      ) {
        const completedAssessment = structuredClone(assessmentState);
        completedAssessment.submission.assessment_submission_state = 'Expired';
        completedAssessment.submission.last_modified = DateTime.now().toISO();
        setAssessmentState(completedAssessment);
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
        typeof assessmentState !== 'undefined' &&
        typeof assessmentState.submission.responses !== 'undefined'
      )
    ) {
      return;
    }

    const [responseQuestion] = assessmentState.curriculum_assessment.questions!.filter(question => question.id === questionId)!;

    const assessmentWithUpdatedResponses = structuredClone(assessmentState);

    if (
      typeof assessmentWithUpdatedResponses.submission.responses === 'undefined'
    ) {
      return;
    }

    if (responseQuestion.question_type === 'single choice') {
      assessmentWithUpdatedResponses.submission.responses.find(
        response => response.question_id === questionId
      )!.answer_id = answerId;
    } else if (responseQuestion.question_type === 'free response') {
      assessmentWithUpdatedResponses.submission.responses.find(
        response => response.question_id === questionId
      )!.response_text = responseText;
    }

    assessmentWithUpdatedResponses.submission.last_modified =
      DateTime.now().toISO();

    setNumOfAnsweredQuestions(
      assessmentWithUpdatedResponses.submission.responses.filter(
        response =>
          Number.isInteger(response.answer_id) ||
          (typeof response.response_text !== 'undefined' &&
            response.response_text &&
            response.response_text !== '')
      ).length
    );

    if (submissionId === 'new') {
      setApiPath(`submissions/${assessmentWithUpdatedResponses.submission.id}`);
    }

    setAssessmentState(assessmentWithUpdatedResponses);
  };

  // Behavior to handle what should happen when we press the submit button
  const handleSubmit = (event?: React.SyntheticEvent) => {
    if (event) {
      event.preventDefault();
    }
    if (
      !(assessmentState && typeof assessmentState.submission !== 'undefined')
    ) {
      return;
    }
    setShowSubmitDialog(false);
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
    const completedAssessment = structuredClone(assessmentState);
    completedAssessment.submission.assessment_submission_state = 'Submitted';
    completedAssessment.submission.submitted_at = DateTime.now().toISO();
    completedAssessment.submission.last_modified = DateTime.now().toISO();
    setSubmissionDisabled(true);
    setAssessmentState(completedAssessment);

    if (putError) {
      completedAssessment.submission.assessment_submission_state =
        'In Progress';
      completedAssessment.submission.submitted_at = undefined;
      setAssessmentState(completedAssessment);
      setSubmissionDisabled(false);
    }
  };

  if (
    !Number.isInteger(assessmentIdNumber) ||
    (!Number.isInteger(submissionIdNumber) && submissionId !== 'new') ||
    assessmentIdNumber < 1 ||
    (submissionId !== 'new' && submissionIdNumber < 1)
  ) {
    return (
      <Container>
        <Alert severity="error">
          <AlertTitle>Sorry!</AlertTitle>
          The assessment ID and submission ID must be valid.
        </Alert>
        <Button href={'/assessments'} variant="outlined">
          &laquo; Assessments List
        </Button>
      </Container>
    );
  }

  if (
    (isLoadingGet && typeof assessmentState === 'undefined') ||
    (typeof assessment !== 'undefined' &&
      typeof assessmentState === 'undefined')
  ) {
    return (
      <Stack
        alignItems="center"
        justifyContent="center"
        sx={{ height: '40em' }}
      >
        <CircularProgress size={100} disableShrink />
      </Stack>
    );
  }

  if (
    getError ||
    !assessment ||
    typeof assessmentState === 'undefined' ||
    typeof assessmentState.curriculum_assessment.questions === 'undefined' ||
    typeof assessmentState.submission.responses === 'undefined' ||
    assessmentState.curriculum_assessment.questions.length !==
      assessmentState.submission.responses.length ||
    !endTime
  ) {
    return (
      <Container>
        <Alert severity="error">
          <AlertTitle>Error Encountered</AlertTitle>
          <p>There was a problem loading this assessment or submission.</p>
        </Alert>
        <Button href={'/assessments'} variant="outlined">
          &laquo; Assessments List
        </Button>
      </Container>
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
                assessment={assessmentState}
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
                assessment={assessmentState}
                handleUpdatedResponse={handleUpdatedResponse}
                questionsDisabled={submissionDisabled}
              />
            </Grid>

            <Grid item xs={12} md={1.5}>
              <AssessmentSubmitBar
                assessment={assessmentState}
                numOfAnsweredQuestions={numOfAnsweredQuestions}
                setShowSubmitDialog={setShowSubmitDialog}
                submitButtonDisabled={submissionDisabled}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Dialog
        open={showSubmitDialog}
        onClose={() => setShowSubmitDialog(false)}
      >
        <DialogTitle>
          Are you sure you would like to submit this assessment?
        </DialogTitle>
        {numOfAnsweredQuestions <
          assessmentState.curriculum_assessment.questions.length && (
          <DialogContent>
            <DialogContentText>
              {`You have only responded to ${numOfAnsweredQuestions} out of ` +
                assessmentState.curriculum_assessment.questions.length +
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
