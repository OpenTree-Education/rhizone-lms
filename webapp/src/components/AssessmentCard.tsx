import * as React from 'react';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Button } from '@mui/material';
import { blue } from '@mui/material/colors';
import { useState } from 'react';
import { Box } from '@mui/system';


export default function AssesmentCard() {
    const assesments = [
  {
    "id": 1,
    "title": "Introduction to HTML",
    "description": "Learn the basics of HTML, the markup language used to create web pages.",
    "score": 92,
    "timestamp": "2023-02-15T13:30:00Z"
  },
  {
    "id": 2,
    "title": "CSS Layouts",
    "description": "Explore different techniques for laying out web pages using CSS.",
    "score": 85,
    "timestamp": "2023-02-14T10:15:00Z"
  },
  {
    "id": 3,
    "title": "JavaScript Fundamentals",
    "description": "Learn the basics of JavaScript, the programming language used to add interactivity to web pages.",
    "score": 97,
    "timestamp": "2023-02-12T16:45:00Z"
  }
]


  return (
    <Box>  
        {assesments.length === 0 && <p>There are no upcomming assesments for you.</p>}
        {assesments.map(({id, title, description, score,timestamp })=>(

         <Paper key={id}
      sx={{
        p: 2,
        margin: 'auto',
        marginBottom: 4,
        width: '100%',
        flexGrow: 1,
        border: blue,
        backgroundColor: (theme) =>
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
                    Date/Time
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography sx={{ cursor: 'pointer' }} variant="body2">
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
          </Grid><Button variant="contained">Start</Button> </Paper>))};
   
    </Box>
    
   
  );
}


