import React from 'react'

import { Box, Paper, Grid, TextField, ButtonGroup, Button, styled } from '@mui/material';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));


const AssessmentEditorPage = () => {
  const [selectedBtn, setSelectedBtn] = React.useState(-1);
  return(
    <Box sx={{ flexGrow: 1, boxShadow: 5, margin: 2, padding: 2, overflow: 'auto'}}>
      <Grid
        container
        spacing={2}
        alignItems={'center'}
        >
        <Grid item xs={9}>
          <h1> Create New Assessment </h1>
        </Grid>
        <Grid item xs={3}>
        <ButtonGroup variant="outlined" aria-label="outlined button group">
            <Button color={selectedBtn === 1 ? "secondary" : "primary"} onClick={()=>setSelectedBtn(1)}>Assignment</Button>
            <Button color={selectedBtn === 2 ? "secondary" : "primary"} onClick={()=>setSelectedBtn(2)}>Quiz</Button>
            <Button color={selectedBtn === 3 ? "secondary" : "primary"} onClick={()=>setSelectedBtn(3)}>Test</Button>
          </ButtonGroup>
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="fullWidth"
            label="Title"
            sx={{ m: 1}}
            variant="filled"
            fullWidth
          />
        </Grid>
        <Grid item xs={8}>
          <TextField
            id="filled-multiline-static"
            label="Description"
            multiline
            rows={4}
            sx={{m: 1}}
            variant="filled"
          />
        </Grid>
        <Grid item xs={4}>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AssessmentEditorPage;
