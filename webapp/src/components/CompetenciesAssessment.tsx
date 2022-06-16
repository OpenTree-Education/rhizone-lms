import React, { useState, FormEventHandler } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Button,
  Container,
  Card,
  CardContent,
  Alert,
  Snackbar,
  Grid,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import useApiData from '../helpers/useApiData';
import { EntityId, Questionnaire as APIQuestionnaire } from '../types/api';
import Questionnaire from './Questionnaire';

const CompetenciesAssessment = () => {
  const { categoryId } = useParams();
  const [questionnaireId, setQuestionnaireId] = useState(null);
  const [selectedOptionIds, setSelectedOptionIds] = useState(
    new Map<EntityId, EntityId>()
  );
  const [isSavingReflection, setIsSavingReflection] = useState(false);
  const [saveReflectionError, setSaveReflectionError] = useState(null);
  const [isSuccessMessageVisible, setIsSuccessMessageVisible] = useState(false);
  let navigate = useNavigate();

  async function onClickBeginAssessment() {
    const response = await fetch(
      `${process.env.REACT_APP_API_ORIGIN}/questionnaires/competencies/${categoryId}`,
      {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      }
    );
    const { data } = await response.json();
    setQuestionnaireId(data.questionnaireId);
  }

  const onSubmit: FormEventHandler = event => {
    event.preventDefault();
    setIsSavingReflection(true);
    fetch(`${process.env.REACT_APP_API_ORIGIN}/reflections`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        selected_option_ids: Array.from(selectedOptionIds.values()),
      }),
    })
      .then(res => res.json())
      .then(({ data, error }) => {
        setIsSavingReflection(false);
        if (error) {
          setSaveReflectionError(error);
        }
        if (data) {
          setIsSuccessMessageVisible(true);
          setSelectedOptionIds(new Map());
          navigate('/competencies-view');
        }
      })
      .catch(error => {
        setIsSavingReflection(false);
        setSaveReflectionError(error);
      });
  };

  if (questionnaireId === null) {
    return (
      <Container fixed>
        <Grid container justifyContent="center">
          <Grid item textAlign="center">
            <Button
              variant="outlined"
              component="button"
              onClick={onClickBeginAssessment}
            >
              Begin Assessment
            </Button>
          </Grid>
        </Grid>
      </Container>
    );
  } else {
    return (
      <Container fixed>
        <Grid container justifyContent="center">
          <Grid item>
            <form onSubmit={onSubmit}>
              <Card>
                <CardContent>
                  <Questionnaire
                    onChange={setSelectedOptionIds}
                    questionnaireId={questionnaireId}
                    selectedOptionIds={selectedOptionIds}
                  />
                </CardContent>
                {saveReflectionError && (
                  <CardContent>
                    <Alert
                      onClose={() => setSaveReflectionError(null)}
                      severity="error"
                    >
                      The reflection was not saved.
                    </Alert>
                  </CardContent>
                )}
                <CardContent>
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    loading={isSavingReflection}
                  >
                    Save reflection
                  </LoadingButton>
                </CardContent>
              </Card>
              {isSuccessMessageVisible && (
                <Snackbar
                  open={true}
                  autoHideDuration={6000}
                  onClose={() => setIsSuccessMessageVisible(false)}
                >
                  <Alert
                    onClose={() => setIsSuccessMessageVisible(false)}
                    severity="success"
                    sx={{ width: '100%' }}
                  >
                    The reflection was saved.
                  </Alert>
                </Snackbar>
              )}
            </form>
          </Grid>
        </Grid>
      </Container>
    );
  }
};

export default CompetenciesAssessment;
