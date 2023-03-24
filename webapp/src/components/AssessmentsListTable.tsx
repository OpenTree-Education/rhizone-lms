import React from 'react';

import {
  Chip,
  Button,
  Paper,
  TableRow,
  TableHead,
  TableContainer,
  TableCell,
  TableBody,
  Table,
} from '@mui/material';

import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import DoneAllOutlinedIcon from '@mui/icons-material/DoneAllOutlined';
import LockClockOutlinedIcon from '@mui/icons-material/LockClockOutlined';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';

import { formatDateTime } from '../helpers/dateTime';
import { AssessmentSummary } from '../types/api';
import { StatusTab } from './AssessmentsListPage';

interface TableCellWrapperProps {
  children?: React.ReactNode;
  index: number[];
  statusTab: number;
}

const TableCellWrapper = (props: TableCellWrapperProps) => {
  const { children, statusTab, index } = props;
  return index.includes(statusTab) ? <TableCell>{children}</TableCell> : null;
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
    case 'Expired':
      buttonLabel = 'View';
      break;
    case 'Upcoming':
    default:
  }
  if (status !== 'Upcoming') {
    return (
      //TODO: use the latest submission id
      <Button variant="contained" size="small" href={`/assessments/${id}/0`}>
        {buttonLabel}
      </Button>
    );
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
    case 'Expired':
      return (
        <Chip
          variant="outlined"
          color="error"
          size="small"
          icon={<CancelOutlinedIcon />}
          label="Expired"
        />
      );
    default:
      return null;
  }
};

interface AssessmentListTableProps {
  currentStatusTab: StatusTab;
  matchingAssessmentList: AssessmentSummary[];
}

const AssessmentsListTable = ({
  currentStatusTab,
  matchingAssessmentList,
}: AssessmentListTableProps) => {
  return (
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
          {matchingAssessmentList.map(assessment => (
            <TableRow key={assessment.program_assessment.id}>
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
                {(assessment.submissions_summary.assessment_submission_state ===
                  'Submitted' ||
                  assessment.submissions_summary.assessment_submission_state ===
                    'Graded' ||
                  assessment.submissions_summary.assessment_submission_state ===
                    'Expired') &&
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
                {formatDateTime(assessment.program_assessment.available_after)}
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
                {assessment.program_assessment.id &&
                  renderButtonByStatus(
                    assessment.submissions_summary.assessment_submission_state,
                    assessment.program_assessment.id
                  )}
              </TableCellWrapper>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AssessmentsListTable;
