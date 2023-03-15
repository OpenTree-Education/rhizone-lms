import { OpenedAssessment } from '../types/api';
import { AssessmentSummary } from '../types/api';

export const assessmentListPageExampleData: AssessmentSummary[] = [
  {
    curriculum_assessment: {
      id: 1,
      title: 'Assignment 1: React',
      description: 'Your assignment for week 1 learning.',
      assessment_type: 'Assessment',
      max_score: 10,
      max_num_submissions: 1,
      time_limit: 0,
      curriculum_id: 3,
      activity_id: 97,
      principal_id: 2,
    },
    program_assessment: {
      id: 1,
      program_id: 2,
      assessment_id: 1,
      available_after: '2023-02-06 00:00:00',
      due_date: '2023-03-09 00:00:00',
    },
    submissions_summary: {
      principal_id: 2,
      highest_state: '10',
      most_recent_submitted_date: '2023-03-09',
      total_num_submissions: 1,
      highest_score: 10,
      assessment_submission_state: 'Graded',
    },
  },
  {
    curriculum_assessment: {
      id: 2,
      title: 'SQL Quiz',
      description: 'A check on your SQL learning.',
      assessment_type: 'Quiz',
      max_score: 5,
      max_num_submissions: 3,
      time_limit: -1,
      curriculum_id: 3,
      activity_id: 98,
      principal_id: 2,
    },
    program_assessment: {
      id: 2,
      program_id: 2,
      assessment_id: 2,
      available_after: '2023-02-06 00:00:00',
      due_date: '2023-03-24 00:00:00',
    },
    submissions_summary: {
      principal_id: 2,
      highest_state: '??',
      most_recent_submitted_date: '',
      total_num_submissions: 0,
      highest_score: -1,
      assessment_submission_state: 'Active',
    },
  },
  {
    curriculum_assessment: {
      id: 3,
      title: 'Final Exam',
      description: 'The final exam for the course.',
      assessment_type: 'Assessment',
      max_score: 50,
      max_num_submissions: 1,
      time_limit: 120,
      curriculum_id: 3,
      activity_id: 99,
      principal_id: 2,
    },
    program_assessment: {
      id: 3,
      program_id: 2,
      assessment_id: 3,
      available_after: '2023-03-20 00:00:00',
      due_date: '2023-03-31 00:00:00',
    },
    submissions_summary: {
      principal_id: 2,
      highest_state: ' ',
      most_recent_submitted_date: ' ',
      total_num_submissions: 1,
      highest_score: -1,
      assessment_submission_state: 'Upcoming',
    },
  },
];

export const assessmentDetailPageExampleData: OpenedAssessment = {
  curriculum_assessment: {
    id: 2,
    title: 'SQL Quiz',
    description: 'A check on your SQL learning.',
    assessment_type: 'Quiz',
    max_score: 10,
    max_num_submissions: 3,
    time_limit: 60,
    curriculum_id: 3,
    activity_id: 98,
    principal_id: 2,
    questions: [
      {
        id: 15,
        title: 'What is MySQL?',
        question_type: 'single choice',
        max_score: 1,
        sort_order: 1,
        answers: [
          {
            id: 42,
            title: 'A relational database management system',
            sort_order: 1,
          },
          { id: 43, title: 'A programming language', sort_order: 2 },
          { id: 44, title: 'An operating system', sort_order: 3 },
          { id: 45, title: 'A web server', sort_order: 4 },
        ],
      },
      {
        id: 16,
        title: 'INT and VARCHAR are some common data types in MySQL.',
        question_type: 'single choice',
        max_score: 1,
        sort_order: 2,
        answers: [
          { id: 46, title: 'True', sort_order: 1 },
          { id: 47, title: 'False', sort_order: 2 },
        ],
      },
      {
        id: 17,
        title: 'Which command is used to create a new database in MySQL?',
        question_type: 'single choice',
        max_score: 1,
        sort_order: 3,
        answers: [
          { id: 48, title: 'CREATE TABLE', sort_order: 1 },
          { id: 49, title: 'CREATE INDEX', sort_order: 2 },
          { id: 50, title: 'CREATE DATABASE', sort_order: 3 },
          { id: 51, title: 'CREATE SCHEMA', sort_order: 4 },
        ],
      },
      {
        id: 18,
        title:
          'COUNT, SUM, and INSERT INTO are some common MySQL aggregate functions.',
        question_type: 'single choice',
        max_score: 1,
        sort_order: 4,
        answers: [
          { id: 52, title: 'True', sort_order: 1 },
          { id: 53, title: 'False', sort_order: 2 },
        ],
      },
      {
        id: 19,
        title: 'Which command is used to insert new data into a MySQL table?',
        question_type: 'single choice',
        max_score: 1,
        sort_order: 5,
        answers: [
          { id: 54, title: 'ADD DATA', sort_order: 1 },
          { id: 55, title: 'INSERT DATA', sort_order: 2 },
          { id: 56, title: 'INSERT ROW', sort_order: 3 },
          { id: 57, title: 'INSERT INTO', sort_order: 4 },
        ],
      },
      {
        id: 20,
        title: 'Which command is used to delete a table from a MySQL database?',
        question_type: 'single choice',
        max_score: 1,
        sort_order: 6,
        answers: [
          { id: 58, title: 'DELETE TABLE', sort_order: 1 },
          { id: 59, title: 'DROP TABLE', sort_order: 2 },
          { id: 60, title: 'REMOVE TABLE', sort_order: 3 },
          { id: 61, title: 'ERASE TABLE', sort_order: 4 },
        ],
      },
      {
        id: 21,
        title:
          'Which builtin MySQL function can be used to add every value from a column together in a query?',
        question_type: 'single choice',
        max_score: 1,
        sort_order: 7,
        answers: [
          { id: 62, title: 'MAX', sort_order: 1 },
          { id: 63, title: 'TOGETHER', sort_order: 2 },
          { id: 64, title: 'TOTAL', sort_order: 3 },
          { id: 65, title: 'SUM', sort_order: 4 },
          { id: 66, title: 'MIN', sort_order: 5 },
          { id: 67, title: 'SUMTOTAL', sort_order: 6 },
          { id: 68, title: 'TOTALSUM', sort_order: 7 },
        ],
      },
      {
        id: 22,
        title: 'Which command is used to retrieve data from a MySQL table?',
        question_type: 'free response',
        max_score: 9,
        sort_order: 8,
      },
      {
        id: 23,
        title:
          'Which function is used to count the number of rows in a MySQL table?',
        question_type: 'free response',
        max_score: 9,
        sort_order: 9,
      },
      {
        id: 24,
        title:
          'Which keyword is used to specify the condition for a MySQL query?',
        question_type: 'free response',
        max_score: 10,
        sort_order: 10,
      },
    ],
  },
  program_assessment: {
    id: 1,
    program_id: 2,
    assessment_id: 2,
    available_after: '2023-02-06 00:00:00',
    due_date: '2023-03-24 00:00:00',
  },
  submission: {
    id: 17,
    assessment_id: 1,
    principal_id: 3,
    assessment_submission_state: 'Opened',
    opened_at: new Date().toISOString().slice(0, 19).replace('T', ' ') + 'Z',
  },
};
