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
import { AssessmentWithSummary } from '../types/api';
import { StatusTab } from './AssessmentsListPage';

interface TableCellWrapperProps {
  children?: React.ReactNode;
  index: number[];
  statusTab: number;
  showForFacilitator: boolean;
  showForParticipant: boolean;
  principalRoles: {
    isFacilitator: boolean;
    isParticipant: boolean;
    isMixedRole: boolean;
    isNeither: boolean;
  };
}

const TableCellWrapper = (props: TableCellWrapperProps) => {
  const {
    children,
    statusTab,
    index,
    showForFacilitator,
    showForParticipant,
    principalRoles,
  } = props;
  return index.includes(statusTab) &&
    ((showForFacilitator &&
      (principalRoles.isFacilitator || principalRoles.isMixedRole)) ||
      (showForParticipant &&
        (principalRoles.isParticipant || principalRoles.isMixedRole))) ? (
    <TableCell>{children}</TableCell>
  ) : null;
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

export const renderChipByStatus = (status: string) => {
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
  matchingAssessmentList: AssessmentWithSummary[];
  userRoles: {
    isFacilitator: boolean;
    isParticipant: boolean;
    isMixedRole: boolean;
    isNeither: boolean;
  };
}

// For Participants:
//   For All Assessments Tab:
//     - Assessment Name, Type, Due Date, Score, State, Action
//   For Active Assessments Tab:
//     - Assessment Name, Type, Due Date, State, Action
//   For Past Assessments Tab:
//     - Assessment Name, Type, Due Date, Submitted Date, Score, State, Action
//   For Upcoming Assessments Tab:
//     - Assessment Name, Type, Available Date, Due Date

// For Facilitators:
//   For All Assessments Tab:
//     - Assessment Name, Type, Due Date, Num Submissions, Ungraded, Action
//   For Active Assessments Tab:
//     - Assessment Name, Type, Due Date, Num Submissions, Action
//   For Past Assessments Tab:
//     - Assessment Name, Type, Due Date, Num Submissions, Ungraded, Action
//   For Upcoming Assessments Tab:
//     - Assessment Name, Type, Available Date, Due Date, Action

// Combined:
//   For All Assessments Tab:
//     - Assessment Name, Type, Due Date, Num Submissions (F), Score (P), Ungraded (F), State (P), Action
//   For Active Assessments Tab:
//     - Assessment Name, Type, Due Date, Num Submissions (F), State (P), Action
//   For Past Assessments Tab:
//     - Assessment Name, Type, Due Date, Submitted Date (P), Num Submissions (F), Score (P), Ungraded (F), State (P), Action
//   For Upcoming Assessments Tab:
//     - Assessment Name, Type, Available Date, Due Date, Action

// Total Combined
//     - Assessment Name, Type, Available Date, Due Date, Submitted Date (P), Num Submissions (F), Score (P), Ungraded (F), State (P), Action

// For the Num Submissions, Ungraded Columns:
//    "3 (of 8)", aka "num ungraded/p with sub (of total num participants)"

const AssessmentsListTable = ({
  currentStatusTab,
  matchingAssessmentList,
  userRoles,
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
              showForFacilitator={true}
              showForParticipant={true}
              principalRoles={userRoles}
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
              showForFacilitator={true}
              showForParticipant={true}
              principalRoles={userRoles}
            >
              Type
            </TableCellWrapper>
            <TableCellWrapper
              statusTab={currentStatusTab}
              index={[StatusTab.All, StatusTab.Active, StatusTab.Past]}
              showForFacilitator={true}
              showForParticipant={true}
              principalRoles={userRoles}
            >
              Due Date
            </TableCellWrapper>
            <TableCellWrapper
              statusTab={currentStatusTab}
              index={[StatusTab.Past]}
              showForFacilitator={false}
              showForParticipant={true}
              principalRoles={userRoles}
            >
              Submitted Date
            </TableCellWrapper>
            <TableCellWrapper
              statusTab={currentStatusTab}
              index={[StatusTab.All, StatusTab.Active, StatusTab.Past]}
              showForFacilitator={true}
              showForParticipant={false}
              principalRoles={userRoles}
            >
              Num Submissions
            </TableCellWrapper>
            <TableCellWrapper
              statusTab={currentStatusTab}
              index={[StatusTab.All, StatusTab.Past]}
              showForFacilitator={true}
              showForParticipant={false}
              principalRoles={userRoles}
            >
              Ungraded
            </TableCellWrapper>
            <TableCellWrapper
              statusTab={currentStatusTab}
              index={[StatusTab.All, StatusTab.Past]}
              showForFacilitator={false}
              showForParticipant={true}
              principalRoles={userRoles}
            >
              Score
            </TableCellWrapper>
            <TableCellWrapper
              statusTab={currentStatusTab}
              index={[StatusTab.Upcoming]}
              showForFacilitator={true}
              showForParticipant={true}
              principalRoles={userRoles}
            >
              Available Date
            </TableCellWrapper>
            <TableCellWrapper
              statusTab={currentStatusTab}
              index={[StatusTab.Upcoming]}
              showForFacilitator={true}
              showForParticipant={true}
              principalRoles={userRoles}
            >
              available date
            </TableCellWrapper>

            <TableCellWrapper
              statusTab={currentStatusTab}
              index={[StatusTab.All, StatusTab.Active, StatusTab.Past]}
              showForFacilitator={true}
              showForParticipant={true}
              principalRoles={userRoles}
            >
              State
            </TableCellWrapper>

            <TableCellWrapper
              statusTab={currentStatusTab}
              index={[StatusTab.All, StatusTab.Active, StatusTab.Past]}
              showForFacilitator={true}
              showForParticipant={true}
              principalRoles={userRoles}
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
                showForFacilitator={true}
                showForParticipant={true}
                principalRoles={userRoles}
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
                showForFacilitator={true}
                showForParticipant={true}
                principalRoles={userRoles}
              >
                {assessment.curriculum_assessment.assessment_type[0].toLocaleUpperCase() +
                  assessment.curriculum_assessment.assessment_type.slice(1)}
              </TableCellWrapper>
              <TableCellWrapper
                statusTab={currentStatusTab}
                index={[StatusTab.All, StatusTab.Active]}
                showForFacilitator={true}
                showForParticipant={true}
                principalRoles={userRoles}
              >
                {formatDateTime(assessment.program_assessment.due_date)}
              </TableCellWrapper>
              <TableCellWrapper
                statusTab={currentStatusTab}
                index={[StatusTab.Active]}
                showForFacilitator={true}
                showForParticipant={true}
                principalRoles={userRoles}
              >
                {formatDateTime(assessment.program_assessment.available_after)}
              </TableCellWrapper>

              <TableCellWrapper
                statusTab={currentStatusTab}
                index={[StatusTab.Past]}
                showForFacilitator={false}
                showForParticipant={true}
                principalRoles={userRoles}
              >
                {(assessment.participant_submissions_summary?.highest_state ===
                  'Submitted' ||
                  assessment.participant_submissions_summary?.highest_state ===
                    'Graded' ||
                  assessment.participant_submissions_summary?.highest_state ===
                    'Expired') &&
                  assessment.participant_submissions_summary
                    ?.most_recent_submitted_date &&
                  formatDateTime(
                    assessment.participant_submissions_summary
                      ?.most_recent_submitted_date
                  )}
              </TableCellWrapper>
              <TableCellWrapper
                statusTab={currentStatusTab}
                index={[StatusTab.All, StatusTab.Past]}
                showForFacilitator={false}
                showForParticipant={true}
                principalRoles={userRoles}
              >
                {assessment.participant_submissions_summary?.highest_score !==
                  -1 &&
                  assessment.participant_submissions_summary?.highest_score}
              </TableCellWrapper>
              <TableCellWrapper
                statusTab={currentStatusTab}
                index={[StatusTab.Upcoming]}
                showForFacilitator={true}
                showForParticipant={true}
                principalRoles={userRoles}
              >
                {formatDateTime(assessment.program_assessment.available_after)}
              </TableCellWrapper>
              <TableCellWrapper
                statusTab={currentStatusTab}
                index={[StatusTab.Active]}
                showForFacilitator={true}
                showForParticipant={true}
                principalRoles={userRoles}
              >
                {formatDateTime(assessment.program_assessment.due_date)}
              </TableCellWrapper>
              <TableCellWrapper
                statusTab={currentStatusTab}
                index={[
                  StatusTab.All,
                  StatusTab.Active,
                  StatusTab.Past,
                  StatusTab.Upcoming,
                ]}
                showForFacilitator={false}
                showForParticipant={true}
                principalRoles={userRoles}
              >
                {assessment.participant_submissions_summary &&
                  assessment.program_assessment.id &&
                  renderChipByStatus(
                    assessment.participant_submissions_summary.highest_state
                  )}
              </TableCellWrapper>
              <TableCellWrapper
                statusTab={currentStatusTab}
                index={[StatusTab.All, StatusTab.Active, StatusTab.Past]}
                showForFacilitator={false}
                showForParticipant={true}
                principalRoles={userRoles}
              >
                {assessment.participant_submissions_summary &&
                  assessment.program_assessment.id &&
                  renderButtonByStatus(
                    assessment.participant_submissions_summary.highest_state,
                    Number(assessment.program_assessment.id)
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
