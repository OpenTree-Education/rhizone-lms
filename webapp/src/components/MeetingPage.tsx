import React from 'react';
import { useParams } from 'react-router-dom';

import Meeting from './Meeting';

const MeetingPage = () => {
  const { id } = useParams();

  return <Meeting meetingId={id} />;
};

export default MeetingPage;
