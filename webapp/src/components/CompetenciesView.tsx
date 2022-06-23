import React from 'react';
import { Box, Container, Grid, Button } from '@mui/material';

const CompetenciesView = () => {
  return (
    <Container fixed>
      <h1>Competencies</h1>
      <Grid container justifyContent="center">
        <Grid item xs={12} md={10}>
          <Box textAlign="center">
            <Button variant="contained">Competency Reflections</Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CompetenciesView;
