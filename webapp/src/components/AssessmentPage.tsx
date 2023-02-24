import {
  Box,
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
import React, { useState } from 'react';
import Badge, { BadgeProps } from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import DoneAllOutlinedIcon from '@mui/icons-material/DoneAllOutlined';
import DoneOutlinedIcon from '@mui/icons-material/DoneOutlined';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined';
import UpcomingOutlinedIcon from '@mui/icons-material/UpcomingOutlined';
import LockClockOutlinedIcon from '@mui/icons-material/LockClockOutlined';
import AssessmentIcon from '@mui/icons-material/Assessment';

function createData(
  id: number,
  Title: string,
  Type: string,
  dueDate: string,
  testDuration: number,
  submittedDate: string,
  Score: number,
  availableDate: string,
  Status: string
) {
  return {
    id,
    Title,
    Type,
    dueDate,
    testDuration,
    submittedDate,
    Score,
    availableDate,
    Status,
  };
}

const rows = [
  createData(
    1,
    'Assessment 1',
    'Assignment',
    '2023-03-25',
    60,
    '-',
    0,
    '2023-02-25',
    'Active'
  ),
  createData(
    2,
    'Assessment 2',
    'Assignment',
    '2023-03-24',
    60,
    '-',
    0,
    '2023-04-11',
    'Active'
  ),
  createData(
    3,
    'Assessment 3',
    'Assignment',
    '2023-06-22',
    60,
    '-',
    0,
    '2023-12-22',
    'Graded'
  ),
  createData(
    4,
    'Assessment 4',
    'Assignment',
    '2023-05-23',
    60,
    '-',
    0,
    '2023-01-11',
    'Unsubmitted'
  ),
  createData(
    5,
    'Assessment 5',
    'Assignment',
    '25-3-2023-01-11',
    60,
    '-',
    0,
    '2023-09-08',
    'Submitted'
  ),
  createData(
    6,
    'Assessment 6',
    'Assignment',
    '-',
    0,
    '-',
    0,
    '2023-11-11',
    'Upcoming'
  ),
  createData(
    7,
    'Assessment 7',
    'Assignment',
    '-',
    60,
    '2023-01-29',
    40,
    '-',
    'Unsubmitted'
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
  return index === -1 || index === value || value === 0 ? (
    <TableCell>{children}</TableCell>
  ) : null;
}

function TableRowWrapper(props: TableRowWrapperProps) {
  const { children, status, value, ...other } = props;
  if (value === 0) {
    return <TableRow>{children}</TableRow>;
  }
  switch (status) {
    case 'Active':
      return value === 1 ? <TableRow>{children}</TableRow> : null;
    case 'Upcoming':
      return value === 3 ? <TableRow>{children}</TableRow> : null;
    case 'Submitted':
    case 'Graded':
    case 'Unsubmitted':
    default:
      return value === 2 ? <TableRow>{children}</TableRow> : null;
  }
}

function renderIconByStatus(status: string) {
  switch (status) {
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
    case 'Past':
      return;
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
  const [expanded, setExpanded] = useState<string | false>('panel1');
  const [value, setValue] = useState(0);

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

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
              <StyledBadge color="primary">
                <AssessmentIcon />
              </StyledBadge>
            }
            iconPosition="start"
            label="All"
          />
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
            icon={
              <StyledBadge color="primary">
                <ArchiveOutlinedIcon />
              </StyledBadge>
            }
            iconPosition="start"
            label="Past"
          />
          <Tab
            icon={
              <StyledBadge color="primary">
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
              <TableCellWrapper value={value} index={-1}>
                Title
              </TableCellWrapper>
              <TableCellWrapper value={value} index={-1}>
                Type
              </TableCellWrapper>
              <TableCellWrapper value={value} index={1}>
                Due Date
              </TableCellWrapper>
              <TableCellWrapper value={value} index={1}>
                Test Duration
              </TableCellWrapper>
              <TableCellWrapper value={value} index={2}>
                Submitted Date
              </TableCellWrapper>
              <TableCellWrapper value={value} index={2}>
                Score
              </TableCellWrapper>
              <TableCellWrapper value={value} index={3}>
                Available Date
              </TableCellWrapper>
              <TableCellWrapper value={value} index={-1}>
                Status
              </TableCellWrapper>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(row => (
              <TableRowWrapper value={value} status={row.Status} key={row.id}>
                <TableCellWrapper value={value} index={-1}>
                  {row.Title}
                </TableCellWrapper>
                <TableCellWrapper value={value} index={-1}>
                  {row.Type}
                </TableCellWrapper>
                <TableCellWrapper value={value} index={1}>
                  {row.dueDate}
                </TableCellWrapper>
                <TableCellWrapper value={value} index={1}>
                  {row.testDuration}
                </TableCellWrapper>
                <TableCellWrapper value={value} index={2}>
                  {row.submittedDate}
                </TableCellWrapper>
                <TableCellWrapper value={value} index={2}>
                  {row.Score}
                </TableCellWrapper>
                <TableCellWrapper value={value} index={3}>
                  {row.availableDate}
                </TableCellWrapper>
                <TableCellWrapper value={value} index={-1}>
                  <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    justifyContent="flex-start"
                    alignItems={{ xs: 'flex-start', md: 'center' }}
                  >
                    {renderIconByStatus(row.Status)}
                  </Stack>
                  {/* {row.Status == action && 
                  <Button variant="contained" size="small">
                    Start
                  </Button>} */}
                </TableCellWrapper>
                {row.Status === 'Active' && (
                  <TableCellWrapper value={value} index={1}>
                    <Button variant="contained" size="small">
                      Start
                    </Button>
                  </TableCellWrapper>
                )}
                {row.Status === 'Upcoming' && (
                  <TableCellWrapper value={value} index={3}>
                    <Button disabled variant="contained" size="small">
                      Inactive
                    </Button>
                  </TableCellWrapper>
                )}
                {(row.Status === 'Graded' ||
                  row.Status === 'Unsubmitted' ||
                  row.Status === 'Submitted') && (
                  <TableCellWrapper value={value} index={2}>
                    <Button variant="contained" size="small">
                      View
                    </Button>
                  </TableCellWrapper>
                )}
              </TableRowWrapper>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default AssessmentPage;
