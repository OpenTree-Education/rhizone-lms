import React, { useState, useEffect } from 'react';
import { Container, Stack } from '@mui/material';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import Checkbox from '@mui/material/Checkbox';
import Radio from '@mui/material/Radio';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import DoneAllOutlinedIcon from '@mui/icons-material/DoneAllOutlined';
import DoneOutlinedIcon from '@mui/icons-material/DoneOutlined';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  color: theme.palette.text.secondary,
}));
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}
const AssessmentPage = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Container>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', md: 'center' }}
      >
        <h1>Assessments</h1>
        <Link href="/assessment/mentor">Switch to Mentor mode</Link>
      </Stack>
      <Box
      sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex'}}
      >
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={value}
          onChange={handleChange}
          aria-label="Vertical tabs example"
          sx={{ borderRight: 1, borderColor: 'divider' }}
        >
          <Tab icon={<DoneAllOutlinedIcon/>} iconPosition="end" label="Jean Shorts 1.3"  {...a11yProps(0)} />
          <Tab icon={<DoneOutlinedIcon/>} iconPosition="end" label="Unicorn Schlitz 2.2" {...a11yProps(1)} />
          <Tab icon={<ScheduleOutlinedIcon/>} iconPosition="end" label="Gastropub Poutine 3.7" {...a11yProps(2)} />
          <Tab icon={<CancelOutlinedIcon/>} iconPosition="end" label="Quiz: Unit 1" {...a11yProps(3)} />
          <Tab icon={<LockOutlinedIcon/>} iconPosition="end" label="Quiz Name" {...a11yProps(4)} />
        </Tabs>
        <TabPanel value={value} index={0}>
          <Container>
            <Grid container spacing={0}>
              <Grid item xs={6} style={{clear:'both'}}>
                <h3 className={"inline left"} style={{color:'red'}}> Graded Score: 30/100</h3>
              </Grid>
              <Grid item xs={6}>
                <h3 className={'inline right'}>Submitted: mm/dd/yy at hh:mm PST</h3>
              </Grid>
              <Grid item xs={12}>
                <h2 className={'center'}>Assignment: Jean Shorts 1.3</h2>
              </Grid>
              <Grid item xs={11}>
                <h3>1. (3pts) Umami kickstarter godard fixie slow-carb enamel pin mlkshk ethical squid everyday carry live-edge air plant la croix letterpress?  </h3>
              </Grid>
              <Grid item xs={1}>
                <h4 style={{color:'green'}}>Correct</h4>
              </Grid>
              <FormGroup>
                <FormControlLabel control={<Checkbox disabled/>} label="A. Cold-pressed vegan vape" />
                <FormControlLabel control={<Checkbox disabled/>} label="B. Aesthetic snackwave vibecession" />
                <FormControlLabel control={<Checkbox disabled checked />} label="C. Roof party mustache hammock" />
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
                <FormControlLabel control={<Checkbox disabled checked/>} label="A. Cold-pressed vegan vape" />
                <FormControlLabel control={<Checkbox disabled />} label="B. Aesthetic snackwave vibecession" />
                <FormControlLabel control={<Checkbox  disabled />} label="C. Roof party mustache hammock" />
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
          </Container>
        </TabPanel>
        <TabPanel value={value} index={1}>
        <Container>
            <Grid container spacing={0}>
              <Grid item xs={6} style={{clear:'both'}}>
                <h3 className={"inline left"} style={{color:'grey'}}> Ungraded : xx/100</h3>
              </Grid>
              <Grid item xs={6}>
                <h3 className={'inline right'} style={{color:'Green'}}>Submitted: mm/dd/yy at hh:mm PST</h3>
              </Grid>
              <Grid item xs={12}>
                <h2 className={'center'}>Assignment: Unicorn Schlitz 2.2</h2>
              </Grid>
              <Grid item xs={11}>
                <h3>1. (xpts) Umami kickstarter godard fixie slow-carb enamel pin mlkshk ethical squid everyday carry live-edge air plant la croix letterpress?  </h3>
              </Grid>
              <FormGroup>
                <FormControlLabel control={<Radio />} disabled label="A. Cold-pressed vegan vape" />
                <FormControlLabel control={<Radio />}  disabled label="B. Aesthetic snackwave vibecession" />
                <FormControlLabel control={<Radio defaultChecked />} disabled label="C. Roof party mustache hammock" />
              </FormGroup>
              <Grid item xs={11}>
                <h3>2. (xpts) Tousled four loko portland blog butcher live-edge wolf mlkshk cloud bread helvetica shaman paleo unicorn tacos big mood?  </h3>
              </Grid>
              <FormGroup>
                <FormControlLabel control={<Checkbox defaultChecked />} disabled label="A. Cold-pressed vegan vape" />
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
                  rows={4}
                  fullWidth
                  disabled
                  defaultValue=" Fam vice chillwave hella, viral cloud bread street art raw denim schlitz squid pork belly cardigan shabby chic synth. Scenester food truck meggings 8-bit gentrify. Godard affogato iPhone paleo ascot blue bottle distillery."
                />
              </Grid>
            </Grid>
            <Grid paddingTop={3} item xs={4}>
              <Button variant="contained" disabled>Submitted</Button>
            </Grid>
          </Container>
        </TabPanel>
        <TabPanel value={value} index={2}>
        <Container>
            <Grid container spacing={0}>
              <Grid item xs={6} style={{clear:'both'}}>
                <h3 className={"inline left"} style={{color:'grey'}}>Total score: 100</h3>
              </Grid>
              <Grid item xs={6}>
                <h3 className={'inline right'} style={{color:'orange'}}> Active. Due date: mm/dd/yy at hh:mm PST</h3>
              </Grid>
              <Grid item xs={12}>
                <h2 className={'center'}>Assignment: Gastropub Poutine 3.7</h2>
              </Grid>
              <Grid item xs={11}>
                <h3>1. (xpts) Umami kickstarter godard fixie slow-carb enamel pin mlkshk ethical squid everyday carry live-edge air plant la croix letterpress?  </h3>
              </Grid>
              <FormGroup>
                <FormControlLabel control={<Checkbox />} label="A. Cold-pressed vegan vape" />
                <FormControlLabel control={<Checkbox />} label="B. Aesthetic snackwave vibecession" />
                <FormControlLabel control={<Checkbox defaultChecked />} label="C. Roof party mustache hammock" />
              </FormGroup>
              <Grid item xs={11}>
                <h3>2. (xpts) Tousled four loko portland blog butcher live-edge wolf mlkshk cloud bread helvetica shaman paleo unicorn tacos big mood?  </h3>
              </Grid>
              <FormGroup>
                <FormControlLabel control={<Checkbox defaultChecked />} label="A. Cold-pressed vegan vape" />
                <FormControlLabel control={<Checkbox />} label="B. Aesthetic snackwave vibecession" />
                <FormControlLabel control={<Checkbox  />} label="C. Roof party mustache hammock" />
              </FormGroup>
              <Grid item xs={11}>
                <h3>3. (xpts) Intelligentsia mumblecore paleo cloud bread, bruh austin leggings praxis hell of pork belly freegan master cleanse four dollar toast? </h3>
              </Grid>
              <Grid item xs={8}>
                <TextField
                  id="outlined-multiline-static"
                  label="Answer"
                  multiline
                  rows={4}
                  fullWidth
                  defaultValue="Default Value"
                />
              </Grid>
            </Grid>
            <Grid paddingTop={3} item xs={4}>
              <Stack direction="row" spacing={3}>
                <Button variant="contained" color="success">Submit</Button>
                <Button variant="outlined" color="success">Save</Button>
              </Stack>
            </Grid>
          </Container>
        </TabPanel>
        <TabPanel value={value} index={3}>
        <Container>
            <Grid container spacing={0}>
              <Grid item xs={6} style={{clear:'both'}}>
                <h3 className={"inline left"}>0/100</h3>
              </Grid>
              <Grid item xs={6}>
                <h3 className={'inline right'}>Past due date: mm/dd/yy at hh:mm PST</h3>
              </Grid>
              <Grid item xs={12}>
                <h2 className={'center'}>Quiz: Unit 1 </h2>
              </Grid>
              <Grid item xs={11}>
                <h3>1. (xpts) Umami kickstarter godard fixie slow-carb enamel pin mlkshk ethical squid everyday carry live-edge air plant la croix letterpress?  </h3>
              </Grid>
              <Grid item xs={1}>
                <h4>Correct</h4>
              </Grid>
              <FormGroup>
                <FormControlLabel control={<Checkbox />} label="A. Cold-pressed vegan vape" />
                <FormControlLabel control={<Checkbox />} label="B. Aesthetic snackwave vibecession" />
                <FormControlLabel control={<Checkbox defaultChecked />} label="C. Roof party mustache hammock" />
              </FormGroup>
              <Grid item xs={11}>
                <h3>2. (xpts) Tousled four loko portland blog butcher live-edge wolf mlkshk cloud bread helvetica shaman paleo unicorn tacos big mood?  </h3>
              </Grid>
              <Grid item xs={1}>
                <h4>Incorrect</h4>
              </Grid>
              <Grid item xs={8}>
                <h4>Correct Answer: B</h4>
              </Grid>
              <FormGroup>
                <FormControlLabel control={<Checkbox defaultChecked />} label="A. Cold-pressed vegan vape" />
                <FormControlLabel control={<Checkbox />} label="B. Aesthetic snackwave vibecession" />
                <FormControlLabel control={<Checkbox  />} label="C. Roof party mustache hammock" />
              </FormGroup>
              <Grid item xs={11}>
                <h3>3. (xpts) Intelligentsia mumblecore paleo cloud bread, bruh austin leggings praxis hell of pork belly freegan master cleanse four dollar toast? </h3>
              </Grid>
              <Grid item xs={8}>
                <TextField
                  id="outlined-multiline-static"
                  label="Answer"
                  multiline
                  rows={4}
                  fullWidth
                  defaultValue="Default Value"
                />
              </Grid>
            </Grid>
            <Grid paddingTop={3} item xs={4}>
              <Stack direction="row" spacing={3}>
                <Button variant="contained" color="success">Submit</Button>
                <Button variant="outlined" color="success">Save</Button>
              </Stack>
            </Grid>
          </Container>
        </TabPanel>
        <TabPanel value={value} index={4}>
          <Container>
            <Grid item xs={12}>
              <h3 className={'center'} style={{color:'grey'}}> Available After mm/dd/yy at hh:mm PST</h3>
            </Grid>
          </Container>
        </TabPanel>
      </Box>
    </Container>
  );
};

export default AssessmentPage;
