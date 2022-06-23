import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import CompetenciesDetailTable from './CompetenciesDetailTable';

export function createData(category: string, summary: string) {
  return {
    category,
    summary,
  };
}

const rows = [
  createData('Category A', 'Summary A'),
  createData('Category B', 'Summary B'),
  createData('Category C', 'Summary C'),
  createData('Category D', 'Summary D'),
  createData('Category E', 'Summary E'),
];

const CompetenciesCategoriesTable = () => {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: '5%' }} />
            <TableCell sx={{ width: '25%' }}>Category</TableCell>
            <TableCell align="left">Summary</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => (
            <CompetenciesDetailTable key={row.category} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CompetenciesCategoriesTable;
