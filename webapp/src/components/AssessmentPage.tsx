import { Box, Container, Grid, Stack } from '@mui/material';
import React, { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Link from '@mui/material/Link';

import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import AlarmOnOutlinedIcon from '@mui/icons-material/AlarmOnOutlined';
import Badge, { BadgeProps } from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DoneAllOutlinedIcon from '@mui/icons-material/DoneAllOutlined';
import DoneOutlinedIcon from '@mui/icons-material/DoneOutlined';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined';
import UpcomingOutlinedIcon from '@mui/icons-material/UpcomingOutlined';
import LockClockOutlinedIcon from '@mui/icons-material/LockClockOutlined';

import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import AssessmentIcon from '@mui/icons-material/Assessment';

function createData(
  Status: string,
  Title: string,
  /*Type: string,*/
  Grade: string,
  Score: string,
  dueDate: string,
  testDuration: string,
  availableDate: string,
  submittedDate: string
) {
  return {
    Status,
    Title,
    /*Type,*/
    Grade,
    Score,
    dueDate,
    testDuration,
    availableDate,
    submittedDate,
  };
}

const rows = [
  createData(
    'Active',
    'Assigment 4',
    '',
    '',
    '25-2-2023',
    '1h',
    '18-2-2023',
    ''
  ),
  createData('Upcoming', 'Assigment 5', '', '', '10-3-2023', '-', '', ''),
  createData('Upcoming', 'Assigment 6', '', '', '17-3-2023', '-', '', ''),
  createData('Upcoming', 'Assigment 7', '', '', '29-3-2023', '-', '', ''),
  createData(
    'Past',
    'Assigment 3',
    '100',
    '60/60',
    '15-2-2023',
    '30m',
    '8-2-2023',
    '15-2-2023 23:59'
  ),
  createData(
    'Past',
    'Assigment 2',
    '85',
    '60/70',
    '25-1-2023',
    '45m',
    '25-1-2023',
    '25-1-2023 13:15'
  ),
  createData(
    'Past',
    'Assigment 1',
    '70',
    '70/100',
    '18-1-2023',
    '1h',
    '10-1-2023',
    '11-1-2023 10:00'
  ),
];

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
  '& .MuiBadge-badge': {
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}));

const AssessmentPage = () => {
  const [expanded, setExpanded] = React.useState<string | false>('panel1');

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };
  const [value, setValue] = React.useState(0);

  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Container>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', md: 'center' }}
      >
        <h1>Program Assessments</h1>
      </Stack>

      {/* <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Active</Typography>
        </AccordionSummary>
        <AccordionDetails>
        <TableContainer component={Paper}>
      <Table sx={{ minWidth: 600 }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell align="right"  >date</TableCell>
            <TableCell align="right">name</TableCell>
            <TableCell align="right">Grade/Ungrade</TableCell>
            
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.name}  
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
             
              <TableCell align="right">{row.date}</TableCell>
              <TableCell align="right">
               
                {row.name}
                </TableCell>
              <TableCell align="right">{row.grade}</TableCell>
              
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography>Past</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            malesuada lacus ex, sit amet blandit leo lobortis eget.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3a-content"
          id="panel3a-header"
        >
          <Typography>Upcoming</Typography>
        </AccordionSummary>
      </Accordion> */}

      <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
        <Tabs value={value} onChange={handleChangeTab}>
          <Tab
            icon={
              <StyledBadge badgeContent={7} color="primary">
                <AssessmentIcon />
              </StyledBadge>
            }
            iconPosition="start"
            label="All"
          />
          <Tab
            icon={
              <StyledBadge badgeContent={1} color="primary">
                <ScheduleOutlinedIcon />
              </StyledBadge>
            }
            iconPosition="start"
            label="Active"
          />
          <Tab
            icon={
              <StyledBadge badgeContent={3} color="primary">
                <ArchiveOutlinedIcon />
              </StyledBadge>
            }
            iconPosition="start"
            label="Past"
          />
          <Tab
            icon={
              <StyledBadge badgeContent={3} color="primary">
                <UpcomingOutlinedIcon />
              </StyledBadge>
            }
            iconPosition="start"
            label="Upcoming"
          />
        </Tabs>
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 600 }} aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>Status</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Grade</TableCell>
              <TableCell>Score</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Test Duration</TableCell>
              <TableCell>Available Date</TableCell>
              <TableCell>Submit Date</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(row => (
              <TableRow
                key={row.Title}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell>{row.Status}</TableCell>
                <TableCell>{row.Title}</TableCell>
                <TableCell>{row.Grade}</TableCell>
                <TableCell>{row.Score}</TableCell>
                <TableCell>{row.dueDate}</TableCell>
                <TableCell>{row.testDuration}</TableCell>
                <TableCell>{row.availableDate}</TableCell>
                <TableCell>{row.submittedDate}</TableCell>
                <TableCell>
                  <button>Action</button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default AssessmentPage;
