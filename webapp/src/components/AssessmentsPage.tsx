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

const TableCellWrapper = (props: TableCellWrapperProps) => {
  const { children, statusTab, index } = props;
  return index.includes(statusTab) ? <TableCell>{children}</TableCell> : null;
};

const TableRowWrapper = (props: TableRowWrapperProps) => {
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
};

const renderButtonByStatus = (status: string) => {
  switch (status) {
    case 'Active':
      return (
        <Button variant="contained" size="small">
          Start
        </Button>
      );
    case 'Submitted':
    case 'Graded':
    case 'Unsubmitted':
      return (
        <Button variant="contained" size="small">
          View
        </Button>
      );
    case 'Upcoming':
    default:
      return null;
  }
};

const renderChipByStatus = (status: string) => {
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
};

const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
  '& .MuiBadge-badge': {
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}));

const AssessmentsPage = () => {
  const [currentStatusTab, setCurrentStatusTab] = useState(StatusTab.Active);
  const handleChangeTab = (
    event: React.SyntheticEvent,
    newCurrentStatusTab: number
  ) => {
    setCurrentStatusTab(newCurrentStatusTab);
  };

  if (assessmentList.length === 0) {
    return (
      <Container>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', md: 'center' }}
        >
          <h1>Assessments</h1>
        </Stack>

        <div style={{ padding: '20px' }}>
          You have no available assessments at this time.
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', md: 'center' }}
      >
        <h1>Assessments</h1>
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
              <StyledBadge
                badgeContent={
                  assessmentList.filter(x => x.status === 'Active').length
                }
                color="primary"
              >
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
            <TableRow
              sx={{
                backgroundColor: '#333',
                borderBottom: '2px solid black',
                '& th': {
                  fontSize: '1rem',
                  color: 'white',
                  fontWeight: 'bold',
                },
              }}
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
                Assessment Name
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
                  <strong>{assessment.title}</strong>
                  <br />
                  {assessment.description}
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
                  index={[StatusTab.Past]}
                >
                  {(assessment.status === 'Submitted' ||
                    assessment.status === 'Graded') &&
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

export default AssessmentsPage;
