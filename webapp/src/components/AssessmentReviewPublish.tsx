import * as React from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import Radio from '@mui/material/Radio';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';

export default function AssessmentReviewPublish() {
  return (
    <React.Fragment>
      <Typography variant="h5" gutterBottom>
        Assessment summary
      </Typography>
        <Grid container spacing={0}>
          <Grid item xs={12}>
            <Typography variant="h6" >Assignment: Unicorn Schlitz 2.2</Typography>
          </Grid>          
          <Grid item xs={12} style={{clear:'both'}}>
            <Typography > Total Score: 100</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography >Avaiavle From: mm/dd/yy at hh:mm PST</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography >Due At: mm/dd/yy at hh:mm PST</Typography>
          </Grid>

          <Grid item xs={11}>
            <h3>1. (xpts) Umami kickstarter godard fixie slow-carb enamel pin mlkshk ethical squid everyday carry live-edge air plant la croix letterpress?  </h3>
          </Grid>
          <FormGroup>
            <FormControlLabel control={<Radio />} disabled label="A. Cold-pressed vegan vape" />
            <FormControlLabel control={<Radio />}  disabled label="B. Aesthetic snackwave vibecession" />
            <FormControlLabel control={<Radio  />} disabled label="C. Roof party mustache hammock" />
          </FormGroup>
          <Grid item xs={11}>
            <h3>2. (xpts) Tousled four loko portland blog butcher live-edge wolf mlkshk cloud bread helvetica shaman paleo unicorn tacos big mood?  </h3>
          </Grid>
          <FormGroup>
            <FormControlLabel control={<Checkbox  />} disabled label="A. Cold-pressed vegan vape" />
            <FormControlLabel control={<Checkbox />} disabled label="B. Aesthetic snackwave vibecession" />
            <FormControlLabel control={<Checkbox  />} disabled label="C. Roof party mustache hammock" />
          </FormGroup>
          <Grid item xs={11}>
            <h3>3. (xpts) Intelligentsia mumblecore paleo cloud bread, bruh austin leggings praxis hell of pork belly freegan master cleanse four dollar toast? </h3>
          </Grid>
          <Grid item xs={8}>
            <TextField
              id="outlined-multiline-static"
              label="Answer"
              multiline
              rows={1}
              fullWidth
              disabled
            />
          </Grid>
        </Grid>
    </React.Fragment>
  );
}