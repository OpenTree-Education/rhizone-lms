import React from 'react';
import { Box, Container, Grid, Button } from '@mui/material';

import CompetenciesCategoriesTable from './CompetenciesCategoriesTable';

const CompetenciesView = () => {
  return (
    <Container fixed>
      <h1>Competencies</h1>
      <Grid container justifyContent="center">
        <Grid item xs={12}>
          <Box textAlign="center">
            <Button variant="contained">Competency Reflections</Button>
          </Box>
          <Box>
            {/* The placeholder for the card with the raiting instruction */}
          </Box>
          <Box>
            <CompetenciesCategoriesTable />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CompetenciesView;
