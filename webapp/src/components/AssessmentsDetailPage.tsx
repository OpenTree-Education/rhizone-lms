import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

import { Alert, AlertTitle, Button, Container, Grid } from '@mui/material';

import {
  assessmentList,
  exampleTestQuestionsList,
  exampleTestSubmissionList,
  Question,
  AssessmentChosenAnswer,
} from '../assets/data';
import AssessmentsMetadataBar from './AssessmentsMetadataBar';
import AssessmentsDisplay from './AssessmentsDisplay';
import AssessmentsSubmitBar from './AssessmentsSubmitBar';

const AssessmentsDetailPage = () => {
  const id = useParams();
  //TODO: fetch the assessment by id
  const assessment = assessmentList.find(
    assessment => assessment.id === parseInt(id.id ? id.id : '')
  );

  let assessmentAnswersArr = new Array<AssessmentChosenAnswer>(
    exampleTestQuestionsList.length
  );
  for (var i = 0; i < exampleTestQuestionsList.length; i++) {
    assessmentAnswersArr[i] = {
      chosenAnswerId: undefined,
      responseText: undefined,
    };
  }
  const [assessmentAnswers, setAssessmentAnswers] =
    useState(assessmentAnswersArr);
  const [numOfAnsweredQuestion, setNumOfAnsweredQuestion] = useState(0);

  const handleNewAnswer = (
    question: Question,
    chosenAnswerId?: number,
    responseText?: string
  ) => {
    assessmentAnswers[question.sortOrder - 1].chosenAnswerId = chosenAnswerId;
    assessmentAnswers[question.sortOrder - 1].responseText = responseText;
    setAssessmentAnswers(assessmentAnswers);
    setNumOfAnsweredQuestion(
      assessmentAnswers.filter(a => a.chosenAnswerId || a.responseText).length
    );
  };

  const [assessmentQuestions] = useState(exampleTestQuestionsList);

  //TODO: fetch previous or request a new submission
  const [submission] = React.useState(
    exampleTestSubmissionList[1]
  );

  const [showSubmitDialog, setShowSubmitDialog] = React.useState(false);

  const handleSubmit = (event?: React.SyntheticEvent) => {
    if (event) {
      event.preventDefault();
    }
    setShowSubmitDialog(false);
    submission.state = 'Submitted';
    submission.submitAt = new Date().getTime();
    //TODO: send request to submit the assessment
    document.querySelector('#assessment_display')!.scrollTo(0, 0);
  };

  if (!assessment || !submission) {
    return (
      <Alert severity="error">
        <AlertTitle>Sorry!</AlertTitle>
        There is a problem loading this assessment or submisssion.
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
            <AssessmentsMetadataBar
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
            <AssessmentsDisplay
              submission={submission}
              handleNewAnswer={handleNewAnswer}
            />
          </Grid>
          <Grid item xs={12} md={1.5}>
            <AssessmentsSubmitBar
              submissionState={submission.state}
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

export default AssessmentsDetailPage;
