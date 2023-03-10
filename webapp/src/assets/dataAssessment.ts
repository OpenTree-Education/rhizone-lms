import { AssessmentSummary } from '../types/api';

export const assessmentList: AssessmentSummary[] = [
  {
    curriculum_assessment: {
      id: 1,
      title: 'Assignment 1: React',
      description: 'Your assignment for week 1 learning.',
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
      highest_state: '??',
      most_recent_submitted_date: '2023-03-09',
      total_num_submissions: 1,
      highest_score: 10,
      assessment_submission_state: 'Graded',
    },
  },
  {
    curriculum_assessment: {
      id: 2,
      title: '2	SQL Quiz',
      description: 'A check on your SQL learning.',
      max_score: 5,
      max_num_submissions: 3,
      time_limit: -1,
      curriculum_id: 3,
      activity_id: 98,
      principal_id: 2,
    },
    program_assessment: {
      id: 1,
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
];
