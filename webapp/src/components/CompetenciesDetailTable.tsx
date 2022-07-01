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
  Tooltip,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import CircleIcon from '@mui/icons-material/Circle';
import { Competency, Reflection } from '../types/api';
import useApiData from '../helpers/useApiData';
import { formatDate } from '../helpers/dateTime';

export interface IBackgroundColor {
  [key: string]: string;
}
export const categoryBackgroundColor: IBackgroundColor = {
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

interface IRatingValue {
  [key: string]: number;
}
const ratingValue: IRatingValue = {
  Aware: 1,
  Novice: 2,
  Intermediate: 3,
  Advanced: 4,
  Expert: 5,
};

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

  const { data: reflections } = useApiData<Reflection[]>({
    deps: [],
    path: '/reflections',
    sendCredentials: true,
  });

  return (
    <>
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
                  <TableRow
                    sx={{
                      '& > *': {
                        fontWeight: 'bold !important',
                        textTransform: 'uppercase',
                      },
                    }}
                  >
                    <TableCell component="th" scope="row" sx={{ width: '20%' }}>
                      Name
                    </TableCell>
                    <TableCell>Definition</TableCell>
                    {reflections &&
                      reflections
                        .filter(reflection =>
                          reflection.responses.find(response =>
                            competencies.find(
                              competency =>
                                competency.label ===
                                response.option.prompt.label
                            )
                          )
                        )
                        .map(reflection => {
                          const reflectionCreatedAtDate = formatDate(
                            reflection.created_at
                          );
                          return (
                            <TableCell key={reflection.id} align="center">
                              {reflectionCreatedAtDate}
                            </TableCell>
                          );
                        })}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reflections &&
                    competencies.map(competency => (
                      <TableRow key={competency.id}>
                        <TableCell>{competency.label}</TableCell>
                        <TableCell>{competency.description}</TableCell>
                        {reflections
                          .filter(reflection =>
                            reflection.responses.find(response =>
                              competencies.find(
                                competency =>
                                  competency.label ===
                                  response.option.prompt.label
                              )
                            )
                          )
                          .map(reflection => {
                            const response = reflection.responses.find(
                              response =>
                                response.option.prompt.label ===
                                competency.label
                            );
                            if (response) {
                              return (
                                <Tooltip
                                  key={response.id}
                                  title={response.option.label}
                                  placement="top"
                                  arrow
                                >
                                  <TableCell align="center">
                                    <StyledRating
                                      value={ratingValue[response.option.label]}
                                      readOnly
                                      icon={<CircleIcon />}
                                      emptyIcon={<CircleOutlinedIcon />}
                                    />
                                  </TableCell>
                                </Tooltip>
                              );
                            } else {
                              return (
                                <TableCell key={reflection.id}></TableCell>
                              );
                            }
                          })}
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default CompetenciesDetailTable;
