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

const StyledRating = styled(Rating)({
  '& .MuiRating-iconFilled': {
    color: '#42a5f5',
  },
});

// const dummyApiData = {
// "data": [
//   {
//     "id": 1,
//     "created_at": "2022-06-23T22:17:41.000Z",
//     "journal_entries": [
//       {
//         "id": 1,
//         "raw_text": "test",
//         "reflection_id": 1
//       }
//     ],
//     "responses": [
//       {
//         "id": 1,
//         "option": {
//           "id": 2,
//           "label": "A little discouraged",
//           "prompt": {
//             "id": 1,
//             "label": "Outlook"
//           }
//         }
//       }
//     ]
//   }
// ],
// }

const dummyData = [
  {
    id: 1,
    label: 'Data Structures',
    definition:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce vitae volutpat urna. Donec sed sodales nibh.',
    responses: [
      { id: 2, created_at: '2022-06-23T22:17:41.000Z' },
      { id: 3, created_at: '2022-06-23T22:17:41.000Z' },
      { id: 4, created_at: '2022-06-23T22:17:41.000Z' },
    ],
  },
  {
    id: 2,
    label: 'Testing',
    definition:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce vitae volutpat urna. Donec sed sodales nibh.',
    responses: [
      { id: 2, created_at: '2022-06-23T22:17:41.000Z' },
      { id: 3, created_at: '2022-06-23T22:17:41.000Z' },
      { id: 4, created_at: '2022-06-23T22:17:41.000Z' },
    ],
  },
  {
    id: 3,
    label: 'Awareness of new tech',
    definition:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce vitae volutpat urna. Donec sed sodales nibh.',
    responses: [
      { id: 2, created_at: '2022-06-23T22:17:41.000Z' },
      { id: 3, created_at: '2022-06-23T22:17:41.000Z' },
      { id: 4, created_at: '2022-06-23T22:17:41.000Z' },
    ],
  },
  {
    id: 4,
    label: 'Code orfanization',
    definition:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce vitae volutpat urna. Donec sed sodales nibh.',
    responses: [
      { id: 2, created_at: '2022-06-23T22:17:41.000Z' },
      { id: 3, created_at: '2022-06-23T22:17:41.000Z' },
    ],
  },
  {
    id: 5,
    label: 'Estimation',
    definition:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce vitae volutpat urna. Donec sed sodales nibh.',
    responses: [{ id: 2, created_at: '2022-06-23T22:17:41.000Z' }],
  },
];

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
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ textAlign: 'center' }}>
                      Competency
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>Ratings</TableCell>
                  </TableRow>
                </TableHead>
              </Table>
              <Table size="small">
                {/* 5 table cells
                      # (number) - data.responses.prompt.id? (Is this competencies id?)
                      Name - data.responses. prompt.label?
                      Definition
                      Date1 - 
                        rating - data.responses.option.id
                      Date2
                      Date3
                  */}
                <TableHead>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      #
                    </TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Definition</TableCell>
                    <TableCell sx={{ color: 'red' }}>Date 1</TableCell>
                    <TableCell sx={{ color: 'red' }}>Date 2</TableCell>
                    <TableCell sx={{ color: 'red' }}>Date 3</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {dummyData.map(data => (
                    <TableRow key={data.id}>
                      <TableCell
                        component="th"
                        scope="row"
                        sx={{ width: '5%' }}
                      >
                        {data.id}
                      </TableCell>
                      <TableCell sx={{ width: '20%' }}>{data.label}</TableCell>
                      <TableCell sx={{ width: '30%' }}>
                        {data.definition}
                      </TableCell>
                      <TableCell sx={{ width: '15%' }}>
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
                      <TableCell sx={{ width: '15%' }}>
                        {data.responses[1]
                          ? data.responses[1].id
                          : 'No data yet'}
                      </TableCell>
                      <TableCell sx={{ width: '15%' }}>
                        {data.responses[2]
                          ? data.responses[2].id
                          : 'No data yet'}
                      </TableCell>
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
