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
import useApiData from '../helpers/useApiData';
import { CompetenciesByCategory } from '../types/api';

const CompetenciesCategoriesTable = () => {
  const { data, isLoading, error } = useApiData<CompetenciesByCategory[]>({
    deps: [],
    path: `/competencies/categories`,
    sendCredentials: true,
  });
  if (error) {
    return <p>There was an error loading the competencies.</p>;
  }
  if (!data) {
    return null;
  }

  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow
            sx={{
              fontWeight: 'bold',
              '& > *': {
                fontWeight: 'bold',
                textTransform: 'uppercase',
              },
            }}
          >
            <TableCell sx={{ width: '5%' }} />
            <TableCell sx={{ width: '25%' }}>Category</TableCell>
            <TableCell align="left">Summary</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {!isLoading &&
            data.map(({ id, label, description, competencies }) => (
              <CompetenciesDetailTable
                key={id}
                catgoryLabel={label}
                categoryDescription={description}
                competencies={competencies}
              />
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CompetenciesCategoriesTable;
