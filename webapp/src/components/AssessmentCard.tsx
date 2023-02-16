import * as React from 'react';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Button } from '@mui/material';
import { blue } from '@mui/material/colors';
import { useState } from 'react';
import { Box } from '@mui/system';

interface AssessmentCardProps {
  id: number;
  title: string;
  description: string;
  score: number;
  timestamp: string;
}

export default function AssessmentCard({
  id,
  title,
  description,
  score,
  timestamp,
}: AssessmentCardProps) {
  const newDate = new Date(timestamp);

  return (
    <Box>
      <Paper
        key={id}
        sx={{
          p: 2,
          margin: 'auto',
          marginBottom: 4,
          width: '100%',
          borderRadius: '10px',
          flexGrow: 1,
          boxShadow: 'none',
          border: '1.5px solid #2196f3',
          backgroundColor: theme =>
            theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm container>
            <Grid item xs container direction="column" spacing={2}>
              <Grid item xs>
                <Typography gutterBottom variant="subtitle1" component="div">
                  {title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {newDate.toLocaleDateString('en-US')}
                </Typography>
              </Grid>
              <Grid item>
                <Typography sx={{ cursor: 'pointer' }} variant="body2" mt={3}>
                  {description}
                </Typography>
              </Grid>
            </Grid>
            <Grid item>
              <Typography variant="subtitle1" component="div">
                {score} %
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Box m={1} display="flex" justifyContent="flex-end" alignItems="center">
          <Button variant="contained">Start</Button>
        </Box>
      </Paper>
      {/* ))} */}
    </Box>
  );
}
