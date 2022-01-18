import { Container } from '@mui/material';
import React from 'react';
import { useParams } from 'react-router-dom';

import Meeting from './Meeting';

const MeetingPage = () => {
  const { id } = useParams();
  return (
    <Container fixed>
      <Meeting meetingId={id} />
    </Container>
  );
};

export default MeetingPage;
