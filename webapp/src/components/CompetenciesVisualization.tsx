import React from 'react';
import {
  Container,
  Grid,
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
  Card,
  CardContent,
} from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/system';
import useApiData from '../helpers/useApiData';
import { CategoryWithCompetencies, Reflection } from '../types/api';

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

  if (error) {
    return <div>There was an error loading the competencies.</div>;
  }
  if (isLoading) {
    return (
      <Container fixed>
        <div>Loading...</div>
      </Container>
    );
  }
  if (!categories || !reflections) {
    return null;
  } else {
    reflections.sort((a, b) => (a.created_at > b.created_at ? 1 : -1));
  }

  return (
    <Container fixed>
      <h1>Competencies</h1>
      <Grid container justifyContent="center">
        <Grid item xs={12} md={8} textAlign="center">
          <Button
            variant="outlined"
            component="a"
            href={'/competencies-assessment'}
          >
            Take Assessment
          </Button>
        </Grid>
        <Grid item xs={12} sx={{ mt: 2 }}>
          <Accordion>
            <AccordionSummary
              sx={{ backgroundColor: '#1976d2', color: 'white' }}
            >
              <Typography variant="h6" component="h3">
                Key
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
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
            </AccordionDetails>
          </Accordion>
        </Grid>

        <Grid item xs={12} sx={{ mt: 2 }}>
          <Typography variant="h6" component="h3" sx={{ mb: 2 }}>
            Categories
          </Typography>
          {categories.map(category => (
            <Accordion key={category.id}>
              <AccordionSummary
                sx={{ backgroundColor: '#1976d2', color: 'white' }}
              >
                {category.label}
              </AccordionSummary>
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
    <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <StyledRating
        value={value}
        readOnly
        icon={<CircleIcon />}
        emptyIcon={<CircleIcon />}
      />
      <Typography sx={{ mt: 1 }}>{keyText}</Typography>
    </CardContent>
  );
};

export default CompetenciesVisualization;
