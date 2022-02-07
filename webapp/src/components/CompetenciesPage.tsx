import { Container } from '@mui/material';
import React from 'react';

import Competency from './Competency';
import { Competency as APICompetency } from '../types/api';
import useApiData from '../helpers/useApiData';

const CompetenciesPage = () => {
  const { data: competencies, error } = useApiData<APICompetency[]>({
    deps: [],
    path: `/competencies`,
    sendCredentials: true,
  });
  if (error) {
    return <p>There was an error loading the competencies.</p>;
  }
  if (!competencies) {
    return null;
  }
  return (
    <Container fixed>
      {competencies.length === 0 && <p>There are no competencies.</p>}
      {competencies.map(({ id, label, description }) => (
        <Competency key={id} description={description} label={label} />
      ))}
    </Container>
  );
};

export default CompetenciesPage;
