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
import React, { useState } from 'react';
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
interface AssessmentRow {
  id: number;
  title: string;
  type: string;
  dueDate: string;
  testDuration: number;
  submittedDate: string;
  score: number;
  availableDate: string;
  status: string;
}

const assessmentList: AssessmentRow[] = [
  {
    id: 1,
    title: 'Debugging and Testing',
    type: 'Assignment',
    dueDate: '2023-03-25',
    testDuration: 0,
    submittedDate: '-',
    score: -1,
    availableDate: '2023-02-25',
    status: 'Active',
  },
  {
    id: 2,
    title: 'Communication and Documentation',
    type: 'Test',
    dueDate: '2023-03-24',
    testDuration: 60,
    submittedDate: '-',
    score: -1,
    availableDate: '2023-04-11',
    status: 'Active',
  },
  {
    id: 3,
    title: 'Accessibility in Design',
    type: 'Practice Quiz',
    dueDate: '2023-06-22',
    testDuration: 0,
    submittedDate: '2023-02-22',
    score: 90,
    availableDate: '2023-01-22',
    status: 'Graded',
  },
  {
    id: 4,
    title: 'Product-Minded Professional',
    type: 'Assignment',
    dueDate: '2023-05-23',
    testDuration: 0,
    submittedDate: '-',
    score: 0,
    availableDate: '2023-01-11',
    status: 'Unsubmitted',
  },
  {
    id: 5,
    title: 'Finalize the Product Specification',
    type: 'Test',
    dueDate: '2023-01-11',
    testDuration: 60,
    submittedDate: '2023-02-22',
    score: -1,
    availableDate: '2023-09-08',
    status: 'Submitted',
  },
  {
    id: 6,
    title: 'Leadership and Teamwork',
    type: 'Assignment',
    dueDate: '2023-03-27',
    testDuration: 0,
    submittedDate: '-',
    score: -1,
    availableDate: '2023-02-27',
    status: 'Upcoming',
  },
  {
    id: 7,
    title: 'Intermediate Git + GitHub ',
    type: 'Assignment',
    dueDate: '2023-01-25',
    testDuration: 60,
    submittedDate: '-',
    score: 0,
    availableDate: '2023-01-15',
    status: 'Unsubmitted',
  },
];

enum StatusTab {
  All,
  Active,
  Past,
  Upcoming,
}

interface TableCellWrapperProps {
  children?: React.ReactNode;
  index: number[];
  statusTab: number;
}
interface TableRowWrapperProps {
  children?: React.ReactNode;
  statusTab: number;
  status: string;
}

function TableCellWrapper(props: TableCellWrapperProps) {
  const { children, statusTab, index } = props;
  return index.includes(statusTab) ? <TableCell>{children}</TableCell> : null;
}

function TableRowWrapper(props: TableRowWrapperProps) {
  const { children, status, statusTab } = props;
  if (statusTab === StatusTab.All) {
    return <TableRow>{children}</TableRow>;
  }
  switch (status) {
    case 'Active':
      return statusTab === StatusTab.Active ? (
        <TableRow>{children}</TableRow>
      ) : null;
    case 'Upcoming':
      return statusTab === StatusTab.Upcoming ? (
        <TableRow>{children}</TableRow>
      ) : null;
    case 'Submitted':
    case 'Graded':
    case 'Unsubmitted':
    default:
      return statusTab === StatusTab.Past ? (
        <TableRow>{children}</TableRow>
      ) : null;
  }
}

function renderButtonByStatus(status: string) {
  switch (status) {
    case 'Active':
      return (
        <Button variant="contained" size="small">
          Start
        </Button>
      );
    case 'Submitted':
    case 'Graded':
      return (
        <Button variant="contained" size="small">
          View
        </Button>
      );
    case 'Upcoming':
    case 'Unsubmitted':
    default:
      return null;
  }
}

