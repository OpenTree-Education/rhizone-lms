import React, { useState, useEffect } from 'react';
import { Container, Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import AssessmentReviewPublish from './AssessmentReviewPublish';
import AssessmentQuestionForm from './AssessmentQuestionForm';
import AssessmentDetailsForm from './AssessmentDetailsForm';

function getStepContent(step: number) {
  switch (step) {
    case 0:
      return <AssessmentDetailsForm />
    case 1:
      return <AssessmentQuestionForm />;
    case 2:
      return <AssessmentReviewPublish />;
    default:
      throw new Error('Unknown step');
  }
}
const AssessmentAddNew = () => {
const steps = ['Details', 'Add Questions', 'Review'];
const [activeStep, setActiveStep] = React.useState(0);

const handleNext = () => {
  setActiveStep(activeStep + 1);
};

const handleBack = () => {
  setActiveStep(activeStep - 1);
};
const handleReset = () => {
  setActiveStep(0);
};

  return (
      <Container maxWidth="md" sx={{ mb: 4 }}>
        <Paper elevation={0} sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
          <Typography variant="h5" align="center">
            Add a New Assessment
          </Typography>
          <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {activeStep === steps.length ? (
            <React.Fragment>
              <Typography variant="h5" gutterBottom>
                The assessment had been published successfully!
              </Typography>
              <Button onClick={handleReset} variant="contained"  sx={{ mt: 3, ml: 1 }}>
                    Add another one
                  </Button>
            </React.Fragment>
          ) : (
            <React.Fragment>
              {getStepContent(activeStep)}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                {activeStep !== 0 && (
                  <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                    Back
                  </Button>
                )}
                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{ mt: 3, ml: 1 }}
                >
                  {activeStep === steps.length - 1 ? 'Publish' : 'Next'}
                </Button>
              </Box>
            </React.Fragment>
          )}
        </Paper>
      </Container>
  );
};

export default AssessmentAddNew;
