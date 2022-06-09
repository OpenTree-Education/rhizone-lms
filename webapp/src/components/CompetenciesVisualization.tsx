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
} from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/system';

// This makes more sense I think than the Assessments structure.
// Need to figure out how the date columns will be correct...
const COMPETENCIES = [
  {
    label: 'Creativity',
    definition: "Using one's imagination to solve problems in unique ways.",
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
    label: 'Problem solving',
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

const CompetenciesVisualization = () => {
  return (
    <Container fixed>
      <h1>Competencies</h1>
      <Grid container justifyContent="center">
        <Grid item xs={12} md={8}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Competency</TableCell>
                  <TableCell>Definition</TableCell>
                  {ASSESSMENTS.map(assessment => (
                    <TableCell key={assessment.id}>
                      {`${assessment.completed_at.getMonth()}/${assessment.completed_at.getDate()}/${assessment.completed_at.getFullYear()}`}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {COMPETENCIES.map(competency => (
                  <TableRow key={competency.label}>
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
                ))}
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
          </Box>
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
