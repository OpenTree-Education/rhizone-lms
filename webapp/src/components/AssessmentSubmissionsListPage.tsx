import React, { useState, useEffect } from 'react';

import { styled } from '@mui/material/styles';
import { useParams } from 'react-router-dom';
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
import { SubmittedAssessment } from '../types/api';
import { formatDateTime } from '../helpers/dateTime';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
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

const AssessmentSubmissionsListPage = () => {
  const { assessmentId } = useParams();
  const assessmentIdNumber = Number(assessmentId);

  const [assessment, setAssessment] = useState<SubmittedAssessment>();

  useEffect(() => {
    setAssessment({
      curriculum_assessment:
        assessmentDetailPageExampleData.curriculum_assessment,
      program_assessment: assessmentDetailPageExampleData.program_assessment,
      submissions: [
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
          id: 17,
          assessment_id: 1,
          principal_id: 3,
          assessment_submission_state: 'Submitted',
          opened_at: '2023-03-15 07:45:00',
          submitted_at: '2023-03-15 08:15:00',
        },
      ],
    });
  }, []);

  if (!assessment || typeof assessment.curriculum_assessment === 'undefined') {
    return (
      <Container>
        <p>An error occurred.</p>
      </Container>
    );
  }

  const ButtonWrapper = () => {
    if (
      new Date(assessment.program_assessment.due_date) < new Date() &&
      assessment.curriculum_assessment.max_num_submissions >
        assessment.submissions.length
    ) {
      return <Button variant="contained">Take a quiz!</Button>;
    }
    return null;
  };

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <h1>{assessment.curriculum_assessment.title}</h1>
        </Grid>

        <Grid item xs={12} md={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
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
                    <StyledTableCell component="th" scope="submission">
                      {submission.id}
                    </StyledTableCell>
                    <StyledTableCell>
                      {submission.assessment_submission_state}
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
                      <Button
                        variant="contained"
                        size="small"
                        href={`/assessments/${assessmentIdNumber}/${submission.id}`}
                      >
                        Review
                      </Button>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>

            <ButtonWrapper />
          </TableContainer>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AssessmentSubmissionsListPage;
