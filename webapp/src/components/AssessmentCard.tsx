import * as React from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Button } from '@mui/material';
import { Box } from '@mui/system';

interface AssessmentCardProps {
  id: number;
  title: string;
  description: string;
  score?: number;
  timestamp: string;
  complited?: boolean;
}

export default function AssessmentCard({
  id,
  title,
  description,
  score,
  timestamp,
  complited,
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
          width: '98%',
          borderRadius: '10px',
          flexGrow: 1,
          boxShadow: 'none',
          border: '1.5px solid #2196f3',
          backgroundColor: theme =>
            complited === false ? '#ffffff' : '#F5F5F5',
          '&:hover': {
            scale: '1.02',
          },
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm container>
            <Grid item xs container direction="column" spacing={2}>
              <Grid item xs>
                <Typography gutterBottom component="div" variant="h5">
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
              <Typography variant="h6" component="div" mr={5} fontWeight={600}>
                {score}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Box m={1} display="flex" justifyContent="flex-end" alignItems="center">
          <Button variant="contained">
            {complited === false ? 'Start' : 'Review'}
          </Button>
        </Box>
      </Paper>
      {/* ))} */}
    </Box>
  );
}
