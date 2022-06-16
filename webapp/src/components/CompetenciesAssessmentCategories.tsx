import React from 'react';
import { Container, Grid, Button } from '@mui/material';
import useApiData from '../helpers/useApiData';
import { CategoryWithCompetencies } from '../types/api';

const CompetenciesAssessmentCategories = () => {
  const { data: categories } = useApiData<CategoryWithCompetencies[]>({
    path: '/competencies/opentree',
    sendCredentials: true,
  });

  if (!categories) {
    return null;
  }

  return (
    <Container fixed>
      <h1>Competencies Assessments</h1>
      <Grid container justifyContent="center">
        <Grid item xs={12} md={8} textAlign="center">
          {categories.map(category => (
            <Button
              key={category.id}
              variant="outlined"
              component="a"
              href={`/competencies-assessment/${category.id}`}
              sx={{ m: 1 }}
            >
              {category.label}
            </Button>
          ))}
        </Grid>
      </Grid>
    </Container>
  );
};

export default CompetenciesAssessmentCategories;
