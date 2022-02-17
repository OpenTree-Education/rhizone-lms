import { Box, Container, Grid } from '@mui/material';
import React, { useState } from 'react';

import Competency from './Competency';
import CreateOrUpdateCompetencyForm from './CreateOrUpdateCompetencyForm';
import { EntityId, Competency as APICompetency } from '../types/api';
import useApiData from '../helpers/useApiData';

const CompetenciesPage = () => {
  const [changedCompetencyIds, setChangedCompetencyIds] = useState<EntityId[]>(
    []
  );
  const { data: competencies, error } = useApiData<APICompetency[]>({
    deps: [changedCompetencyIds],
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
      <h1>Competencies</h1>
      <Grid container justifyContent="center">
        <Grid item xs={12} md={8}>
          <Box>
            <CreateOrUpdateCompetencyForm
              onCompetencyChanged={id =>
                setChangedCompetencyIds([...changedCompetencyIds, id])
              }
            />
          </Box>
          <Box my={6}>
            {competencies.length === 0 && <p>There are no competencies.</p>}
            {competencies.map(
              ({ id, label, description, principal_id: principalId }) => (
                <Competency
                  key={id}
                  id={id}
                  description={description}
                  label={label}
                  principalId={principalId}
                  onCompetencyChanged={id =>
                    setChangedCompetencyIds([...changedCompetencyIds, id])
                  }
                />
              )
            )}
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CompetenciesPage;
