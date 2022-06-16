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
import useApiData from '../helpers/useApiData';
import { CategoryWithCompetencies, Reflection } from '../types/api';

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

  if (!categories || !reflections) {
    return null;
  } else {
    reflections.sort((a, b) => (a.created_at > b.created_at ? 1 : -1));
  }

  console.log(reflections);

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
        <Grid item xs={12}>
          {categories.map(category => (
            <Accordion key={category.id}>
              <AccordionSummary>{category.label}</AccordionSummary>
              <AccordionDetails>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Competency</TableCell>
                      <TableCell>Definition</TableCell>
                      {reflections
                        .filter(reflection =>
                          reflection.responses.find(response =>
                            category.competencies.find(
                              competency =>
                                competency.label ===
                                response.option.prompt.label
                            )
                          )
                        )
                        .map((reflection, i) => {
                          const reflectionCreatedAtDate = new Date(
                            reflection.created_at
                          );

                          return (
                            <Tooltip
                              key={reflection.id}
                              title={`${
                                reflectionCreatedAtDate.getMonth() + 1
                              }/${
                                reflectionCreatedAtDate.getDate() + 1
                              }/${reflectionCreatedAtDate.getFullYear()} at ${reflectionCreatedAtDate.getHours()}:${reflectionCreatedAtDate.getMinutes()}`}
                              placement="top"
                              arrow
                            >
                              <TableCell key={reflection.id} align="center">
                                Rating {i + 1}
                              </TableCell>
                            </Tooltip>
                          );
                        })}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {category.competencies.map(competency => (
                      <TableRow key={competency.id}>
                        <TableCell>{competency.label}</TableCell>
                        <TableCell>{competency.description}</TableCell>
                        {reflections
                          .filter(reflection =>
                            reflection.responses.find(response =>
                              category.competencies.find(
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
                                      value={response.option.numeric_value}
                                      readOnly
                                      icon={<CircleIcon />}
                                      emptyIcon={<CircleIcon />}
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
              </AccordionDetails>
            </Accordion>
          ))}

          {/*

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
