import React from 'react';
import {
  Container,
  Grid,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Rating,
  Tooltip,
  Typography,
  Stack,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Chip,
  Card,
} from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/system';
import { tableCellClasses } from '@mui/material';
import useApiData from '../helpers/useApiData';
import { CategoryWithCompetencies, Reflection } from '../types/api';

// Assume this is ordered by the category
const COMPETENCIES = [
  {
    label: 'Creativity',
    definition: "Using one's imagination to solve problems in unique ways.",
    category: 'Strategic',
    ratings: [
      {
        created_at: '2022-05-11',
        value: 2,
      },
      {
        created_at: '2022-06-08',
        value: 2,
      },
      {
        created_at: '2022-06-29',
        value: 3,
      },
    ],
  },
  {
    label: 'Anticipation',
    definition: 'Recognizing what may happen in the future.',
    category: 'Strategic',
    ratings: [
      {
        created_at: '2022-05-11',
        value: 4,
      },
      {
        created_at: '2022-06-08',
        value: 4,
      },
      {
        created_at: '2022-06-29',
        value: 4,
      },
    ],
  },
  {
    label: 'Problem solving',
    category: 'Operational',
    definition: 'The ability to solve problems.',
    ratings: [
      {
        created_at: '2022-05-11',
        value: 1,
      },
      {
        created_at: '2022-06-08',
        value: 2,
      },
      {
        created_at: '2022-06-29',
        value: 3,
      },
    ],
  },
  {
    label: 'Influence',
    definition:
      'Having others listen to your thoughts and ideas and creating action based on your communication.',
    category: 'Organizational',
    ratings: [
      {
        created_at: '2022-05-11',
        value: 3,
      },
      {
        created_at: '2022-06-08',
        value: 3,
      },
      {
        created_at: '2022-06-29',
        value: 4,
      },
    ],
  },
];

const ASSESSMENTS = [
  {
    id: 1,
    completed_at: new Date('2022-05-11'),
  },
  {
    id: 2,
    completed_at: new Date('2022-06-08'),
  },
  {
    id: 3,
    completed_at: new Date('2022-06-29'),
  },
];

const ratingsKeywords = new Map();
ratingsKeywords.set(1, 'Aware');
ratingsKeywords.set(2, 'Novice');
ratingsKeywords.set(3, 'Intermediate');
ratingsKeywords.set(4, 'Advanced');
ratingsKeywords.set(5, 'Expert');

const StyledRating = styled(Rating)({
  '& .MuiRating-iconFilled': {
    color: '#1976d2',
  },
});

const StyledTableCell = styled(TableCell)({
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    backgroundColor: '#1976d2',
    color: 'white',
    textAlign: 'center',
  },
});

const CompetenciesVisualization = () => {
  let currentCategory: string;
  let shouldAddCategoryRow: boolean;

  const { data: categories } = useApiData<CategoryWithCompetencies[]>({
    path: '/competencies/opentree',
    sendCredentials: true,
  });

  const {
    data: reflections,
    error,
    isLoading,
  } = useApiData<Reflection[]>({
    path: '/reflections',
    sendCredentials: true,
  });

  console.log(reflections);

  if (!categories || !reflections) {
    return null;
  }

  return (
    <Container fixed>
      <h1>Competencies</h1>
      <Grid container justifyContent="center">
        <Grid item xs={12} md={8}>
          <Button
            variant="outlined"
            component="a"
            href={'/competencies-assessment'}
          >
            Take Assessment
          </Button>
        </Grid>
        <Grid item xs={12} md={8}>
          {categories.map(category => (
            <Accordion key={category.id}>
              <AccordionSummary>{category.label}</AccordionSummary>
              <AccordionDetails>
                {category.competencies.map(competency => (
                  <Card key={competency.id}>
                    {competency.label}
                    {reflections.map(reflection => {
                      const response = reflection.responses.find(
                        response =>
                          response.option.prompt.label === competency.label
                      );
                      if (response) {
                        return (
                          <Chip
                            key={response.id}
                            label={response.option.label}
                          />
                        );
                      }
                    })}
                  </Card>
                ))}
              </AccordionDetails>
            </Accordion>
          ))}

          {/* <TableContainer component={Paper}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Competency</TableCell>
                  <TableCell>Definition</TableCell>
                  {ASSESSMENTS.map(assessment => (
                    <TableCell key={assessment.id}>
                      {`${assessment.completed_at.getMonth() + 1}/${
                        assessment.completed_at.getDate() + 1
                      }/${assessment.completed_at.getFullYear()}`}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {COMPETENCIES.map(competency => {
                  if (currentCategory !== competency.category) {
                    currentCategory = competency.category;
                    shouldAddCategoryRow = true;
                  } else {
                    shouldAddCategoryRow = false;
                  }

                  return (
                    <React.Fragment key={competency.label}>
                      {shouldAddCategoryRow && (
                        <TableRow>
                          <StyledTableCell colSpan={2 + ASSESSMENTS.length}>
                            {currentCategory}
                          </StyledTableCell>
                        </TableRow>
                      )}
                      <TableRow>
                        <TableCell>{competency.label}</TableCell>
                        <TableCell>{competency.definition}</TableCell>
                        {competency.ratings.map(rating => (
                          <Tooltip
                            key={rating.created_at}
                            title={ratingsKeywords.get(rating.value)}
                            placement="top"
                            arrow
                          >
                            <TableCell>
                              <StyledRating
                                value={rating.value}
                                readOnly
                                icon={<CircleIcon />}
                                emptyIcon={<CircleIcon />}
                              />
                            </TableCell>
                          </Tooltip>
                        ))}
                      </TableRow>
                    </React.Fragment>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid item xs={12} md={8} sx={{ mt: 2 }}>
          <Box>
            <Typography variant="h6" component="h3">
              Key
            </Typography>
            <Stack direction="row" spacing={2}>
              <RatingKey
                keyText="Awareness — You are aware of the competency but are unable to perform tasks."
                value={1}
              />
              <RatingKey
                keyText="Novice (limited proficiency) — You understand and can discuss terminology, concepts, and issues."
                value={2}
              />
              <RatingKey
                keyText="Intermediate proficiency — You have applied this skill to situations occasionally without needing guidance."
                value={3}
              />
              <RatingKey
                keyText="Advanced proficiency — You can coach others in the application by explaining related nuances."
                value={4}
              />
              <RatingKey
                keyText="Expert — You have demonstrated consistent excellence across multiple projects."
                value={5}
              />
            </Stack>
          </Box> */}
        </Grid>
      </Grid>
    </Container>
  );
};

interface RatingKeyProps {
  keyText: string;
  value: number;
}

const RatingKey = ({ keyText, value }: RatingKeyProps) => {
  return (
    <Paper sx={{ padding: 2 }}>
      <StyledRating
        value={value}
        readOnly
        icon={<CircleIcon />}
        emptyIcon={<CircleIcon />}
      />
      <Typography>{keyText}</Typography>
    </Paper>
  );
};

export default CompetenciesVisualization;
