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
  title: string,
  type: string,
  dueDate: string,
  testDuration: number,
  submittedDate: string,
  score: number,
  availableDate: string,
  status: string
) {
  return {
    id,
    title,
    type,
    dueDate,
    testDuration,
    submittedDate,
    score,
    availableDate,
    status,
  };
}

const rows = [
  createData(
    1,
    'Debugging and Testing',
    'Assignment',
    '2023-03-25',
    0,
    '-',
    0,
    '2023-02-25',
    'Active'
  ),
  createData(
    2,
    'Communication and Documentation',
    'Test',
    '2023-03-24',
    60,
    '-',
    0,
    '2023-04-11',
    'Active'
  ),
  createData(
    3,
    'Accessibility in Design',
    'Practice Quiz',
    '2023-06-22',
    0,
    '2023-02-22',
    90,
    '2023-01-22',
    'Graded'
  ),
  createData(
    4,
    'Product-Minded Professional',
    'Assignment',
    '2023-05-23',
    0,
    '-',
    0,
    '2023-01-11',
    'Unsubmitted'
  ),
  createData(
    5,
    'Finalize the Product Specification',
    'Test',
    '2023-01-11',
    60,
    '2023-02-22',
    -1,
    '2023-09-08',
    'Submitted'
  ),
  createData(
    6,
    'Leadership and Teamwork',
    'Assignment',
    '2023-03-27',
    0,
    '-',
    0,
    '2023-02-27',
    'Upcoming'
  ),
  createData(
    7,
    'Intermediate Git + GitHub ',
    'Assignment',
    '2023-01-25',
    60,
    '-',
    0,
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
                Test Time Limit
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
              <TableRowWrapper value={value} status={row.status} key={row.id}>
                <TableCellWrapper value={value} index={-1}>
                  {row.title}
                </TableCellWrapper>
                <TableCellWrapper value={value} index={-1}>
                  {row.type}
                </TableCellWrapper>
                <TableCellWrapper value={value} index={1}>
                  {row.dueDate}
                </TableCellWrapper>
                <TableCellWrapper value={value} index={1}>
                  {row.type === "Test" && row.testDuration}
                </TableCellWrapper>
                <TableCellWrapper value={value} index={2}>
                  {row.submittedDate}
                </TableCellWrapper>
                <TableCellWrapper value={value} index={2}>
                  {row.score !== -1 && row.score}
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
                    {renderIconByStatus(row.status)}
                  </Stack>
                </TableCellWrapper>
                {row.status === 'Active' && (
                  <TableCellWrapper value={value} index={1}>
                    <Button variant="contained" size="small">
                      Start
                    </Button>
                  </TableCellWrapper>
                )}
                {row.status === 'Upcoming' && (
                  <TableCellWrapper value={value} index={3}>
                    <Button disabled variant="contained" size="small">
                      Inactive
                    </Button>
                  </TableCellWrapper>
                )}
                {(row.status === 'Graded' ||
                  row.status === 'Unsubmitted' ||
                  row.status === 'Submitted') && (
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
