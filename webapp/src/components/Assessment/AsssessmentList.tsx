import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Link } from 'react-router-dom';

function createData(
  name: string,
  date:string,
  grade:string
) {
  return { date, name, grade };
}

const rows = [
  createData("Assessment 1","25-2-2023","yes"),
  createData("Assessment 2","26-2-2023","no"),
  

];

 const AssessmentList = ()=> {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 600 }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell align="right"  >date</TableCell>
            <TableCell align="right">name</TableCell>
            <TableCell align="right">Grade/Ungrade</TableCell>
            
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.name}  
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
             
              <TableCell align="right">{row.date}</TableCell>
              <TableCell align="right">
                <Link to="/quiz/assessment">
                {row.name}
                </Link></TableCell>
              <TableCell align="right">{row.grade}</TableCell>
              
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
export default AssessmentList;