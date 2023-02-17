import React, { useState, useEffect } from 'react';
import { Container, Stack } from '@mui/material';

interface TabPanelProps {
  index?: number;
}

const AssessmentGrading = ({index}: TabPanelProps) => {

  return (
    <Container>
      {index}
    </Container>
  );
};

export default AssessmentGrading;
