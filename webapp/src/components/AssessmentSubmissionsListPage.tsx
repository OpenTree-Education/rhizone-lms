import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { useParams } from 'react-router-dom';
import { FormGroup, FormControlLabel, Switch } from '@mui/material';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import { assessmentDetailPageExampleData } from '../assets/data';
import { renderChipByStatus } from './AssessmentsListPage';
import { SubmittedAssessment } from '../types/api';
import { formatDateTime } from '../helpers/dateTime';

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
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const submissionsExample = [
  {
    id: 17,
    assessment_id: 1,
    principal_id: 3,
    assessment_submission_state: 'Graded',
    score: 7,
    opened_at: '2023-03-15 01:23:45',
    submitted_at: '2023-03-15 02:32:54',
  },
  {
    id: 18,
    assessment_id: 1,
    principal_id: 3,
    assessment_submission_state: 'Submitted',
    opened_at: '2023-03-15 07:45:00',
    submitted_at: '2023-03-15 08:15:00',
  },
  {
    id: 19,
    assessment_id: 1,
    principal_id: 4,
    assessment_submission_state: 'Submitted',
    opened_at: '2023-03-15 07:45:00',
    submitted_at: '2023-03-15 08:15:00',
  },
  {
    id: 20,
    assessment_id: 1,
    principal_id: 5,
    assessment_submission_state: 'Submitted',
    opened_at: '2023-03-15 07:45:00',
    submitted_at: '2023-03-15 08:15:00',
  },
];

const AssessmentSubmissionsListPage = () => {
  const { assessmentId } = useParams();
  const assessmentIdNumber = Number(assessmentId);

  const [isMentor, setIsMentor] = useState(false);
  const [assessment, setAssessment] = useState<SubmittedAssessment>();

  useEffect(() => {
    const filteredSubmissions = () => {
      if (!isMentor) {
        return submissionsExample.filter(sub => sub.principal_id === 3);
      }
      return submissionsExample;
    };

    setAssessment({
      curriculum_assessment:
        assessmentDetailPageExampleData.curriculum_assessment,
      program_assessment: assessmentDetailPageExampleData.program_assessment,

      submissions: filteredSubmissions(),
    });
  }, [isMentor]);

  if (!assessment || typeof assessment.curriculum_assessment === 'undefined') {
    return (
      <Container>
        <p>An error occurred.</p>
      </Container>
    );
  }

  const ButtonWrapper = () => {
    if (
      new Date(assessment.program_assessment.due_date) > new Date() &&
      assessment.curriculum_assessment.max_num_submissions >
        assessment.submissions.length
    ) {
      return <Button variant="contained">New Submission</Button>;
    }
    return null;
  };

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <h1>{assessment.curriculum_assessment.title}</h1>
          <p>{assessment.curriculum_assessment.description}</p>
        </Grid>
        <Grid item xs={12} md={6} container sx={{ justifyContent: 'flex-end' }}>
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={isMentor}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setIsMentor(event.target.checked);
                  }}
                  name="isMentor"
                />
              }
              label="Mentor mode"
            />
          </FormGroup>
        </Grid>

        <Grid item xs={12} md={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  {isMentor ? (
                    <StyledTableCell>Student Id</StyledTableCell>
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
                {assessment.submissions.map(submission => (
                  <StyledTableRow
                    key={submission.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    {isMentor ? (
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
                      {isMentor ? (
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

        <Grid
          item
          xs={12}
          md={12}
          container
          sx={{ justifyContent: 'flex-end' }}
        >
          <ButtonWrapper />
        </Grid>
      </Grid>
    </Container>
  );
};

export default AssessmentSubmissionsListPage;
