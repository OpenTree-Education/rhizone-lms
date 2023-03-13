import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

import { Alert, AlertTitle, Container, Grid } from '@mui/material';

import {
  assessmentList,
  exampleTestQuestionsList,
} from '../assets/data';
import {Question, AssessmentResponse, Answer, AssessmentSubmission} from '../types/api.d'
import AssessmentMetadataBar from './AssessmentMetadataBar';
import AssessmentDisplay from './AssessmentDisplay';
import AssessmentSubmitBar from './AssessmentSubmitBar';

const AssessmentDetailPage = () => {
  const { assessmentId, submissionId } = useParams(); 
  const assessmentIdNumber = Number(assessmentId); 
  const submissionIdNumber = Number(submissionId); 
  if (!Number.isInteger(assessmentIdNumber) || !Number.isInteger(submissionIdNumber) || assessmentIdNumber < 0 || submissionIdNumber<0) {
    return (
      <Alert severity="error">
        <AlertTitle>Sorry!</AlertTitle>
        The assessment and submission id must be valid.
      </Alert>
    );
  }

  const assessment = assessmentList.find(
    assessment => assessment.id === assessmentIdNumber
  );

  // const assessmentResponses: AssessmentResponse[] = exampleTestQuestionsList.map((question) => {
  //    return { assessment_id: assessmentIdNumber, submission_id: submissionIdNumber, question_id: question.id }
  //    });
  // let assessmentAnswersArr = new Array<AssessmentResponse>(
  //   exampleTestQuestionsList.length
  // );
  // for (var i = 0; i < exampleTestQuestionsList.length; i++) {
  //   assessmentAnswersArr[i] = {
  //     chosenAnswerId: undefined,
  //     responseText: undefined,
  //   };
  // }
  const [assessmentResponse, setAssessmentResponse] =
    useState<AssessmentResponse[]>(exampleTestQuestionsList.map((question) => {
      return { assessment_id: assessmentIdNumber, submission_id: submissionIdNumber, question_id: question.id! }
      }));
  const [numOfAnsweredQuestion, setNumOfAnsweredQuestion] = useState(0);

  const handleUpdatedResponse = (
    questionId: number,
    answerId?: number,
    response?: string
  ) => {
    if(answerId){
      assessmentResponse.find(q => q.question_id ===questionId)!.answer_id = answerId;
    }

    if(response){
      assessmentResponse.find(q => q.question_id ===questionId)!.response = response;
    }

    setAssessmentResponse(assessmentResponse);
    setNumOfAnsweredQuestion(
      assessmentResponse.filter(a => a.answer_id || a.response).length
    );
  };

  const [assessmentQuestions] = useState(exampleTestQuestionsList);

  const [submission] = React.useState<AssessmentSubmission>(
      {
    id: 2,
    assessment_id: 3,
    principal_id:1,
    assessment_submission_state: 'Opened',
    opened_at: new Date().getTime().toString(),
  });

  const [showSubmitDialog, setShowSubmitDialog] = React.useState(false);

  const handleSubmit = (event?: React.SyntheticEvent) => {
    if (event) {
      event.preventDefault();
    }
    setShowSubmitDialog(false);
    submission.assessment_submission_state = 'Submitted';
    submission.submitted_at = "631152000000";
    //TODO: send request to submit the assessment
    document.querySelector('#assessment_display')!.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!assessment || !submission) {
    return (
      <Alert severity="error">
        <AlertTitle>Sorry!</AlertTitle>
        There is a problem loading this assessment or submission.
      </Alert>
    );
  }

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <h1>{assessment.title}</h1>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <AssessmentMetadataBar
              assessment={assessment}
              submission={submission}
            />
          </Grid>
          <Grid
            id="assessment_display"
            container
            xs={12}
            md={7.5}
            spacing={2}
            sx={{
              height: '75vh',
              overflow: 'auto',
              marginTop: 0,
              marginLeft: 0,
              paddingBottom: '20px',
              backgroundColor: '#fafafa',
              border: '1px solid #bbb',
            }}
          >
            <AssessmentDisplay
            questioins={exampleTestQuestionsList}
              submissionState={submission.assessment_submission_state}
              assessmentResponse={assessmentResponse}
              handleUpdatedResponse={handleUpdatedResponse}
            />
          </Grid>
          <Grid item xs={12} md={1.5}>
            <AssessmentSubmitBar
              submissionState={submission.assessment_submission_state}
              assessmentQuestions={assessmentQuestions}
              assessmentAnswers={assessmentAnswers}
              numOfAnsweredQuestion={numOfAnsweredQuestion}
              showSubmitDialog={showSubmitDialog}
              setShowSubmitDialog={setShowSubmitDialog}
              handleSubmit={handleSubmit}
            />
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AssessmentDetailPage;
