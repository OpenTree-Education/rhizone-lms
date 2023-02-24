import { Box, Container, Grid, Stack, Button,} from '@mui/material';
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
import AssessmentIcon from'@mui/icons-material/Assessment';
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
interface TableCellWrapperProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
interface TableRowWrapperProps {
  children?: React.ReactNode;
  value: number;
  status: string;
}

function TableCellWrapper(props: TableCellWrapperProps) {
  const { children, value, index, ...other } = props;
  return index === -1 || index === value || value === 0? 
  <TableCell>{children}</TableCell> 
  : null;
}

function TableRowWrapper(props: TableRowWrapperProps) {
  const { children, status, value, ...other } = props;
  if(value === 0){
    return <TableRow>{children}</TableRow>
  }
  switch(status) {
    case 'Active':
      return value === 1?<TableRow>{children}</TableRow>:null;
    case 'Upcoming':
      return value === 3?<TableRow>{children}</TableRow>:null;    
    case 'Submitted':
    case 'Graded':
    case 'Unsubmitted':
    default:
    return value === 2?<TableRow>{children}</TableRow>:null;
  }
}

function renderIconByStatus(status : string) {
  switch(status) {
    case 'Active':
      return <ScheduleOutlinedIcon />;
    case 'Submitted':
      return <DoneOutlinedIcon />;
    case 'Graded':
      return <DoneAllOutlinedIcon />;
    case 'Upcoming':
      return <LockClockOutlinedIcon />;
    case 'Unsubmitted':
      return <CancelOutlinedIcon />;
    default:
    return null;
  }
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
        <h1>Program Assessments</h1>
      </Stack>

      <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
        <Tabs value={currentTab as number} onChange={handleChangeTab}>
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
            // value="activeTab"
            label="Active"
          />
          <Tab
            icon={
              <StyledBadge badgeContent={3} color="primary">
                <ArchiveOutlinedIcon />
              </StyledBadge>
            }
            iconPosition="start"
            // value="pastTab"

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
              <TableCellWrapper value={value} index={-1}>Status</TableCellWrapper>
              <TableCellWrapper value={value} index={-1}>Title</TableCellWrapper>
              <TableCellWrapper value={value} index={-1}>Type</TableCellWrapper>
              <TableCellWrapper value={value} index={1}>Due Date</TableCellWrapper>
              <TableCellWrapper value={value} index={1}>Test Duration</TableCellWrapper>
              <TableCellWrapper value={value} index={2}>Submit Date</TableCellWrapper>
              <TableCellWrapper value={value} index={2}>Score</TableCellWrapper>
              <TableCellWrapper value={value} index={3}>Available Date</TableCellWrapper>
              {(value !== 3) && <TableCell>Action</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(row => (
              <TableRowWrapper
                value={value}
                status={row.Status}
                key={row.Title}
              >
                <TableCellWrapper value={value} index={-1}>
                  <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    justifyContent="flex-start"
                    alignItems={{ xs: 'flex-start', md: 'center' }}
                  >
                    {renderIconByStatus(row.Status)}
                    <Typography variant="body2">{row.Status}</Typography>
                  </Stack>
                </TableCellWrapper>
                <TableCellWrapper value={value} index={-1}>{row.Title}</TableCellWrapper>
                <TableCellWrapper value={value} index={-1}>{row.Type}</TableCellWrapper>

                <TableCellWrapper value={value} index={0}>{row.dueDate}</TableCellWrapper>
                <TableCellWrapper value={value} index={0}>{row.testDuration}</TableCellWrapper>
                <TableCellWrapper value={value} index={1}>{row.submittedDate}</TableCellWrapper>
                <TableCellWrapper value={value} index={2}>{row.Score}</TableCellWrapper>
                <TableCellWrapper value={value} index={2}>{row.availableDate}</TableCellWrapper>
                <TableCellWrapper value={value} index={0}>
                  {/* {row.Status == action && 
                  <Button variant="contained" size="small">
                    Start
                  </Button>} */}
                </TableCellWrapper>
                <TableCellWrapper value={value} index={1}>
                  <Button variant="contained" size="small">
                    View
                  </Button>
                </TableCellWrapper>
              </TableRowWrapper>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default AssessmentPage;
