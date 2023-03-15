import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { useParams } from 'react-router-dom';
import { exampleTestSubmissionList, AssessmentSubmission } from '../assets/data';
import { assessmentList } from '../assets/data';
import Button from '@mui/material/Button';
import Container from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

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
  const id = parseInt(useParams().assessmentId ?? '');
  const assessment = assessmentList[id]
  const currentDate = new Date();
  const AssessmentDue = new Date(assessment?.dueDate ?? "") as Date;

  const [submissionsList, setSubmissionsList] = useState<AssessmentSubmission[]>([]);

  useEffect(() => {
    const filteredList = exampleTestSubmissionList.filter(sub => sub.assessmentId === id);
    setSubmissionsList(filteredList);
  }, [id]);





  const ButtonWrapper = () => {
    if (AssessmentDue < currentDate && assessment.maxNumSubmissions && assessment.maxNumSubmissions > submissionsList.length) {
      return <Button variant="contained">Take a quiz!</Button>
    }
    return null;
  }

  return (
    // <Container>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="right">assessmentId</StyledTableCell>
              <StyledTableCell align="right">state</StyledTableCell>
              <StyledTableCell align="right">openAt</StyledTableCell>
              <StyledTableCell align="right">submitAt</StyledTableCell>
              <StyledTableCell align="right">score</StyledTableCell>
              <StyledTableCell align="right">Review</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {submissionsList.map((submission) => (
              <StyledTableRow
                key={submission.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <StyledTableCell component="th" scope="submission">
                  {submission.assessmentId}
                </StyledTableCell>
                <StyledTableCell align="right">{submission.state}</StyledTableCell>
                <StyledTableCell align="right">{submission.openAt}</StyledTableCell>
                <StyledTableCell align="right">{submission.submitAt}</StyledTableCell>
                <StyledTableCell align="right">{submission.score || "-"}</StyledTableCell>
                <StyledTableCell align="right"><Button variant="contained" size="small" href={`/assessments/${submission.id}`}>Review</Button></StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>

        <ButtonWrapper/>
      </TableContainer>
    // </Container>
  );




}


export default AssessmentSubmissionsListPage;
