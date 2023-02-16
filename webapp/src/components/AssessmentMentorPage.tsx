import React, { useState, useEffect } from 'react';
import { Container, Stack } from '@mui/material';
import Button from '@mui/material/Button';

const AssessmentMentorPage = () => {
  return (
    <Container>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', md: 'center' }}
      >
        <h1>Assessment Management</h1>
        <Button variant="outlined" href="/assessment" >
          Mentee mode
        </Button>        
      </Stack>
    </Container>
  );
};

export default AssessmentMentorPage;
