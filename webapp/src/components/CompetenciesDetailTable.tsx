import React from 'react';
import {
  Box,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { createData } from './CompetenciesCategoriesTable';

interface IBackgroundColor {
  [key: string]: string;
}

const categoryBackgroundColor: IBackgroundColor = {
  Functional: '#F7B8D7',
  Strategic: '#b4a7d5',
  Operational: '#b6d7a8',
  Behavioural: '#ffe59a',
  Organizational: '#CAE2FA',
};

const CompetenciesDetailTable = (props: {
  row: ReturnType<typeof createData>;
}) => {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow
        sx={{
          '& > *': { borderBottom: 'unset' },
          backgroundColor: categoryBackgroundColor[row.category],
        }}
      >
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.category}
        </TableCell>
        <TableCell>{row.summary}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ textAlign: 'center' }}>
                      Competency
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>Ratings</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {/* 5 table cells
                      # (number)
                      Name
                      Definition
                      Date1
                      Date2
                      Date3
                  */}
                  {/* {row.history.map(historyRow => (
                    <TableRow key={historyRow.date}>
                      <TableCell component="th" scope="row">
                        {historyRow.date}
                      </TableCell>
                      <TableCell>{historyRow.customerId}</TableCell>
                      <TableCell align="right">{historyRow.amount}</TableCell>
                      <TableCell align="right">
                        {Math.round(historyRow.amount * row.price * 100) / 100}
                      </TableCell>
                    </TableRow>
                  ))} */}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

export default CompetenciesDetailTable;
