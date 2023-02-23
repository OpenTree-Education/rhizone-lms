import { Box, Container, Grid, Stack, Button } from '@mui/material';
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

function createData(
  Title: string,
  dueDate: string,
  Type: string,
  submittedDate: string,
  Status: string,
  availableDate: string,
  Score: number,
  testDuration: number
) {
  return {
    dueDate,
    Title,
    Type,
    submittedDate,
    Status,
    availableDate,
    Score,
    testDuration,
  };
}

const rows = [
  createData(
    '25-3-2023',
    'Assessment 1',
    'Assignment',
    '',
    'Active',
    '25-2-2023',
    30,
    60
  ),
  createData(
    '25-3-2023',
    'Assessment 1',
    'Assignment',
    '',
    'Active',
    '25-2-2023',
    30,
    60
  ),
  createData(
    '25-3-2023',
    'Assessment 1',
    'Assignment',
    '',
    'Active',
    '25-2-2023',
    30,
    60
  ),
  createData(
    '25-3-2023',
    'Assessment 1',
    'Assignment',
    '',
    'Submitted',
    '25-2-2023',
    30,
    60
  ),
  createData(
    '25-3-2023',
    'Assessment 1',
    'Assignment',
    '',
    'Graded',
    '25-2-2023',
    30,
    60
  ),
  createData(
    '25-3-2023',
    'Assessment 1',
    'Assignment',
    '',
    'Upcoming',
    '25-2-2023',
    30,
    60
  ),
  createData(
    '25-3-2023',
    'Assessment 1',
    'Assignment',
    '',
    'Unsubmitted',
    '25-2-2023',
    30,
    60
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
  return index === -1 || index === value? 
  <TableCell>{children}</TableCell> 
  : null;
}

function TableRowWrapper(props: TableRowWrapperProps) {
  const { children, status, value, ...other } = props;
  switch(status) {
    case 'Active':
      return value === 0?<TableRow>{children}</TableRow>:null;
    case 'Upcoming':
      return value === 2?<TableRow>{children}</TableRow>:null;    
    case 'Submitted':
    case 'Graded':
    case 'Unsubmitted':
    default:
    return value === 1?<TableRow>{children}</TableRow>:null;
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
        <h1>Assessment</h1>
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
              <StyledBadge badgeContent={4} color="primary">
                <ScheduleOutlinedIcon />
              </StyledBadge>
            }
            iconPosition="start"
            label="Active"
          />
          <Tab
            icon={<ArchiveOutlinedIcon />}
            iconPosition="start"
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
              <TableCellWrapper value={value} index={-1}>Status</TableCellWrapper>
              <TableCellWrapper value={value} index={-1}>Title</TableCellWrapper>
              <TableCellWrapper value={value} index={-1}>Type</TableCellWrapper>
              <TableCellWrapper value={value} index={0}>Due Date</TableCellWrapper>
              <TableCellWrapper value={value} index={0}>Test Duration</TableCellWrapper>
              <TableCellWrapper value={value} index={1}>Submit Date</TableCellWrapper>
              <TableCellWrapper value={value} index={1}>Score</TableCellWrapper>
              <TableCellWrapper value={value} index={2}>Available Date</TableCellWrapper>
              <TableCellWrapper value={value} index={0}></TableCellWrapper>
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
                <TableCellWrapper value={value} index={1}>{row.Score}</TableCellWrapper>
                <TableCellWrapper value={value} index={2}>{row.availableDate}</TableCellWrapper>
                <TableCellWrapper value={value} index={0}>
                  <Button variant="contained" size="small">
                    Open
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
