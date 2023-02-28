import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

import {
  Container,
  Link,
  Stack,
  Button,
  Paper,
  TableContainer,
  TextField,
  FormControlLabel,
  Radio,
  Grid,
  FormGroup,
} from '@mui/material';
import { assessmentList } from '../assets/data';

const AssessmentsDetail = () => {
  const id = useParams();
  const assessment = assessmentList.find((assessment) => assessment.id === parseInt(id.id? id.id : ""));

  return (
    <Container>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', md: 'center' }}
      >
        <h1>Assessments</h1>
        <Link href="/assessment/">back</Link>
      </Stack>
      <TableContainer component={Paper}>
        <Grid container spacing={0}>
          <Grid item xs={6} style={{clear:'both'}}>
            <h3 className={"inline left"} style={{color:'red'}}> Graded Score: 30/100</h3>
          </Grid>
          <Grid item xs={6}>
            <h3 className={'inline right'}>Submitted: mm/dd/yy at hh:mm PST</h3>
          </Grid>
          <Grid item xs={12}>
            <h2 className={'center'}>{assessment?.title}</h2>
          </Grid>
          <Grid item xs={11}>
            <h3>1. (3pts) Umami kickstarter godard fixie slow-carb enamel pin mlkshk ethical squid everyday carry live-edge air plant la croix letterpress?  </h3>
          </Grid>
          <Grid item xs={1}>
            <h4 style={{color:'green'}}>Correct</h4>
          </Grid>
          <FormGroup>
            <FormControlLabel control={<Radio  disabled/>} label="A. Cold-pressed vegan vape" />
            <FormControlLabel control={<Radio  disabled/>} label="B. Aesthetic snackwave vibecession" />
            <FormControlLabel control={<Radio  disabled checked />} label="C. Roof party mustache hammock" />
          </FormGroup>
          <Grid item xs={11}>
            <h3>2. (3pts) Tousled four loko portland blog butcher live-edge wolf mlkshk cloud bread helvetica shaman paleo unicorn tacos big mood?  </h3>
          </Grid>
          <Grid item xs={1}>
            <h4 style={{color:'red'}} >Incorrect</h4>
          </Grid>
          <Grid item xs={8}>
            <h4 style={{color:'red'}}>Answer: B</h4>
          </Grid>
          <FormGroup>
            <FormControlLabel control={<Radio  disabled checked/>} label="A. Cold-pressed vegan vape" />
            <FormControlLabel control={<Radio  disabled />} label="B. Aesthetic snackwave vibecession" />
            <FormControlLabel control={<Radio   disabled />} label="C. Roof party mustache hammock" />
          </FormGroup>
          <Grid item xs={11}>
            <h3>3. (4pts) Intelligentsia mumblecore paleo cloud bread, bruh austin leggings praxis hell of pork belly freegan master cleanse four dollar toast? </h3>
          </Grid>
          <Grid item xs={5}>
            <h4 style={{color:'red'}}> Incorrect: Pickled kogi blue bottle</h4>
          </Grid>
          <Grid item xs={8}>
            <TextField
              error
              id="outlined-read-only-input"
              label="Answer"
              multiline
              rows={4}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              defaultValue="Cliche raclette kogi paleo affogato, etsy iPhone vaporware truffaut mlkshk dreamcatcher meggings VHS. Post-ironic bitters praxis, letterpress fit snackwave sriracha single-origin coffee synth chambray bodega boys prism marfa everyday carry."
            />
          </Grid>
        </Grid>
        <Grid paddingTop={3} item xs={4}>
          <Button variant="contained" disabled>Submitted</Button>
        </Grid>
      </TableContainer>
    </Container>
  );
};

export default AssessmentsDetail;
