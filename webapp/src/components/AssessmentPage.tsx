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
import Button from '@mui/material/Button';

function createData(
  id: number,
  Title: string,
  Status: string,

  Type: string,
  dueDate: string,
  testDuration: number,
  submittedDate: string,
  Score: number,
  availableDate: string
) {
  return {
    id,
    Title,
    Status,
    Type,
    dueDate,
    testDuration,
    submittedDate,
    Score,
    availableDate,
  };
}

const rows = [
  createData(
    1,
    'Assessment 1',
    'Active',

    'Assignment',
    '25-3-2023',
    60,
    '',
    0,
    '25-2-2023'
  ),
  createData(
    2,
    'Assessment 2',
    'Active',

    'Assignment',
    '25-3-2023',
    60,
    '',
    0,
    '25-2-2023'
  ),
  createData(
    3,
    'Assessment 3',
    'Active',

    'Assignment',
    '25-3-2023',
    60,
    '',
    0,
    '25-2-2023'
  ),
  createData(
    4,
    'Assessment 4',
    'Active',

    'Assignment',
    '25-3-2023',
    60,
    '',
    0,
    '25-2-2023'
  ),
  createData(
    5,
    'Assessment 5',
    'Active',

    'Assignment',
    '25-3-2023',
    60,
    '',
    0,
    '25-2-2023'
  ),
  createData(
    6,
    'Assessment 6',
    'Upcoming',

    'Assignment',
    '',
    0,
    '',
    0,
    '25-2-2023'
  ),
  createData(
    7,
    'Assessment 7',
    'Past',

    'Assignment',
    '',
    60,
    '25-3-2023',
    40,
    ''
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

enum AssessmentTabs {
  All,
  Current,
  Past,
  Upcoming,
}

const AssessmentPage = () => {
  const [expanded, setExpanded] = useState<string | false>('panel1');
  const [past, setPast] = useState(false);
  const [active, setActive] = useState(false);
  const [upcoming, setUpcoming] = useState(false);
  const [value, setValue] = useState(0);
  const [currentTab, setCurrentTab] = useState(AssessmentTabs.All);

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    // console.log("the value",value)
    // if(value === 1){
    //   setActive(true);
    //   setPast(false);
    //   setUpcoming(false);
    //   console.log("active",active)
    // }else if (value ===2){
    //   setPast(true)
    //   setActive(false);
    //   setUpcoming(false);
    // }else if (value === 0){
    //   setUpcoming(true);
    //   setActive(false);
    //   setPast(false);
    // }
    setCurrentTab(newValue as AssessmentTabs);
  };

  return (
    <Container>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', md: 'center' }}
      >
        <h1>Assessment</h1>
      </Stack>

      <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
        <Tabs value={currentTab as number} onChange={handleChangeTab}>
          <Tab
            icon={
              <StyledBadge badgeContent={4} color="primary">
                <ScheduleOutlinedIcon />
              </StyledBadge>
            }
            iconPosition="start"
            // value="activeTab"
            label="Active"
          />
          <Tab
            icon={<ArchiveOutlinedIcon />}
            iconPosition="start"
            // value="pastTab"

            label="Past"
          />
          <Tab
            icon={<UpcomingOutlinedIcon />}
            iconPosition="start"
            label="Upcoming"
          />
        </Tabs>
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 600 }} aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Status</TableCell>

              <TableCell>Type</TableCell>
              {active && (
                <>
                  <TableCell>Due Date</TableCell>
                  <TableCell>Test Duration</TableCell>
                </>
              )}

              {past && (
                <>
                  {' '}
                  <TableCell>Submitted Date</TableCell>
                  <TableCell>Score</TableCell>
                </>
              )}
              {upcoming && <TableCell>Available Date</TableCell>}

              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* { active && rows.filter(row => row.Status ==='Active').map(row =>( */}
            {/* { rows.map((row)=>( */}

            {/* <TableRow
              key={row.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              > */}
            {active &&
              rows
                .filter(item => item.Status === 'Active')
                .map(row => (
                  <>
                    <TableRow
                      key={row.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell>{row.Title}</TableCell>
                      <TableCell>{row.Status}</TableCell>
                      <TableCell>{row.Type}</TableCell>
                      <TableCell>{row.dueDate}</TableCell>
                      <TableCell>{row.testDuration}</TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={2}>
                          <Button href="#text-buttons">Start</Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  </>
                ))}
            {past &&
              rows
                .filter(row => row.Status === 'Past')
                .map(row => (
                  <>
                    <TableRow
                      key={row.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell>{row.Title}</TableCell>
                      <TableCell>{row.Status}</TableCell>
                      <TableCell>{row.Type}</TableCell>
                      <TableCell>{row.submittedDate}</TableCell>
                      <TableCell>{row.Score}</TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={2}>
                          <Button href="#text-buttons" disabled>
                            Review
                          </Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  </>
                ))}
            {upcoming &&
              rows
                .filter(item => item.Status === 'Upcoming')
                .map(row => (
                  <>
                    <TableRow
                      key={row.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell>{row.Title}</TableCell>
                      <TableCell>{row.Status}</TableCell>
                      <TableCell>{row.Type}</TableCell>
                      <TableCell>{row.availableDate}</TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={2}>
                          <Button href="#text-buttons" disabled>
                            Not Active
                          </Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  </>
                ))}

            {/* </TableRow> */}
            {/* ) )} */}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default AssessmentPage;
