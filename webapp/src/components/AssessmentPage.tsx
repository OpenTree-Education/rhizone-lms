import { Box, Container, Grid, Stack, Button} from '@mui/material';
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
  Type: string,
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
    Type,
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
    'Assignment',
    '',
    '',
    '25-2-2023',
    '1h',
    '18-2-2023',
    ''
  ),
  createData('Upcoming', 'Assigment 5', 'Assignment', '', '', '10-3-2023', '-', '', ''),
  createData('Upcoming', 'Assigment 6', 'Assignment', '', '', '17-3-2023', '-', '', ''),
  createData('Upcoming', 'Assigment 7', 'Assignment', '', '', '29-3-2023', '-', '', ''),
  createData(
    'Submitted',
    'Assigment 3',
    'Assignment',
    '100',
    '60/60',
    '15-2-2023',
    '30m',
    '8-2-2023',
    '15-2-2023 23:59'
  ),
  createData(
    'Unsubmitted',
    'Assigment 2',
    'Assignment',
    '85',
    '60/70',
    '25-1-2023',
    '45m',
    '25-1-2023',
    '25-1-2023 13:15'
  ),
  createData(
    'Graded',
    'Assigment 1',
    'Assignment',
    '70',
    '70/100',
    '18-1-2023',
    '1h',
    '10-1-2023',
    '11-1-2023 10:00'
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