function renderChipByStatus(status: string) {
  switch (status) {
    case 'Active':
      return (
        <Chip
          variant="outlined"
          color="primary"
          size="small"
          icon={<ScheduleOutlinedIcon />}
          label="Active"
        />
      );
    case 'Submitted':
      return (
        <Chip
          variant="outlined"
          color="primary"
          size="small"
          icon={<CheckOutlinedIcon />}
          label="Submitted"
        />
      );
    case 'Graded':
      return (
        <Chip
          variant="outlined"
          color="success"
          size="small"
          icon={<DoneAllOutlinedIcon />}
          label="Graded"
        />
      );
    case 'Upcoming':
      return (
        <Chip
          variant="outlined"
          size="small"
          icon={<LockClockOutlinedIcon />}
          label="Upcoming"
        />
      );
    case 'Unsubmitted':
      return (
        <Chip
          variant="outlined"
          color="error"
          size="small"
          icon={<CancelOutlinedIcon />}
          label="Unsubmitted"
        />
      );
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
  const [currentStatusTab, setCurrentStatusTab] = useState(StatusTab.Active);
  const handleChangeTab = (
    event: React.SyntheticEvent,
    newCurrentStatusTab: number
  ) => {
    setCurrentStatusTab(newCurrentStatusTab);
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
        <Tabs value={currentStatusTab} onChange={handleChangeTab}>
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
              <StyledBadge badgeContent={assessmentList.filter(x => x.status === "Active").length} color="primary">
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
              <TableCellWrapper
                statusTab={currentStatusTab}
                index={[
                  StatusTab.All,
                  StatusTab.Active,
                  StatusTab.Past,
                  StatusTab.Upcoming,
                ]}
              >
                Title
              </TableCellWrapper>
              <TableCellWrapper
                statusTab={currentStatusTab}
                index={[
                  StatusTab.All,
                  StatusTab.Active,
                  StatusTab.Past,
                  StatusTab.Upcoming,
                ]}
              >
                Type
              </TableCellWrapper>
              <TableCellWrapper
                statusTab={currentStatusTab}
                index={[StatusTab.All, StatusTab.Active]}
              >
                Due Date
              </TableCellWrapper>
              <TableCellWrapper
                statusTab={currentStatusTab}
                index={[StatusTab.Active]}
              >
                Test Time Limit
              </TableCellWrapper>
              <TableCellWrapper
                statusTab={currentStatusTab}
                index={[StatusTab.Past]}
              >
                Submitted Date
              </TableCellWrapper>
              <TableCellWrapper
                statusTab={currentStatusTab}
                index={[StatusTab.All, StatusTab.Past]}
              >
                Score
              </TableCellWrapper>
              <TableCellWrapper
                statusTab={currentStatusTab}
                index={[StatusTab.Upcoming]}
              >
                Available Date
              </TableCellWrapper>
              <TableCellWrapper
                statusTab={currentStatusTab}
                index={[
                  StatusTab.All,
                  StatusTab.Active,
                  StatusTab.Past,
                  StatusTab.Upcoming,
                ]}
              >
                Status
              </TableCellWrapper>
              <TableCellWrapper
                statusTab={currentStatusTab}
                index={[StatusTab.All, StatusTab.Active, StatusTab.Past]}
              >
                Action
              </TableCellWrapper>
            </TableRow>
          </TableHead>
          <TableBody>
            {assessmentList.map(assessment => (
              <TableRowWrapper
                statusTab={currentStatusTab}
                status={assessment.status}
                key={assessment.id}
              >
                <TableCellWrapper
                  statusTab={currentStatusTab}
                  index={[
                    StatusTab.All,
                    StatusTab.Active,
                    StatusTab.Past,
                    StatusTab.Upcoming,
                  ]}
                >
                  {assessment.title}
                </TableCellWrapper>
                <TableCellWrapper
                  statusTab={currentStatusTab}
                  index={[
                    StatusTab.All,
                    StatusTab.Active,
                    StatusTab.Past,
                    StatusTab.Upcoming,
                  ]}
                >
                  {assessment.type}
                </TableCellWrapper>
                <TableCellWrapper
                  statusTab={currentStatusTab}
                  index={[StatusTab.All, StatusTab.Active]}
                >
                  {formatDateTime(assessment.dueDate)}
                </TableCellWrapper>
                <TableCellWrapper
                  statusTab={currentStatusTab}
                  index={[StatusTab.Active]}
                >
                  {assessment.type === 'Test' && assessment.testDuration}
                </TableCellWrapper>
                <TableCellWrapper
                  statusTab={currentStatusTab}
                  index={[StatusTab.Past]}
                >
                  {(assessment.status === 'Submitted' || assessment.status === 'Graded') &&
                    formatDateTime(assessment.submittedDate)}
                </TableCellWrapper>
                <TableCellWrapper
                  statusTab={currentStatusTab}
                  index={[StatusTab.All, StatusTab.Past]}
                >
                  {assessment.score !== -1 && assessment.score}
                </TableCellWrapper>
                <TableCellWrapper
                  statusTab={currentStatusTab}
                  index={[StatusTab.Upcoming]}
                >
                  {formatDateTime(assessment.availableDate)}
                </TableCellWrapper>
                <TableCellWrapper
                  statusTab={currentStatusTab}
                  index={[
                    StatusTab.All,
                    StatusTab.Active,
                    StatusTab.Past,
                    StatusTab.Upcoming,
                  ]}
                >
                  {renderChipByStatus(assessment.status)}
                </TableCellWrapper>
                <TableCellWrapper
                  statusTab={currentStatusTab}
                  index={[StatusTab.All, StatusTab.Active, StatusTab.Past]}
                >
                  {renderButtonByStatus(assessment.status)}
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
