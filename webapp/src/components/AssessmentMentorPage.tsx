import React, { useState, useEffect } from 'react';
import { Container, Stack } from '@mui/material';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import DoneAllOutlinedIcon from '@mui/icons-material/DoneAllOutlined';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import AlarmOnOutlinedIcon from '@mui/icons-material/AlarmOnOutlined';
import AssessmentAddNew from './AssessmentAddNew';
import AssesmentGrading from './AssessmentGrading';


function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

const AssessmentMentorPage = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    console.log(newValue);
  };
  return (
    <Container>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', md: 'center' }}
      >
        <h1>Assessment Management</h1> 
        <Link href="/assessment">Switch to Mentee mode</Link>
      </Stack>
      <Box
      sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex'}}
      >
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={value}
          onChange={handleChange}
          sx={{ borderRight: 1, borderColor: 'divider' }}
        >
          <Tab icon={<AddCircleOutlineOutlinedIcon/>} {...a11yProps(-1)} />
          <Tab icon={<AlarmOnOutlinedIcon/>} iconPosition="end" label="Item Two" {...a11yProps(1)} />
          <Tab icon={<ScheduleOutlinedIcon/>} iconPosition="end" label="Item Three" {...a11yProps(2)} />
          <Tab icon={<ScheduleOutlinedIcon/>} iconPosition="end" label="Item Four" {...a11yProps(3)} />
          <Tab icon={<DoneAllOutlinedIcon/>} iconPosition="end" label="Item One"  {...a11yProps(0)} />
        </Tabs>
        {value === 0
          ? <AssessmentAddNew/>
          : <AssesmentGrading index = {value} />
        }
      </Box>
    </Container>
  );
};

export default AssessmentMentorPage;
