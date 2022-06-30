import { Box } from '@mui/system';
import React from 'react';
import { useParams } from 'react-router-dom';
import useApiData from '../helpers/useApiData';
import CompetenciesCard from './CompetenciesCard';

interface Competencies {
  description: string;
  image_url: string;
  id: number | string;
  label: string;
  competencies: any[];
}

const CompetencyModel = () => {
  const { categoryId } = useParams();

  const {
    data: competencies,
    error,
    isLoading,
  } = useApiData<Competencies[]>({
    path: `/competencies/categories/`,
    sendCredentials: true,
  });

  if (error) {
    return (
      <div>There was an error loading the competencies questionnaire.</div>
    );
  }
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (!competencies) {
    return null;
  }

  const currentCompetency = Object.values(competencies)?.find(
    competency => competency.id == categoryId
  );

  console.log(currentCompetency);

  return (
    <Box
      sx={{
        display: 'flex',
        p: 1,
        width: '100vw',
        height: '70vh',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <CompetenciesCard {...currentCompetency} />
    </Box>
  );
};

export default CompetencyModel;
