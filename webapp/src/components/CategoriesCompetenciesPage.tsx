import { Box, Grid, Typography } from '@mui/material';
import React, { useState } from 'react';
import useApiData from '../helpers/useApiData';
import { Competency } from '../types/api';
import CompetencyCard from './CompetencyCard';

interface CompetencyData {
  competencies: Competency[],
  description: string,
  id: number,
  image_url: string,
  label: string
}

const CategoriesCompetenciesPage = () => {
  const {
    data: competencies,
    error,
    isLoading,
  } = useApiData<CompetencyData[]>({
    path: '/competencies/categories/',
    sendCredentials: true,
  });

  if (error) {
    return <div>There was an error loading the categories.</div>;
  }
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (!competencies) {
    return null;
  }

  const competenciesData = (competencies as unknown as any[]).map(
    (competency: any, i: number) => {
      return <CompetencyCard {...competency} key={i} />;
    }
  );

  return (
    <Box
      sx={{
        height: '70vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: ' column',
      }}
    >
      <Typography component="h2" variant="h4" m={3}>
        Competency Assessments
      </Typography>
      <Grid
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {competenciesData}
      </Grid>
    </Box>
  );
};

export default CategoriesCompetenciesPage;