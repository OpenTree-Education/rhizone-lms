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
  Rating,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import CircleIcon from '@mui/icons-material/Circle';
import { Competency } from '../types/api';

interface IBackgroundColor {
  [key: string]: string;
}

const categoryBackgroundColor: IBackgroundColor = {
  Functional: '#CAE2FA',
  Strategic: '#ffe59a',
  Operational: '#b6d7a8',
  Behavioural: '#b4a7d5',
  Organizational: '#F7B8D7',
};

const StyledRating = styled(Rating)({
  '& .MuiRating-iconFilled': {
    color: '#42a5f5',
  },
});

interface DetailTableProps {
  catgoryLabel: string;
  categoryDescription: string;
  competencies: Competency[];
}

const CompetenciesDetailTable = ({
  catgoryLabel,
  categoryDescription,
  competencies,
}: DetailTableProps) => {
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow
        sx={{
          '& > *': { borderBottom: 'unset' },
          backgroundColor: categoryBackgroundColor[catgoryLabel],
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
          {catgoryLabel}
        </TableCell>
        <TableCell>{categoryDescription}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ textAlign: 'center', width: '50%' }}>
                      Competency
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center', width: '50%' }}>
                      Ratings
                    </TableCell>
                  </TableRow>
                </TableHead>
              </Table>
              <Table size="small">
                {/* 4 table cells
                      Name - data.responses.option.prompt.label / data.competencies.label
                      Definition - data.competencies.description
                      Date1 - data.created_at
                        rating - data.responses.option.numeric_value
                      Date2
                      Date3
                  */}
                <TableHead>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Name
                    </TableCell>
                    <TableCell>Definition</TableCell>
                    <TableCell sx={{ color: 'red' }}>Date 1</TableCell>
                    <TableCell sx={{ color: 'red' }}>Date 2</TableCell>
                    <TableCell sx={{ color: 'red' }}>Date 3</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {competencies.map(({ id, label, description }) => (
                    <TableRow key={id}>
                      <TableCell sx={{ width: '21%' }}>{label}</TableCell>
                      <TableCell sx={{ width: '31%' }}>{description}</TableCell>

                      {/* <TableCell sx={{ width: '16%' }}>
                        {data.responses[0] ? (
                          <StyledRating
                            name="customized-color"
                            readOnly
                            defaultValue={data.responses[0].id}
                            icon={<CircleIcon fontSize="inherit" />}
                            emptyIcon={
                              <CircleOutlinedIcon fontSize="inherit" />
                            }
                          />
                        ) : (
                          'No data yet'
                        )}
                      </TableCell>
                      <TableCell sx={{ width: '16%' }}>
                        {data.responses[1]
                          ? data.responses[1].id
                          : 'No data yet'}
                      </TableCell>
                      <TableCell sx={{ width: '16%' }}>
                        {data.responses[2]
                          ? data.responses[2].id
                          : 'No data yet'}
                      </TableCell> */}
                    </TableRow>
                  ))}
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
