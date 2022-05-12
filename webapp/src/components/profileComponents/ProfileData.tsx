import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button } from '@material-ui/core';
import { EditStateProps } from '../../types/profile.type';

function createData(key: string, value: string) {
  return { key, value };
}

const rows = [
  createData('Name', 'Ryan Cohen'),
  createData('Email', 'rc@gmail.com'),
  createData('Links', 'super-secrets.assasin'),
  createData('Strengths', 'able to leap tall buildings'),
  createData('Future Strenghts', 'turns into Ginger Bread Man'),
  createData(
    'Bio',
    "You think water moves fast? You should see ice. It moves like it has a mind. Like it knows it killed the world once and got a taste for murder. After the avalanche, it took us a week to climb out. Now, I don't know exactly when we turned on each other, but I know that seven of us survived the slide... and only five made it out. Now we took an oath, that I'm breaking now. We said we'd say it was the snow that killed the other two, but it wasn't. Nature is lethal but it doesn't hold a candle to man."
  ),
];

export default function BasicTable(props: EditStateProps) {
  const toggleEdit = () => {
    props.edit ? props.setEdit(false) : props.setEdit(true);
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableBody>
          {rows.map(row => (
            <TableRow
              key={row.key}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.key}
              </TableCell>
              <TableCell component="th" scope="row">
                {row.value}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button
        onClick={toggleEdit}
        variant="outlined"
        style={{ marginInline: 'auto', display: 'block', marginTop: '15%' }}
      >
        {props.edit ? 'Done Editing' : 'Edit'}
      </Button>
    </TableContainer>
  );
}
