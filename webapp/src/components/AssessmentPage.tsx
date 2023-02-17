import { Typography, Box } from '@mui/material';
import React from 'react';
import AssessmentCard from './AssessmentCard';

type Assessment = {
  id: number;
  title: string;
  description: string;
  score: number;
  timestamp: string;
  complited: boolean;
};

const AssessmentPage = () => {
  const assessments: Assessment[] = [
    {
      id: 1,
      title: 'Introduction to HTML',
      description:
        'Learn the basics of HTML, the markup language used to create web pages.',
      score: 92,
      timestamp: '2023-02-15T13:30:00Z',
      complited: true,
    },
    {
      id: 2,
      title: 'CSS Layouts',
      description:
        'Explore different techniques for laying out web pages using CSS.',
      score: 85,
      timestamp: '2023-02-14T10:15:00Z',
      complited: true,
    },
    {
      id: 3,
      title: 'JavaScript Fundamentals',
      description:
        'Learn the basics of JavaScript, the programming language used to add interactivity to web pages.',
      score: 0,
      timestamp: '2023-02-12T16:45:00Z',
      complited: false,
    },
    {
      id: 4,
      title: 'CSS Layouts',
      description:
        'Explore different techniques for laying out web pages using CSS.',
      score: 0,
      timestamp: '2023-02-14T10:15:00Z',
      complited: false,
    },
    {
      id: 5,
      title: 'JavaScript Fundamentals',
      description:
        'Learn the basics of JavaScript, the programming language used to add interactivity to web pages.',
      score: 97,
      timestamp: '2023-02-12T16:45:00Z',
      complited: true,
    },
  ];

  const partition = (array: Array<Assessment>) => {
    const matches: Array<Assessment> = [];
    const nonMatches: Array<Assessment> = [];

    array.forEach(element =>
      (element.complited ? matches : nonMatches).push(element)
    );

    return [matches, nonMatches];
  };

  const t = partition(assessments);

  return (
    <Box ml={10} mr={10}>
      {' '}
      <Typography variant="h4" mt={5} mb={5}>
        Hi User,
      </Typography>
      <Typography mb={5}>
        Welcome to the assessment page! We are glad to have you here. This page
        is designed to help you keep track of your past and upcoming
        assessments, including the grades you received and any feedback from
        assessors. We understand that assessments can be an important part of
        your learning journey, and we want to make sure you have easy access to
        all the information you need to stay on top of your progress. Please
        feel free to explore the page and let us know if you have any questions
        or feedback. We are here to help you succeed!
      </Typography>
      {assessments.length === 0 && (
        <p>There are no upcomming assesments for you.</p>
      )}
      <Box>
        <Typography variant="h5" color={'#2196f3'} mb={2} fontWeight={600}>
          {' '}
          Upcoming assessments
        </Typography>
        {t[1].map(({ id, title, description, timestamp, complited }) => (
          <AssessmentCard
            id={id}
            key={id}
            title={title}
            description={description}
            timestamp={timestamp}
            complited={complited}
          />
        ))}
      </Box>
      <Box>
        <Typography variant="h5" color={'#2196f3'} mb={2} fontWeight={600}>
          {' '}
          Completed assessments
        </Typography>
        {t[0].map(({ id, title, description, score, timestamp, complited }) => (
          <AssessmentCard
            id={id}
            key={id}
            title={title}
            description={description}
            timestamp={timestamp}
            score={score}
            complited={complited}
          />
        ))}
      </Box>
    </Box>
  );
};

export default AssessmentPage;
