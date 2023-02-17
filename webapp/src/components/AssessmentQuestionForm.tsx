import * as React from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

export default function AssessmentQuestionForm() {
  return (
    <React.Fragment>
      <Typography variant="h5" gutterBottom>
        Quesions
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            required
            id="cardName"
            label="Quetion Description"
            fullWidth
            variant="standard"
          />
        </Grid>
        <Grid item xs={8}>
        <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
          >
            <FormControlLabel value="Single" control={<Radio />} label="Single choice" />
            <FormControlLabel value="Multiple" control={<Radio />} label="Multiple choice" />
            <FormControlLabel value="Type" control={<Radio />} label="Type your answer" />
        </RadioGroup>
        </Grid>
        <Grid item xs={4}>
        <TextField
            required
            id="point"
            label="Point Worth"
            fullWidth
            variant="standard"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            id="optiona"
            label="Option A"   
            fullWidth         
            variant="standard"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            id="optionb"
            label="Option B"
            fullWidth
            variant="standard"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            id="optionc"
            label="Option C"
            fullWidth
            variant="standard"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            id="optiond"
            label="Option D"
            fullWidth
            autoComplete="cc-csc"
            variant="standard"
          />
        </Grid>
        <Grid item xs={12} >

            <FormLabel id="demo-radio-buttons-group-label">Correct Answer:</FormLabel>

        </Grid>
        <Grid item xs={8}>
          <FormGroup
            row
          > 
            <FormControlLabel control={<Checkbox />} label="A" />
            <FormControlLabel control={<Checkbox />} label="B" />
            <FormControlLabel control={<Checkbox />} label="C" />
            <FormControlLabel control={<Checkbox />} label="D" />
          </FormGroup>
        </Grid>
        <Grid item xs={4}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  // onClick={handleNext}
                  sx={{ mt: 3, ml: 1 }}
                >
                  Add Question
                </Button>
              </Box>          
        </Grid>
      </Grid>
    </React.Fragment>
  );
}