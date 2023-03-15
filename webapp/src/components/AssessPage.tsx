import React, { useState } from 'react';

import {
  Box,
  Chip,
  Container,
  Stack,
  Button,
  Paper,
  TableRow,
  TableHead,
  TableContainer,
  TableCell,
  TableBody,
  Table,
  Tabs,
  Tab,
} from '@mui/material';
import Typography from '@mui/material/Typography';
import Badge, { BadgeProps } from '@mui/material/Badge';
import { styled } from '@mui/material/styles';

import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import DoneAllOutlinedIcon from '@mui/icons-material/DoneAllOutlined';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined';
import UpcomingOutlinedIcon from '@mui/icons-material/UpcomingOutlined';
import LockClockOutlinedIcon from '@mui/icons-material/LockClockOutlined';
import AssessmentIcon from '@mui/icons-material/Assessment';

import { formatDateTime } from '../helpers/dateTime';
import { assessmentList } from '../assets/data';

// import { foodList } from '../assets/dataAssess';


import AssessPageTab from './AssessPageTab';
import AssessPageTable from './AssessPageTable';
import { CollectionsOutlined } from '@mui/icons-material';

enum StatusTab {
  All,
  Milk,
  Fruit,
  Vegetable,
}

const AssessPageInitial = () => {
  // const [value, setValue] = React.useState(0);

  // const handleChange = (event: React.SyntheticEvent, newValue: number) => {
  //   setValue(newValue);
  // };

  const [currentStatusTab, setCurrentStatusTab] = useState(StatusTab.Fruit);
  const handleChangeTab = (
    event: React.SyntheticEvent,
    newCurrentStatusTab: number
  ) => {
    setCurrentStatusTab(newCurrentStatusTab);
    console.log(newCurrentStatusTab);
  };

  const [data, setData] = useState('');
  const parentToChild = () => {
    setData("This is data from Parent Component to the Child Component.");
  }

  return (
    <Container>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={currentStatusTab}
            onChange={handleChangeTab}
            aria-label="basic tabs example"
          >
            <Tab label="All"  />
            <Tab label="Milk" />
            <Tab label="Fruit"  />
            <Tab label="Vegetable" />
          </Tabs>
        </Box>
       </Box>
     
       {/* <AssessPageTab data={data} /> */}
     <AssessPageTab currentStatusTab= {number}
              />
 
      

        <Button variant="contained" size="small" onClick={() => parentToChild()}>
          Start
        </Button>
   
 
     {/* <AssessPageTable currentStatusTab={currentStatusTab}/> */}
     
    </Container>     

  );
}

export default AssessPageInitial;



