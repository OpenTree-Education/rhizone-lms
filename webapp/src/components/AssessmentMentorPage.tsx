import React, { useState, useEffect } from 'react';
import { Container, Stack } from '@mui/material';
import Link from '@mui/material/Link';

const AssessmentMentorPage = () => {
  return (
    <Container>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', md: 'center' }}
      >
        <h1>Assessment Management</h1> 
        <Link href="/assessment">Switch to Mentee mode</Link>
      </Stack>
    </Container>
  );
};

export default AssessmentMentorPage;
