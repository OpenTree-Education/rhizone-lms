import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { useParams } from 'react-router-dom';
import { FormGroup, FormControlLabel, Switch, CircularProgress } from '@mui/material';
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
import { renderChipByStatus } from './AssessmentsListTable';
import { AssessmentWithSubmissions } from '../types/api';
import { formatDateTime } from '../helpers/dateTime';
import useApiData from '../helpers/useApiData';

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

  if (!assessmentSub || assessmentSub.submissions.length === 0) {
    return (
      <Container>
        <p>No submissions.</p>
      </Container>
    );
  }


  const ButtonWrapper = () => {
    if (
      new Date(assessmentSub.program_assessment.due_date) > new Date() &&
      assessmentSub.curriculum_assessment.max_num_submissions >
        assessmentSub.submissions.length
    ) {
      return (
        <Button
          href={`/assessments/${assessmentIdNumber}/submission/new`}
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
if (error) {
    return (
      <Container fixed>
        <p>There was an error loading the assessments list.</p>
      </Container>
    );
  }

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={9}>
          <h1>{assessmentSub.curriculum_assessment.title}</h1>
          <p>{assessmentSub.curriculum_assessment.description}</p>
        </Grid>
        <Grid item xs={3}>
          <Stack
            direction="row"
            justifyContent="flex-end"
            alignItems="flex-end"
            spacing={2}
            sx={{ height: '100%' }}
          >
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={isFacilitator}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      setIsFacilitator(event.target.checked);
                    }}
                    name="isFacilitator"
                  />
                }
                label="Facilitator mode"
              />
            </FormGroup>
          </Stack>
        </Grid>

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
                          href={`/assessments/${assessmentIdNumber}/submission/${submission.id}`}
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

        <Grid item xs={12} sx={{ justifyContent: 'flex-end' }}>
          <Stack
            direction="row"
            justifyContent="flex-end"
            alignItems="flex-end"
            spacing={2}
          >
            <ButtonWrapper />
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AssessmentSubmissionsListPage;
