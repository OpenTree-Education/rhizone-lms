import React, { useState, useEffect } from 'react';
import { DateTime } from 'luxon';

import { styled } from '@mui/material/styles';
import { useParams } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import { formatDateTime } from '../helpers/dateTime';
import useApiData from '../helpers/useApiData';
import { AssessmentWithSubmissions } from '../types/api';

import { renderChipByStatus } from './AssessmentsListTable';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    textAlign: 'center',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    textAlign: 'center',
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const AssessmentSubmissionsListPage = () => {
  const { assessmentId } = useParams();
  const assessmentIdNumber = Number(assessmentId);
  const [isFacilitator, setIsFacilitator] = useState(false);

  const {
    data: assessmentSub,
    error,
    isLoading,
  } = useApiData<AssessmentWithSubmissions>({
    deps: [],
    path: `/assessments/program/${assessmentId}/submissions`,
    sendCredentials: true,
  });

  useEffect(() => {
    if (assessmentSub) {
      if (assessmentSub.principal_program_role === 'Facilitator') {
        setIsFacilitator(true);
      } else {
        setIsFacilitator(false);
      }
    }
  }, [assessmentSub]);

  if (!assessmentSub || error) {
    return (
      <Container fixed>
        <p>There was an error loading the assessment submissions list.</p>
        <Button href={'/assessments'} variant="outlined">
          &laquo; Assessments List
        </Button>
      </Container>
    );
  }

  const NewSubmissionButton = () => {
    if (
      DateTime.fromISO(assessmentSub.program_assessment.available_after) <
        DateTime.now() &&
      DateTime.fromISO(assessmentSub.program_assessment.due_date) >
        DateTime.now() &&
      (!assessmentSub.submissions ||
        assessmentSub.curriculum_assessment.max_num_submissions >
          assessmentSub.submissions.length) &&
      !isFacilitator
    ) {
      return (
        <Button
          href={`/assessments/${assessmentIdNumber}/new`}
          variant="contained"
        >
          New Submission
        </Button>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <Stack
        alignItems="center"
        justifyContent="center"
        sx={{ height: '40em' }}
      >
        <CircularProgress size={100} disableShrink />
      </Stack>
    );
  }

  const SubmissionsHeader = () => {
    return (
      <Grid item xs={12}>
        <h1>{assessmentSub.curriculum_assessment.title}</h1>
        <p>{assessmentSub.curriculum_assessment.description}</p>
        {DateTime.now() <
          DateTime.fromISO(
            assessmentSub.program_assessment.available_after
          ) && (
          <p>
            <strong>Available After:</strong>{' '}
            {formatDateTime(assessmentSub.program_assessment.available_after)}
          </p>
        )}
        <p>
          <strong>Due Date:</strong>{' '}
          {formatDateTime(assessmentSub.program_assessment.due_date)}
        </p>
      </Grid>
    );
  };

  const SubmissionsFooter = () => {
    return (
      <Grid item xs={12} sx={{ justifyContent: 'flex-end' }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-end"
          spacing={2}
        >
          <Button href={'/assessments'} variant="outlined">
            &laquo; Assessments List
          </Button>
          <NewSubmissionButton />
        </Stack>
      </Grid>
    );
  };

  if (!assessmentSub.submissions || assessmentSub.submissions.length === 0) {
    return (
      <Container>
        <Grid container spacing={2}>
          <SubmissionsHeader />
          <Grid item xs={12}>
            <p>No submissions for this program assessment.</p>
          </Grid>
          <SubmissionsFooter />
        </Grid>
      </Container>
    );
  }

  return (
    <Container>
      <Grid container spacing={2}>
        <SubmissionsHeader />
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  {isFacilitator ? (
                    <StyledTableCell>Participant ID</StyledTableCell>
                  ) : null}
                  <StyledTableCell>Submission ID</StyledTableCell>
                  <StyledTableCell>State</StyledTableCell>
                  <StyledTableCell>Opened At</StyledTableCell>
                  <StyledTableCell>Submitted At</StyledTableCell>
                  <StyledTableCell>Score</StyledTableCell>
                  <StyledTableCell>Action</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {assessmentSub.submissions.map(submission => (
                  <StyledTableRow
                    key={submission.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    {isFacilitator ? (
                      <StyledTableCell>
                        {submission.principal_id}
                      </StyledTableCell>
                    ) : null}
                    <StyledTableCell component="th" scope="submission">
                      {submission.id}
                    </StyledTableCell>
                    <StyledTableCell>
                      {renderChipByStatus(
                        submission.assessment_submission_state
                      )}
                    </StyledTableCell>
                    <StyledTableCell>
                      {formatDateTime(submission.opened_at)}
                    </StyledTableCell>
                    <StyledTableCell>
                      {submission.submitted_at &&
                        formatDateTime(submission.submitted_at)}
                    </StyledTableCell>
                    <StyledTableCell>{submission.score}</StyledTableCell>
                    <StyledTableCell>
                      {isFacilitator ? (
                        submission.assessment_submission_state === 'Graded' ? (
                          <Button
                            variant="contained"
                            size="small"
                            href={`/assessments/${assessmentIdNumber}/${submission.id}`}
                          >
                            View
                          </Button>
                        ) : (
                          <Button
                            variant="contained"
                            size="small"
                            href={`/assessments/${assessmentIdNumber}/${submission.id}`}
                          >
                            Grade
                          </Button>
                        )
                      ) : (
                        <Button
                          variant="contained"
                          size="small"
                          href={`/assessments/${assessmentIdNumber}/${submission.id}`}
                        >
                          Review
                        </Button>
                      )}
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <SubmissionsFooter />
      </Grid>
    </Container>
  );
};

export default AssessmentSubmissionsListPage;
