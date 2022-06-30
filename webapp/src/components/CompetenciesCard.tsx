import React, { useState } from 'react'
import { Button, Divider, Grid, Paper, Slider, Typography } from '@mui/material'
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

const customMarks = [
  {
    value: 1,
    label: 'Awareness',
  },
  {
    value: 2,
    label: 'Novice',
  },
  {
    value: 3,
    label: 'Intermediate',
  },
  {
    value: 4,
    label: 'Advanced',
  },
  {
    value: 5,
    label: 'Expert',
  },
];

interface Competencies {
  id: number;
  label: string;
  description: string;
  created_at: string;
  updated_at: string;
  principal_id: number;
}

interface CompetenciesCardProps {
  description?: string | undefined;
  image_url?: string | undefined;
  id?: string | number | undefined;
  label?: string | undefined;
  competencies?: Competencies[] | undefined;
}

const CompetenciesCard = ({ id, label, description, competencies }: CompetenciesCardProps) => {
  const [submit, setSubmit] = useState<boolean>(false);
  const [competencyIndex, setCompetencyIndex] = useState<number>(0);


  const competenciesLength = competencies?.length;

  const incrementIndex = () => {
    if (competencyIndex === competenciesLength - 1) {
      setSubmit(true);
    } else {
      setCompetencyIndex(competencyIndex + 1);
    }
  };

  const decrementIndex = () => {
    if (competencyIndex === 0) {
      setSubmit(false);
    } else {
      setCompetencyIndex(competencyIndex - 1);
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        p: 1,
        width: '50vw',
        height: 'auto',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Grid
        container
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Grid
          item
          xs={10}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            marginLeft: '2rem',
            flexDirection: 'column',
          }}
        >
          <Typography variant="h5" component="h3" my={2}>
            {label}:
          </Typography>
        </Grid>
      </Grid>
      <Divider variant="middle" sx={{ my: 2, width: '100%' }} />
      <Grid
        container
        item
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          margin: '2rem',
          flexDirection: 'column',
        }}
      >
        <Typography variant="h5" component="h3" m={2}>
          {competencies[competencyIndex]?.label}
        </Typography>
        <Typography component="p" m={2}>
          {competencies[competencyIndex]?.description}
        </Typography>
      </Grid>
      <Slider
        aria-label="Competency"
        step={1}
        marks={customMarks}
        min={1}
        max={5}
        color="primary"
        sx={{
          width: '80%',
        }}
      />
      {submit ? (
        <Grid item m={4}>
          <Button
            variant="contained"
            color="success"
            component="a"
            href={`/competencies/questionnaire/`}
          >
            Submit
          </Button>
        </Grid>
      ) : (
        <Grid
          item
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            margin: '2rem auto',
          }}
        >
          {competencyIndex === 0 ? (
            <Button onClick={decrementIndex} variant="text" disabled>
              <ChevronLeftIcon /> Back
            </Button>
          ) : (
            <Button onClick={decrementIndex} variant="text">
              <ChevronLeftIcon /> Back
            </Button>
          )}
          <Button onClick={incrementIndex} variant="text">
            Next <ChevronRightIcon />
          </Button>
        </Grid>
      )}
    </Paper>
  )
}

export default CompetenciesCard