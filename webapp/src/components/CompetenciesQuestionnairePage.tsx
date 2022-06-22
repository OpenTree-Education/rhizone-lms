import {
  Backdrop,
  Button,
  Divider,
  Fade,
  Grid,
  List,
  ListItem,
  ListItemText,
  Modal,
  Paper,
  Slider,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
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

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  backgroundColor: 'white',
  borderRadius: '10px',
  boxShadow: 24,
  p: 4,
};

const CompetencyModel = () => {
  const [submit, setSubmit] = useState<boolean>(false);

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
            xs={6}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-start',
              marginLeft: '2rem',
              flexDirection: 'column',
            }}
          >
            <Typography variant="h5" component="h3" m={2}>
              Competency Label:
            </Typography>
            <Typography variant="h6" component="h4" m={2}>
              Query text
            </Typography>
          </Grid>
        </Grid>
        <Divider variant="middle" sx={{ my: 5, width: '100%' }} />
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
        ></Grid>
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
            {false ? (
              <Button variant="text" disabled>
                <ChevronLeftIcon /> Back
              </Button>
            ) : (
              <Button variant="text">
                <ChevronLeftIcon /> Back
              </Button>
            )}
            <Button variant="text">
              Next <ChevronRightIcon />
            </Button>
          </Grid>
        )}
      </Paper>
    </Box>
  );
};

export default CompetencyModel;
