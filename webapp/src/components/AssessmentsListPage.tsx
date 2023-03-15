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
import { assessmentListPageExampleData as assessmentList } from '../assets/data';

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

const renderButtonByStatus = (status: string, id: number) => {
  let buttonLabel;
  switch (status) {
    case 'Active':
      buttonLabel = 'Start';
      break;
    case 'Submitted':
    case 'Graded':
    case 'Unsubmitted':
      buttonLabel = 'View';
      break;
    case 'Upcoming':
    default:
  }
  return (
    //TODO: use the latest submission id
    <Button variant="contained" size="small" href={`/assessments/${id}/0`}>
      {buttonLabel}
    </Button>
  );
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

const AssessmentsListPage = () => {
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
                  assessmentList.filter(
                    x =>
                      x.submissions_summary.assessment_submission_state ===
                      'Active'
                  ).length
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
        <Table sx={{ minWidth: 600 }} aria-label="List of assessments">
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
                status={
                  assessment.submissions_summary.assessment_submission_state
                }
                key={assessment.submissions_summary.assessment_submission_state}
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
                  <strong>{assessment.curriculum_assessment.title}</strong>
                  <br />
                  {assessment.curriculum_assessment.description}
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
                  {assessment.curriculum_assessment.assessment_type}
                </TableCellWrapper>
                <TableCellWrapper
                  statusTab={currentStatusTab}
                  index={[StatusTab.All, StatusTab.Active]}
                >
                  {formatDateTime(assessment.program_assessment.due_date)}
                </TableCellWrapper>
                <TableCellWrapper
                  statusTab={currentStatusTab}
                  index={[StatusTab.Past]}
                >
                  {(assessment.submissions_summary
                    .assessment_submission_state === 'Submitted' ||
                    assessment.submissions_summary
                      .assessment_submission_state === 'Graded') &&
                    formatDateTime(
                      assessment.submissions_summary.most_recent_submitted_date
                    )}
                </TableCellWrapper>
                <TableCellWrapper
                  statusTab={currentStatusTab}
                  index={[StatusTab.All, StatusTab.Past]}
                >
                  {assessment.submissions_summary.highest_score !== -1 &&
                    assessment.submissions_summary.highest_score}
                </TableCellWrapper>
                <TableCellWrapper
                  statusTab={currentStatusTab}
                  index={[StatusTab.Upcoming]}
                >
                  {formatDateTime(
                    assessment.program_assessment.available_after
                  )}
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
                  {renderChipByStatus(
                    assessment.submissions_summary.assessment_submission_state
                  )}
                </TableCellWrapper>
                <TableCellWrapper
                  statusTab={currentStatusTab}
                  index={[StatusTab.All, StatusTab.Active, StatusTab.Past]}
                >
                  {renderButtonByStatus(
                    assessment.submissions_summary.assessment_submission_state
                  )}
                </TableCellWrapper>
              </TableRowWrapper>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default AssessmentsListPage;
