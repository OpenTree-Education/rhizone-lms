import { DateTime, Settings } from 'luxon';

import {
  Answer,
  AssessmentDetails,
  AssessmentResponse,
  AssessmentSubmission,
  AssessmentWithSubmissions,
  CurriculumAssessment,
  FacilitatorAssessmentSubmissionsSummary,
  ParticipantAssessmentSubmissionsSummary,
  ProgramAssessment,
  Question,
  SavedAssessment,
} from '../../models';
import { mockQuery } from '../mockDb';

import {
  constructFacilitatorAssessmentSummary,
  constructParticipantAssessmentSummary,
  createAssessmentSubmission,
  createCurriculumAssessment,
  createProgramAssessment,
  deleteCurriculumAssessment,
  deleteProgramAssessment,
  facilitatorProgramIdsMatchingCurriculum,
  findProgramAssessment,
  getAssessmentSubmission,
  getCurriculumAssessment,
  getPrincipalProgramRole,
  listAllProgramAssessmentSubmissions,
  listParticipantProgramAssessmentSubmissions,
  listPrincipalEnrolledProgramIds,
  listProgramAssessments,
  removeGradingInformation,
  updateAssessmentSubmission,
  updateCurriculumAssessment,
  updateProgramAssessment,
} from '../assessmentsService';

/* EXAMPLE DATA: Variables */

const administratorPrincipalId = 3;
const participantPrincipalId = 30;
const unenrolledPrincipalId = 31;
const otherParticipantPrincipalId = 32;
const facilitatorPrincipalId = 300;
const curriculumId = 4;
const curriculumAssessmentId = 8;
const sentCurriculumAssessmentId = 9;
const programId = 12;
const programAssessmentId = 16;
const sentProgramAssessmentId = 17;
const activityId = 20;
const sentCAActivityId = 200;
const singleChoiceQuestionId = 24;
const freeResponseQuestionId = 24;
const singleChoiceAnswerId = 28;
const newSingleChoiceAnswerId = 280;
const freeResponseCorrectAnswerId = 29;
const assessmentSubmissionId = 32;
const assessmentSubmissionWrongId = 33;
const assessmentSubmissionByOtherParticipantId = 36;
const assessmentSubmissionResponseSCId = 320;
const assessmentSubmissionResponseFRId = 321;
const facilitatorProgramIdsThatMatchCurriculum = [12, 20, 30];
const facilitatorProgramIdsNotMatchingCurriculum = [40, 50];

/* EXAMPLE DATA: Database Rows */

const programParticipantRolesRows = [
  { id: 1, title: 'Facilitator' },
  { id: 2, title: 'Participant' },
];

const curriculumAssessmentsRows = [
  {
    id: 8,
    title: 'Assignment 1: React',
    description: 'Your assignment for week 1 learning.',
    max_score: 10,
    max_num_submissions: 1,
    time_limit: 120,
    curriculum_id: 4,
    activity_id: 20,
    principal_id: 3,
  },
  {
    id: 9,
    title: 'New Curriculum Quiz',
    description: null as string,
    max_score: 42,
    max_num_submissions: 13,
    time_limit: 60,
    curriculum_id: 4,
    activity_id: 200,
    principal_id: 300,
  },
];

const assessmentQuestionsRows = [
  {
    id: 24,
    assessment_id: 8,
    title: 'What is React?',
    description: null as string,
    question_type: 'single choice',
    correct_answer_id: 28,
    max_score: 1,
    sort_order: 1,
  },
  {
    id: 24,
    assessment_id: 8,
    title:
      'What is the correct HTML syntax for a paragraph with the text "Hello, World!"?',
    description: null as string,
    question_type: 'free response',
    correct_answer_id: 29,
    max_score: 1,
    sort_order: 1,
  },
];

const assessmentAnswersRows = [
  {
    id: 28,
    question_id: 24,
    title: 'A relational database management system',
    description: null as string,
    sort_order: 1,
    correct_answer: true,
  },
  {
    id: 29,
    question_id: 24,
    title: '<p>Hello, World!</p>',
    description: null as string,
    sort_order: 1,
    correct_answer: true,
  },
  {
    id: 28,
    question_id: 24,
    title: 'A relational database management system',
    description: 'Also known as a DBMS.',
    sort_order: 1,
    correct_answer: true,
  },
];

const programsRows = [
  {
    id: 12,
    title: 'Cohort 4',
    start_date: '2022-10-24',
    end_date: '2022-12-16',
    time_zone: 'America/Vancouver',
    curriculum_id: 4,
  },
];

const programAssessmentsRows = [
  {
    id: 16,
    program_id: 12,
    assessment_id: 8,
    available_after: '2023-02-06 00:00:00',
    due_date: '2050-06-24 00:00:00',
  },
  {
    id: 16,
    program_id: 12,
    assessment_id: 8,
    available_after: '2023-02-06 00:00:00',
    due_date: '2023-02-10 00:00:00',
  },
  {
    id: 16,
    program_id: 12,
    assessment_id: 8,
    available_after: '2050-06-24 00:00:00',
    due_date: '2050-06-23 00:00:00',
  },
  {
    id: 16,
    program_id: 12,
    assessment_id: 8,
    available_after: '2023-02-06 00:00:00',
    due_date: '2050-06-26 00:00:00',
  },
  {
    id: 16,
    program_id: 12,
    assessment_id: 8,
    available_after: '2023-02-06 00:00:00',
    due_date: '2050-06-24 00:00:00',
  },
];

const assessmentSubmissionsRows = [
  {
    id: 32,
    assessment_id: 16,
    principal_id: 30,
    assessment_submission_state: 'Opened',
    opened_at: '2023-02-09 12:00:00',
    submitted_at: null as string,
    updated_at: '2023-02-09 12:00:00',
    score: null as number,
  },
  {
    id: 32,
    assessment_id: 16,
    principal_id: 30,
    assessment_submission_state: 'In Progress',
    opened_at: '2023-02-09 12:00:00',
    submitted_at: null as string,
    updated_at: '2023-02-09 12:00:00',
    score: null as number,
  },
  {
    id: 32,
    assessment_id: 16,
    principal_id: 30,
    assessment_submission_state: 'Expired',
    opened_at: '2023-02-09 12:00:00',
    submitted_at: null as string,
    updated_at: '2023-02-09 14:00:00',
    score: null as number,
  },
  {
    id: 32,
    assessment_id: 16,
    principal_id: 30,
    assessment_submission_state: 'Submitted',
    opened_at: '2023-02-09 12:00:00',
    submitted_at: '2023-02-09 13:23:45',
    updated_at: '2023-02-09 13:23:45',
    score: null as number,
  },
  {
    id: 36,
    assessment_id: 16,
    principal_id: 32,
    assessment_submission_state: 'Submitted',
    opened_at: '2023-02-09 12:01:00',
    last_modified: '2023-02-09 12:01:00',
    submitted_at: '2023-02-09 13:23:45',
    updated_at: '2023-02-09 13:23:45',
    score: null as number,
  },
  {
    id: 32,
    assessment_id: 16,
    principal_id: 30,
    assessment_submission_state: 'Graded',
    opened_at: '2023-02-09 12:00:00',
    submitted_at: '2023-02-09 13:23:45',
    updated_at: '2023-02-09 13:23:45',
    score: 4,
  },
  {
    id: 32,
    assessment_id: 16,
    principal_id: 30,
    assessment_submission_state: 'Submitted',
    opened_at: '2023-02-09 12:00:00',
    submitted_at: '2023-02-09 13:23:45',
    updated_at: '2023-02-09 12:00:00',
    score: null as number,
    last_modified: '2023-02-09 13:23:45',
  },
];

const assessmentResponsesRows = [
  {
    id: 320,
    assessment_id: 16,
    submission_id: 32,
    question_id: 24,
    answer_id: null as number,
    response: null as string,
    score: null as number,
    grader_response: null as string,
  },
  {
    id: 320,
    assessment_id: 16,
    submission_id: 32,
    question_id: 24,
    answer_id: 28,
    response: null as string,
    score: null as number,
    grader_response: null as string,
  },
  {
    id: 320,
    assessment_id: 16,
    submission_id: 32,
    question_id: 24,
    answer_id: 28,
    response: null as string,
    score: null as number,
    grader_response: null as string,
  },
  {
    id: 320,
    assessment_id: 16,
    submission_id: 32,
    question_id: 24,
    answer_id: 28,
    response: null as string,
    score: 1,
    grader_response: 'Well done!',
  },
  {
    id: 321,
    assessment_id: 16,
    submission_id: 32,
    question_id: 24,
    answer_id: null as number,
    response: null as string,
  },
  {
    id: 321,
    assessment_id: 16,
    submission_id: 32,
    question_id: 24,
    answer_id: null as number,
    response: '<div>Hello world!</div>',
  },
  {
    id: 321,
    assessment_id: 16,
    submission_id: 32,
    question_id: 24,
    answer_id: null as number,
    response: '<div>Hello world!</div>',
    score: 0,
    grader_response: 'Very close!',
  },
  {
    id: 320,
    assessment_id: 16,
    submission_id: 32,
    question_id: 24,
    answer_id: 28,
    score: null as number,
    grader_response: 'Well done!',
  },
  {
    id: 321,
    assessment_id: 16,
    submission_id: 32,
    question_id: 24,
    response: '<div>Hello world!</div>',
    score: 0,
    grader_response: 'Very close!',
  },
];

/* EXAMPLE DATA: Structured Data */

const curriculumAssessments: CurriculumAssessment[] = [
  {
    id: 8,
    title: 'Assignment 1: React',
    assessment_type: 'test',
    description: 'Your assignment for week 1 learning.',
    max_score: 10,
    max_num_submissions: 1,
    time_limit: 120,
    curriculum_id: 4,
    activity_id: 20,
    principal_id: 3,
  },
  {
    id: 8,
    title: 'Assignment 1: React',
    assessment_type: 'test',
    description: 'Your assignment for week 1 learning.',
    max_score: 10,
    max_num_submissions: 1,
    time_limit: 120,
    curriculum_id: 4,
    activity_id: 20,
    principal_id: 3,
    questions: [
      {
        id: 24,
        assessment_id: 8,
        title: 'What is React?',
        description: null,
        question_type: 'single choice',
        max_score: 1,
        sort_order: 1,
        answers: [
          {
            id: 28,
            question_id: 24,
            description: null,
            title: 'A relational database management system',
            sort_order: 1,
          },
        ],
      },
    ],
  },
  {
    id: 8,
    title: 'Assignment 1: React',
    assessment_type: 'test',
    description: 'Your assignment for week 1 learning.',
    max_score: 10,
    max_num_submissions: 3,
    time_limit: 120,
    curriculum_id: 4,
    activity_id: 20,
    principal_id: 3,
    questions: [
      {
        id: 24,
        assessment_id: 8,
        title: 'What is React?',
        description: null,
        question_type: 'single choice',
        max_score: 1,
        sort_order: 1,
        answers: [
          {
            id: 28,
            question_id: 24,
            description: null,
            title: 'A relational database management system',
            sort_order: 1,
            correct_answer: true,
          },
        ],
        correct_answer_id: 28,
      },
    ],
  },
  {
    id: 8,
    title: 'Assignment 1: React',
    assessment_type: 'test',
    description: 'Your assignment for week 1 learning.',
    max_score: 10,
    max_num_submissions: 1,
    time_limit: 120,
    curriculum_id: 4,
    activity_id: 20,
    principal_id: 3,
    questions: [
      {
        id: 24,
        assessment_id: 8,
        title: 'What is React?',
        description: null,
        question_type: 'single choice',
        max_score: 1,
        sort_order: 1,
        answers: [
          {
            id: 28,
            question_id: 24,
            description: null,
            title: 'A relational database management system',
            sort_order: 1,
            correct_answer: true,
          },
        ],
        correct_answer_id: 28,
      },
    ],
  },
  {
    id: 8,
    title: 'Assignment 1: React',
    assessment_type: 'test',
    description: 'Your assignment for week 1 learning.',
    max_score: 10,
    max_num_submissions: 1,
    time_limit: 120,
    curriculum_id: 4,
    activity_id: 20,
    principal_id: 3,
    questions: [
      {
        id: 24,
        assessment_id: 8,
        title:
          'What is the correct HTML syntax for a paragraph with the text "Hello, World!"?',
        description: null,
        question_type: 'free response',
        answers: [
          {
            id: 29,
            question_id: 24,
            description: null,
            title: '<p>Hello, World!</p>',
            sort_order: 1,
            correct_answer: true,
          },
        ],
        correct_answer_id: 29,
        max_score: 1,
        sort_order: 1,
      },
    ],
  },
  {
    title: 'New Curriculum Quiz',
    assessment_type: 'quiz',
    description: null as string,
    max_score: 42,
    max_num_submissions: 13,
    time_limit: 60,
    curriculum_id: 4,
    activity_id: 200,
    principal_id: 300,
  },
  {
    title: 'New Curriculum Quiz',
    assessment_type: 'quiz',
    description: null,
    max_score: 42,
    max_num_submissions: 13,
    time_limit: 60,
    curriculum_id: 4,
    activity_id: 200,
    principal_id: 300,
    questions: [
      {
        assessment_id: 8,
        title: 'What is React?',
        description: null,
        question_type: 'single choice',
        answers: [
          {
            description: null,
            title: 'A relational database management system',
            sort_order: 1,
            correct_answer: true,
          },
        ],
        max_score: 1,
        sort_order: 1,
      },
    ],
  },
  {
    title: 'New Curriculum Quiz',
    assessment_type: 'quiz',
    description: null,
    max_score: 42,
    max_num_submissions: 13,
    time_limit: 60,
    curriculum_id: 4,
    activity_id: 200,
    principal_id: 300,
    questions: [
      {
        assessment_id: 8,
        title:
          'What is the correct HTML syntax for a paragraph with the text "Hello, World!"?',
        description: null,
        question_type: 'free response',
        answers: [
          {
            description: null,
            title: '<p>Hello, World!</p>',
            sort_order: 1,
            correct_answer: true,
          },
        ],
        max_score: 1,
        sort_order: 1,
      },
    ],
  },
  {
    id: 8,
    title: 'Assignment 1: React',
    assessment_type: 'test',
    description: 'Your assignment for week 1 learning.',
    max_score: 10,
    max_num_submissions: 1,
    time_limit: 121,
    curriculum_id: 4,
    activity_id: 20,
    principal_id: 3,
  },
  {
    id: 8,
    title: 'Assignment 1: React',
    assessment_type: 'test',
    description: 'Your assignment for week 1 learning.',
    max_score: 10,
    max_num_submissions: 1,
    time_limit: 120,
    curriculum_id: 4,
    activity_id: 20,
    principal_id: 3,
    questions: [
      {
        assessment_id: 8,
        title: 'What is React?',
        description: null,
        question_type: 'single choice',
        answers: [
          {
            description: null,
            title: 'A relational database management system',
            sort_order: 1,
            correct_answer: true,
          },
        ],
        max_score: 1,
        sort_order: 1,
      },
    ],
  },
  {
    id: 8,
    title: 'Assignment 1: React',
    assessment_type: 'test',
    description: 'Your assignment for week 1 learning.',
    max_score: 10,
    max_num_submissions: 1,
    time_limit: 120,
    curriculum_id: 4,
    activity_id: 20,
    principal_id: 3,
    questions: [
      {
        assessment_id: 8,
        title: 'What is React?',
        description: null,
        question_type: 'single choice',
        answers: [
          {
            description: null,
            title: 'A relational database management system',
            sort_order: 1,
            correct_answer: true,
          },
        ],
        max_score: 1,
        sort_order: 1,
      },
    ],
  },
  {
    id: 8,
    title: 'Assignment 1: React',
    assessment_type: 'test',
    description: 'Your assignment for week 1 learning.',
    max_score: 10,
    max_num_submissions: 1,
    time_limit: 120,
    curriculum_id: 4,
    activity_id: 20,
    principal_id: 3,
    questions: [
      {
        id: 24,
        assessment_id: 8,
        title: 'What is React?',
        description: null,
        question_type: 'single choice',
        max_score: 1,
        sort_order: 1,
        answers: [
          {
            description: null,
            title: 'A relational database management system',
            sort_order: 1,
            correct_answer: true,
          },
        ],
      },
    ],
  },
  {
    id: 8,
    title: 'Assignment 1: React',
    assessment_type: 'test',
    description: 'Your assignment for week 1 learning.',
    max_score: 10,
    max_num_submissions: 1,
    time_limit: 120,
    curriculum_id: 4,
    activity_id: 20,
    principal_id: 3,
    questions: [
      {
        id: 24,
        assessment_id: 8,
        title: 'What is React?',
        description: null,
        question_type: 'single choice',
        max_score: 1,
        sort_order: 1,
        answers: [
          {
            id: 28,
            question_id: 24,
            description: 'Also known as a DBMS.',
            title: 'A relational database management system',
            sort_order: 1,
            correct_answer: true,
          },
        ],
        correct_answer_id: 28,
      },
    ],
  },
  {
    title: 'New Curriculum Quiz',
    assessment_type: 'quiz',
    description: null as string,
    max_score: 42,
    max_num_submissions: 13,
    time_limit: 60,
    curriculum_id: 4,
    activity_id: 200,
    principal_id: 300,
    id: 9,
  },
  {
    title: 'New Curriculum Quiz',
    assessment_type: 'quiz',
    description: null,
    max_score: 42,
    max_num_submissions: 13,
    time_limit: 60,
    curriculum_id: 4,
    activity_id: 200,
    principal_id: 300,
    id: 9,
    questions: [
      {
        id: 24,
        assessment_id: 8,
        title: 'What is React?',
        description: null,
        question_type: 'single choice',
        max_score: 1,
        sort_order: 1,
        answers: [
          {
            id: 28,
            question_id: 24,
            description: null,
            title: 'A relational database management system',
            sort_order: 1,
            correct_answer: true,
          },
        ],
        correct_answer_id: 28,
      },
    ],
  },
  {
    title: 'New Curriculum Quiz',
    assessment_type: 'quiz',
    description: null,
    max_score: 42,
    max_num_submissions: 13,
    time_limit: 60,
    curriculum_id: 4,
    activity_id: 200,
    principal_id: 300,
    id: 9,
    questions: [
      {
        id: 24,
        assessment_id: 8,
        title:
          'What is the correct HTML syntax for a paragraph with the text "Hello, World!"?',
        description: null,
        question_type: 'free response',
        answers: [
          {
            id: 29,
            question_id: 24,
            description: null,
            title: '<p>Hello, World!</p>',
            sort_order: 1,
            correct_answer: true,
          },
        ],
        correct_answer_id: 29,
        max_score: 1,
        sort_order: 1,
      },
    ],
  },
];

const answers: Answer[] = [
  {
    id: 28,
    question_id: 24,
    description: null as string,
    title: 'A relational database management system',
    sort_order: 1,
  },
  {
    id: 28,
    question_id: 24,
    description: null as string,
    title: 'A relational database management system',
    sort_order: 1,
    correct_answer: true,
  },
  {
    id: 29,
    question_id: 24,
    description: null as string,
    title: '<p>Hello, World!</p>',
    sort_order: 1,
  },
  {
    id: 29,
    question_id: 24,
    description: null as string,
    title: '<p>Hello, World!</p>',
    sort_order: 1,
    correct_answer: true,
  },
  {
    description: null as string,
    title: 'A relational database management system',
    sort_order: 1,
    correct_answer: true,
  },
  {
    description: null as string,
    title: '<p>Hello, World!</p>',
    sort_order: 1,
    correct_answer: true,
  },
  {
    id: 28,
    question_id: 24,
    description: 'Also known as a DBMS.',
    title: 'A relational database management system',
    sort_order: 1,
    correct_answer: true,
  },
];

const questions: Question[] = [
  {
    id: 24,
    assessment_id: 8,
    title: 'What is React?',
    description: null as string,
    question_type: 'single choice',
    max_score: 1,
    sort_order: 1,
  },
  {
    id: 24,
    assessment_id: 8,
    title: 'What is React?',
    description: null as string,
    question_type: 'single choice',
    max_score: 1,
    sort_order: 1,
    answers: [
      {
        id: 28,
        question_id: 24,
        description: null as string,
        title: 'A relational database management system',
        sort_order: 1,
      },
    ],
  },
  {
    id: 24,
    assessment_id: 8,
    title: 'What is React?',
    description: null as string,
    question_type: 'single choice',
    max_score: 1,
    sort_order: 1,
    answers: [
      {
        id: 28,
        question_id: 24,
        description: null as string,
        title: 'A relational database management system',
        sort_order: 1,
        correct_answer: true,
      },
    ],
    correct_answer_id: 28,
  },
  {
    id: 24,
    assessment_id: 8,
    title:
      'What is the correct HTML syntax for a paragraph with the text "Hello, World!"?',
    description: null as string,
    question_type: 'free response',
    answers: [
      {
        id: 29,
        question_id: 24,
        description: null as string,
        title: '<p>Hello, World!</p>',
        sort_order: 1,
        correct_answer: true,
      },
    ],
    correct_answer_id: 29,
    max_score: 1,
    sort_order: 1,
  },
  {
    assessment_id: 8,
    title: 'What is React?',
    description: null as string,
    question_type: 'single choice',
    answers: [
      {
        description: null as string,
        title: 'A relational database management system',
        sort_order: 1,
        correct_answer: true,
      },
    ],
    max_score: 1,
    sort_order: 1,
  },
  {
    assessment_id: 8,
    title:
      'What is the correct HTML syntax for a paragraph with the text "Hello, World!"?',
    description: null as string,
    question_type: 'free response',
    answers: [
      {
        description: null as string,
        title: '<p>Hello, World!</p>',
        sort_order: 1,
        correct_answer: true,
      },
    ],
    max_score: 1,
    sort_order: 1,
  },
  {
    id: 24,
    assessment_id: 8,
    title: 'What is React?',
    description: null as string,
    question_type: 'single choice',
    max_score: 1,
    sort_order: 1,
    answers: [
      {
        description: null as string,
        title: 'A relational database management system',
        sort_order: 1,
        correct_answer: true,
      },
    ],
  },
  {
    id: 24,
    assessment_id: 8,
    title: 'What is React?',
    description: null as string,
    question_type: 'single choice',
    max_score: 1,
    sort_order: 1,
    answers: [
      {
        id: 28,
        question_id: 24,
        description: 'Also known as a DBMS.',
        title: 'A relational database management system',
        sort_order: 1,
        correct_answer: true,
      },
    ],
    correct_answer_id: 28,
  },
];

const programAssessments: ProgramAssessment[] = [
  {
    id: 16,
    program_id: 12,
    assessment_id: 8,
    available_after: '2023-02-06T00:00:00.000-08:00',
    due_date: '2050-06-24T00:00:00.000-07:00',
  },
  {
    id: 16,
    program_id: 12,
    assessment_id: 8,
    available_after: '2023-02-06T00:00:00.000-08:00',
    due_date: '2023-02-10T00:00:00.000-08:00',
  },
  {
    id: 16,
    program_id: 12,
    assessment_id: 8,
    available_after: '2050-06-24T00:00:00.000-07:00',
    due_date: '2050-06-23T00:00:00.000-07:00',
  },
  {
    program_id: 12,
    assessment_id: 8,
    available_after: '2023-02-06 00:00:00',
    due_date: '2050-06-24 00:00:00',
  },
];

const assessmentDetails: AssessmentDetails[] = [
  {
    curriculum_assessment: {
      id: 8,
      title: 'Assignment 1: React',
      assessment_type: 'test',
      description: 'Your assignment for week 1 learning.',
      max_score: 10,
      max_num_submissions: 1,
      time_limit: 120,
      curriculum_id: 4,
      activity_id: 20,
      principal_id: 3,
      questions: [
        {
          id: 24,
          assessment_id: 8,
          title: 'What is React?',
          description: null,
          question_type: 'single choice',
          max_score: 1,
          sort_order: 1,
          answers: [
            {
              id: 28,
              question_id: 24,
              description: null,
              title: 'A relational database management system',
              sort_order: 1,
              correct_answer: true,
            },
          ],
          correct_answer_id: 28,
        },
      ],
    },
    program_assessment: {
      id: 16,
      program_id: 12,
      assessment_id: 8,
      available_after: '2023-02-06T00:00:00.000-08:00',
      due_date: '2050-06-24T00:00:00.000-07:00',
    },
  },
];

const participantSummaries: ParticipantAssessmentSubmissionsSummary[] = [
  {
    principal_id: 30,
    highest_state: 'Inactive',
    total_num_submissions: 0,
  },
  {
    principal_id: 30,
    highest_state: 'Expired',
    total_num_submissions: 1,
  },
  {
    principal_id: 30,
    highest_state: 'Active',
    total_num_submissions: 0,
  },
  {
    principal_id: 30,
    highest_state: 'Graded',
    most_recent_submitted_date: '2023-02-09T13:23:45.000Z',
    total_num_submissions: 1,
    highest_score: 4,
  },
];

const facilitatorSummaries: FacilitatorAssessmentSubmissionsSummary[] = [
  {
    num_participants_with_submissions: 8,
    num_program_participants: 12,
    num_ungraded_submissions: 6,
  },
];

const assessmentResponses: AssessmentResponse[] = [
  {
    id: 320,
    assessment_id: 16,
    submission_id: 32,
    question_id: 24,
  },
  {
    id: 320,
    assessment_id: 16,
    submission_id: 32,
    question_id: 24,
    answer_id: 28,
  },
  {
    id: 320,
    assessment_id: 16,
    submission_id: 32,
    question_id: 24,
    answer_id: 28,
    score: 1,
    grader_response: 'Well done!',
  },
  {
    id: 321,
    assessment_id: 16,
    submission_id: 32,
    question_id: 24,
  },
  {
    id: 321,
    assessment_id: 16,
    submission_id: 32,
    question_id: 24,
    response_text: '<div>Hello world!</div>',
  },
  {
    id: 321,
    assessment_id: 16,
    submission_id: 32,
    question_id: 24,
    response_text: '<div>Hello world!</div>',
    score: 0,
    grader_response: 'Very close!',
  },
  {
    assessment_id: 16,
    submission_id: 32,
    question_id: 24,
    answer_id: 28,
  },
  {
    assessment_id: 16,
    submission_id: 32,
    question_id: 24,
    response_text: '<div>Hello world!</div>',
  },
  {
    assessment_id: 16,
    submission_id: 32,
    question_id: 24,
    answer_id: 28,
    id: 320,
    score: null as number,
    grader_response: null as string,
  },
  {
    assessment_id: 16,
    submission_id: 32,
    question_id: 24,
    response_text: '<div>Hello world!</div>',
    id: 321,
    score: null as number,
    grader_response: null as string,
  },
  {
    assessment_id: 16,
    submission_id: 32,
    question_id: 24,
    answer_id: 28,
    id: 320,
    score: 1,
    grader_response: 'Well done!',
  },
  {
    id: 321,
    assessment_id: 16,
    submission_id: 32,
    question_id: 24,
    response_text: '<div>Hello world!</div>',
    score: 0,
    grader_response: 'Very close!',
  },
];

const assessmentSubmissions: AssessmentSubmission[] = [
  {
    id: 32,
    assessment_id: 16,
    principal_id: 30,
    assessment_submission_state: 'Opened',
    opened_at: '2023-02-09T12:00:00.000Z',
    last_modified: '2023-02-09T12:00:00.000Z',
  },
  {
    id: 32,
    assessment_id: 16,
    principal_id: 30,
    assessment_submission_state: 'Opened',
    opened_at: '2023-02-09T12:00:00.000Z',
    last_modified: '2023-02-09T12:00:00.000Z',
    responses: [
      { id: 320, assessment_id: 16, submission_id: 32, question_id: 24 },
    ],
  },
  {
    id: 32,
    assessment_id: 16,
    principal_id: 30,
    assessment_submission_state: 'In Progress',
    opened_at: '2023-02-09T12:00:00.000Z',
    last_modified: '2023-02-09T12:05:00.000Z',
    responses: [
      {
        id: 320,
        assessment_id: 16,
        submission_id: 32,
        question_id: 24,
        answer_id: 28,
      },
    ],
  },
  {
    id: 32,
    assessment_id: 16,
    principal_id: 30,
    assessment_submission_state: 'In Progress',
    opened_at: '2023-02-09T12:00:00.000Z',
    last_modified: '2023-02-09T12:05:00.000Z',
    responses: [
      {
        id: 321,
        assessment_id: 16,
        submission_id: 32,
        question_id: 24,
        response_text: '<div>Hello world!</div>',
      },
    ],
  },
  {
    id: 32,
    assessment_id: 16,
    principal_id: 30,
    assessment_submission_state: 'In Progress',
    opened_at: '2023-02-09T12:00:00.000Z',
    last_modified: '2023-02-09T12:05:00.000Z',
    responses: [
      {
        id: 320,
        assessment_id: 16,
        submission_id: 32,
        question_id: 24,
        answer_id: 28,
      },
      {
        id: 321,
        assessment_id: 16,
        submission_id: 32,
        question_id: 24,
        response_text: '<div>Hello world!</div>',
      },
    ],
  },
  {
    id: 32,
    assessment_id: 16,
    principal_id: 30,
    assessment_submission_state: 'In Progress',
    opened_at: '2023-02-10T07:00:00.000Z',
    last_modified: '2023-02-10T07:05:00.000Z',
    responses: [
      {
        id: 320,
        assessment_id: 16,
        submission_id: 32,
        question_id: 24,
        answer_id: 28,
      },
      {
        id: 321,
        assessment_id: 16,
        submission_id: 32,
        question_id: 24,
        response_text: '<div>Hello world!</div>',
      },
    ],
  },
  {
    id: 32,
    assessment_id: 16,
    principal_id: 30,
    assessment_submission_state: 'Expired',
    opened_at: '2023-02-10T07:00:00.000Z',
    last_modified: '2023-02-17T08:00:10.000Z',
    responses: [
      {
        id: 320,
        assessment_id: 16,
        submission_id: 32,
        question_id: 24,
        answer_id: 28,
      },
      {
        id: 321,
        assessment_id: 16,
        submission_id: 32,
        question_id: 24,
        response_text: '<div>Hello world!</div>',
      },
    ],
  },
  {
    id: 32,
    assessment_id: 16,
    principal_id: 30,
    assessment_submission_state: 'Expired',
    opened_at: '2023-02-09T12:00:00.000Z',
    last_modified: '2023-02-09T14:00:00.000Z',
    responses: [
      {
        id: 320,
        assessment_id: 16,
        submission_id: 32,
        question_id: 24,
        answer_id: 28,
      },
    ],
  },
  {
    id: 32,
    assessment_id: 16,
    principal_id: 30,
    assessment_submission_state: 'Expired',
    opened_at: '2023-02-09T12:00:00.000Z',
    last_modified: '2023-02-16T14:00:10.000Z',
    responses: [
      {
        id: 320,
        assessment_id: 16,
        submission_id: 32,
        question_id: 24,
        answer_id: 28,
      },
    ],
  },
  {
    id: 32,
    assessment_id: 16,
    principal_id: 30,
    assessment_submission_state: 'Submitted',
    opened_at: '2023-02-09T12:00:00.000Z',
    last_modified: '2023-02-09T13:23:45.000Z',
    submitted_at: '2023-02-09T13:23:45.000Z',
    responses: [
      {
        id: 320,
        assessment_id: 16,
        submission_id: 32,
        question_id: 24,
        answer_id: 28,
      },
    ],
  },
  {
    id: 32,
    assessment_id: 16,
    principal_id: 30,
    assessment_submission_state: 'Submitted',
    opened_at: '2023-02-09T12:00:00.000Z',
    last_modified: '2023-02-09T13:23:45.000Z',
    submitted_at: '2023-02-09T13:23:45.000Z',
    responses: [
      {
        id: 321,
        assessment_id: 16,
        submission_id: 32,
        question_id: 24,
        response_text: '<div>Hello world!</div>',
      },
    ],
  },
  {
    id: 36,
    assessment_id: 16,
    principal_id: 32,
    assessment_submission_state: 'Submitted',
    opened_at: '2023-02-09T12:01:00.000Z',
    submitted_at: '2023-02-09T13:23:45.000Z',
    last_modified: '2023-02-09T13:23:45.000Z',
  },
  {
    id: 32,
    assessment_id: 16,
    principal_id: 30,
    assessment_submission_state: 'Graded',
    opened_at: '2023-02-09T12:00:00.000Z',
    last_modified: '2023-02-09T13:23:45.000Z',
    submitted_at: '2023-02-09T13:23:45.000Z',
    score: 4,
  },
  {
    id: 32,
    assessment_id: 16,
    principal_id: 30,
    assessment_submission_state: 'Graded',
    opened_at: '2023-02-09T12:00:00.000Z',
    last_modified: '2023-02-09T13:23:45.000Z',
    submitted_at: '2023-02-09T13:23:45.000Z',
    score: 4,
    responses: [
      {
        id: 320,
        assessment_id: 16,
        submission_id: 32,
        question_id: 24,
        answer_id: 28,
        score: 1,
        grader_response: 'Well done!',
      },
    ],
  },
  {
    id: 32,
    assessment_id: 16,
    principal_id: 30,
    assessment_submission_state: 'Graded',
    opened_at: '2023-02-09T12:00:00.000Z',
    last_modified: '2023-02-09T13:23:45.000Z',
    submitted_at: '2023-02-09T13:23:45.000Z',
    responses: [
      {
        id: 320,
        assessment_id: 16,
        submission_id: 32,
        question_id: 24,
        answer_id: 28,
      },
    ],
  },
  {
    id: 32,
    assessment_id: 16,
    principal_id: 30,
    assessment_submission_state: 'Opened',
    opened_at: '2023-02-09T12:00:00.000Z',
    last_modified: '2023-02-09T12:05:00.000Z',
    responses: [
      {
        assessment_id: 16,
        submission_id: 32,
        question_id: 24,
        answer_id: 28,
      },
    ],
  },
  {
    id: 32,
    assessment_id: 16,
    principal_id: 30,
    assessment_submission_state: 'Opened',
    opened_at: '2023-02-09T12:00:00.000Z',
    last_modified: '2023-02-09T12:05:00.000Z',
    responses: [
      {
        assessment_id: 16,
        submission_id: 32,
        question_id: 24,
        response_text: '<div>Hello world!</div>',
      },
    ],
  },
  {
    id: 32,
    assessment_id: 16,
    principal_id: 30,
    assessment_submission_state: 'Submitted',
    opened_at: '2023-02-09T12:00:00.000Z',
    last_modified: '2023-02-10T13:23:45.000Z',
    submitted_at: '2023-02-09T13:23:45.000Z',
    responses: [
      {
        assessment_id: 16,
        submission_id: 32,
        question_id: 24,
        answer_id: 28,
        id: 320,
        score: null as number,
        grader_response: null as string,
      },
    ],
  },
  {
    id: 32,
    assessment_id: 16,
    principal_id: 30,
    assessment_submission_state: 'Submitted',
    opened_at: '2023-02-09T12:00:00.000Z',
    last_modified: '2023-02-10T13:23:45.000Z',
    submitted_at: '2023-02-09T13:23:45.000Z',
    responses: [
      {
        assessment_id: 16,
        submission_id: 32,
        question_id: 24,
        response_text: '<div>Hello world!</div>',
        id: 321,
        score: null as number,
        grader_response: null as string,
      },
    ],
  },
  {
    id: 33,
    assessment_id: 16,
    principal_id: 30,
    assessment_submission_state: 'Submitted',
    opened_at: '2023-02-09T12:00:00.000Z',
    last_modified: '2023-02-10T13:23:45.000Z',
    submitted_at: '2023-02-09T13:23:45.000Z',
    responses: [
      {
        assessment_id: 16,
        submission_id: 32,
        question_id: 24,
        answer_id: 28,
        id: 320,
        score: null as number,
        grader_response: null as string,
      },
    ],
  },
];

const assessmentsWithSubmissions: AssessmentWithSubmissions[] = [
  {
    curriculum_assessment: {
      id: 8,
      title: 'Assignment 1: React',
      assessment_type: 'test',
      description: 'Your assignment for week 1 learning.',
      max_score: 10,
      max_num_submissions: 1,
      time_limit: 120,
      curriculum_id: 4,
      activity_id: 20,
      principal_id: 3,
    },
    program_assessment: {
      id: 16,
      program_id: 12,
      assessment_id: 8,
      available_after: '2023-02-06T00:00:00.000-08:00',
      due_date: '2050-06-24T00:00:00.000-07:00',
    },
    principal_program_role: 'Participant',
    submissions: [
      {
        id: 32,
        assessment_id: 16,
        principal_id: 30,
        assessment_submission_state: 'In Progress',
        opened_at: '2023-02-09T12:00:00.000Z',
        last_modified: '2023-02-09T12:05:00.000Z',
        responses: [
          {
            id: 320,
            assessment_id: 16,
            submission_id: 32,
            question_id: 24,
            answer_id: 28,
          },
        ],
      },
    ],
  },
  {
    curriculum_assessment: {
      id: 8,
      title: 'Assignment 1: React',
      assessment_type: 'test',
      description: 'Your assignment for week 1 learning.',
      max_score: 10,
      max_num_submissions: 1,
      time_limit: 120,
      curriculum_id: 4,
      activity_id: 20,
      principal_id: 3,
    },
    program_assessment: {
      id: 16,
      program_id: 12,
      assessment_id: 8,
      available_after: '2023-02-06T00:00:00.000-08:00',
      due_date: '2050-06-24T00:00:00.000-07:00',
    },
    principal_program_role: 'Facilitator',
    submissions: [
      {
        id: 32,
        assessment_id: 16,
        principal_id: 30,
        assessment_submission_state: 'In Progress',
        opened_at: '2023-02-09T12:00:00.000Z',
        last_modified: '2023-02-09T12:05:00.000Z',
        responses: [
          {
            id: 320,
            assessment_id: 16,
            submission_id: 32,
            question_id: 24,
            answer_id: 28,
          },
        ],
      },
      {
        id: 36,
        assessment_id: 16,
        principal_id: 32,
        assessment_submission_state: 'Submitted',
        opened_at: '2023-02-09T12:01:00.000Z',
        submitted_at: '2023-02-09T13:23:45.000Z',
        last_modified: '2023-02-09T13:23:45.000Z',
      },
    ],
  },
];

const savedAssessments: SavedAssessment[] = [
  {
    curriculum_assessment: {
      id: 8,
      title: 'Assignment 1: React',
      assessment_type: 'test',
      description: 'Your assignment for week 1 learning.',
      max_score: 10,
      max_num_submissions: 1,
      time_limit: 120,
      curriculum_id: 4,
      activity_id: 20,
      principal_id: 3,
      questions: [
        {
          id: 24,
          assessment_id: 8,
          title: 'What is React?',
          description: null,
          question_type: 'single choice',
          max_score: 1,
          sort_order: 1,
          answers: [
            {
              id: 28,
              question_id: 24,
              description: null,
              title: 'A relational database management system',
              sort_order: 1,
            },
          ],
        },
      ],
    },
    program_assessment: {
      id: 16,
      program_id: 12,
      assessment_id: 8,
      available_after: '2023-02-06T00:00:00.000-08:00',
      due_date: '2050-06-24T00:00:00.000-07:00',
    },
    principal_program_role: 'Participant',
    submission: {
      id: 32,
      assessment_id: 16,
      principal_id: 30,
      assessment_submission_state: 'Opened',
      opened_at: '2023-02-09T12:00:00.000Z',
      last_modified: '2023-02-09T12:00:00.000Z',
    },
  },
  {
    curriculum_assessment: {
      id: 8,
      title: 'Assignment 1: React',
      assessment_type: 'test',
      description: 'Your assignment for week 1 learning.',
      max_score: 10,
      max_num_submissions: 3,
      time_limit: 120,
      curriculum_id: 4,
      activity_id: 20,
      principal_id: 3,
      questions: [
        {
          id: 24,
          assessment_id: 8,
          title: 'What is React?',
          description: null,
          question_type: 'single choice',
          max_score: 1,
          sort_order: 1,
          answers: [
            {
              id: 28,
              question_id: 24,
              description: null,
              title: 'A relational database management system',
              sort_order: 1,
              correct_answer: true,
            },
          ],
          correct_answer_id: 28,
        },
      ],
    },
    program_assessment: {
      id: 16,
      program_id: 12,
      assessment_id: 8,
      available_after: '2023-02-06T00:00:00.000-08:00',
      due_date: '2050-06-24T00:00:00.000-07:00',
    },
    principal_program_role: 'Participant',
    submission: {
      id: 32,
      assessment_id: 16,
      principal_id: 30,
      assessment_submission_state: 'Opened',
      opened_at: '2023-02-09T12:00:00.000Z',
      last_modified: '2023-02-09T12:00:00.000Z',
    },
  },
];

/* EXAMPLE DATA: Friendly Names */

/* eslint-disable prefer-destructuring */
const matchingCurriculumAssessmentRow = curriculumAssessmentsRows[0];
const newCurriculumAssessmentsRow = curriculumAssessmentsRows[1];

const matchingAssessmentQuestionsSCRow = assessmentQuestionsRows[0];
const matchingAssessmentQuestionsFRRow = assessmentQuestionsRows[1];

const matchingAssessmentAnswersSCRow = assessmentAnswersRows[0];
const matchingAssessmentAnswersFRRow = assessmentAnswersRows[1];
const updatedAssessmentAnswersSCRow = assessmentAnswersRows[2];

const matchingProgramAssessmentsRow = programAssessmentsRows[0];
const matchingProgramAssessmentPastDueRow = programAssessmentsRows[1];
const matchingProgramAssessmentNotAvailableRow = programAssessmentsRows[2];
const updatedProgramAssessmentsRow = programAssessmentsRows[3];
const newProgramAssessmentsRow = programAssessmentsRows[4];

const matchingAssessmentSubmissionOpenedRow = assessmentSubmissionsRows[0];
const matchingAssessmentSubmissionInProgressRow = assessmentSubmissionsRows[1];
const matchingAssessmentSubmissionExpiredRow = assessmentSubmissionsRows[2];
const matchingAssessmentSubmissionsSubmittedRow = assessmentSubmissionsRows[3];
const matchingOtherAssessmentSubmissionSubmittedRow =
  assessmentSubmissionsRows[4];
const matchingAssessmentSubmissionsRowGraded = assessmentSubmissionsRows[5];
const updatedAssessmentSubmissionsRow = assessmentSubmissionsRows[6];

const matchingAssessmentResponsesRowSCOpened = assessmentResponsesRows[0];
const matchingAssessmentResponsesRowSCInProgress = assessmentResponsesRows[1];
const matchingAssessmentResponsesRowSCSubmitted = assessmentResponsesRows[2];
const matchingAssessmentResponsesRowSCGraded = assessmentResponsesRows[3];
const matchingAssessmentResponsesRowFROpened = assessmentResponsesRows[4];
const matchingAssessmentResponsesRowFRInProgress = assessmentResponsesRows[5];
const matchingAssessmentResponsesRowFRGraded = assessmentResponsesRows[6];
const updatedAssessmentResponsesSCGradedRow = assessmentResponsesRows[7];
const updatedAssessmentResponsesFRGradedRow = assessmentResponsesRows[8];

const matchingProgramRow = programsRows[0];

const exampleAssessmentQuestionSCBase = questions[0];
const exampleAssessmentQuestionSCWithoutCorrectAnswers = questions[1];
const exampleAssessmentQuestionSCWithCorrectAnswers = questions[2];
const exampleAssessmentQuestionFRWithCorrectAnswers = questions[3];
const sentNewSCAssessmentQuestion = questions[4];
const sentNewFRAssessmentQuestion = questions[5];
const sentAssessmentSCQuestionNewAnswer = questions[6];
const sentAssessmentQuestionSCWithUpdatedCorrectAnswer = questions[7];

const exampleCurriculumAssessment = curriculumAssessments[0];
const exampleCurriculumAssessmentWithSCQuestions = curriculumAssessments[1];
const exampleCurriculumAssessmentMultipleSubmissionsWithQuestions =
  curriculumAssessments[2];
const exampleCurriculumAssessmentWithSCCorrectAnswers =
  curriculumAssessments[3];
const exampleCurriculumAssessmentWithFRCorrectAnswers =
  curriculumAssessments[4];
const sentNewCurriculumAssessment = curriculumAssessments[5];
const sentNewCurriculumAssessmentWithSCQuestion = curriculumAssessments[6];
const sentNewCurriculumAssessmentWithFRQuestion = curriculumAssessments[7];
const sentUpdatedCurriculumAssessment = curriculumAssessments[8];
const sentCurriculumAssessmentWithNewSCQuestion = curriculumAssessments[9];
const sentCurriculumAssessmentWithNewSCQuestion2 = curriculumAssessments[10];
const sentCurriculumAssessmentWithSCQuestionNewAnswer =
  curriculumAssessments[11];
const exampleCurriculumAssessmentWithUpdatedSCCorrectAnswer =
  curriculumAssessments[12];
const sentNewCurriculumAssessmentPostInsert = curriculumAssessments[13];
const sentNewCurriculumAssessmentWithSCQuestionPostInsert =
  curriculumAssessments[14];
const sentNewCurriculumAssessmentWithFRQuestionPostInsert =
  curriculumAssessments[15];

const exampleProgramAssessment = programAssessments[0];
const exampleProgramAssessmentPastDue = programAssessments[1];
const exampleProgramAssessmentNotAvailable = programAssessments[2];
const sentNewProgramAssessment = programAssessments[3];

const exampleAssessmentWithSCCorrectAnswersDetails = assessmentDetails[0];

const exampleParticipantAssessmentSubmissionsInactive = participantSummaries[0];
const exampleParticipantAssessmentSubmissionsPastDue = participantSummaries[1];
const exampleParticipantAssessmentSubmissionsActive = participantSummaries[2];
const exampleParticipantAssessmentSubmissionsSummary = participantSummaries[3];

const exampleFacilitatorAssessmentSubmissionsSummary = facilitatorSummaries[0];

const exampleAssessmentResponseSCUnanswered = assessmentResponses[0];
const exampleAssessmentResponseSCAnswered = assessmentResponses[1];
const exampleAssessmentResponseSCGraded = assessmentResponses[2];
const exampleAssessmentResponseFRUnanswered = assessmentResponses[3];
const exampleAssessmentResponseFRAnswered = assessmentResponses[4];
const exampleAssessmentResponseFRGraded = assessmentResponses[5];
const sentNewSCAssessmentResponse = assessmentResponses[6];
const sentNewFRAssessmentResponse = assessmentResponses[7];
const sentUpdatedAssessmentSubmissionSCResponseSubmitted =
  assessmentResponses[8];
const sentUpdatedAssessmentSubmissionFRResponseSubmitted =
  assessmentResponses[9];
const sentUpdatedAssessmentSubmissionSCResponseGraded = assessmentResponses[10];
const sentUpdatedAssessmentSubmissionFRResponseGraded = assessmentResponses[11];

const exampleAssessmentSubmissionOpened = assessmentSubmissions[0];
const exampleAssessmentSubmissionOpenedWithResponse = assessmentSubmissions[1];
const exampleAssessmentSubmissionInProgress = assessmentSubmissions[2];
const exampleAssessmentSubmissionFRInProgress = assessmentSubmissions[3];
const exampleAssessmentSubmissionInProgressSCFR = assessmentSubmissions[4];
const exampleAssessmentSubmissionInProgressSCFRLateStart =
  assessmentSubmissions[5];
const exampleAssessmentSubmissionPastDueDate = assessmentSubmissions[6];
const exampleAssessmentSubmissionExpired = assessmentSubmissions[7];
const exampleAssessmentSubmissionExpiredPlusWeek = assessmentSubmissions[8];
const exampleAssessmentSubmissionSubmitted = assessmentSubmissions[9];
const exampleAssessmentSubmissionFRSubmitted = assessmentSubmissions[10];
const exampleOtherAssessmentSubmissionSubmitted = assessmentSubmissions[11];
const exampleAssessmentSubmissionGradedNoResponses = assessmentSubmissions[12];
const exampleAssessmentSubmissionGraded = assessmentSubmissions[13];
const exampleAssessmentSubmissionGradedRemovedGrades =
  assessmentSubmissions[14];
const sentUpdatedAssessmentSubmissionWithNewSCResponse =
  assessmentSubmissions[15];
const sentUpdatedAssessmentSubmissionWithNewFRResponse =
  assessmentSubmissions[16];
const sentUpdatedAssessmentSubmissionChangedResponse =
  assessmentSubmissions[17];
const sentUpdatedAssessmentSubmissionChangedFRResponse =
  assessmentSubmissions[18];
const sentUpdatedAssessmentSubmissionChangedResponseWithWrongID =
  assessmentSubmissions[19];

const exampleParticipantAssessmentWithSubmissions =
  assessmentsWithSubmissions[0];
const exampleFacilitatorAssessmentWithSubmissions =
  assessmentsWithSubmissions[1];

const exampleParticipantOpenedSavedAssessment = savedAssessments[0];
const exampleParticipantOpenedSavedMultipleSubmissionsAssessment =
  savedAssessments[1];

const exampleAssessmentSCAnswerWithoutCorrectAnswer = answers[0];
const exampleAssessmentSCAnswerWithCorrectAnswer = answers[1];
const exampleAssessmentFRAnswerWithoutCorrectAnswer = answers[2];
const exampleAssessmentFRAnswerWithCorrectAnswer = answers[3];
const sentNewSCAssessmentAnswer = answers[4];
const sentNewFRAssessmentAnswer = answers[5];
const sentAssessmentSCAnswerWithUpdatedCorrectAnswer = answers[6];

describe('constructFacilitatorAssessmentSummary', () => {
  it('should gather the relevant information for constructing a FacilitatorAssessmentSubmissionsSummary for a given program assessment', async () => {
    mockQuery(
      'select count(distinct `principal_id`) as `count` from `assessment_submissions` where `assessment_id` = ?',
      [exampleProgramAssessment.id],
      [
        {
          count:
            exampleFacilitatorAssessmentSubmissionsSummary.num_participants_with_submissions,
        },
      ]
    );
    mockQuery(
      'select count(`id`) as `count` from `program_participants` where `program_id` = ? and `role_id` = ?',
      [exampleProgramAssessment.program_id, 2],
      [
        {
          count:
            exampleFacilitatorAssessmentSubmissionsSummary.num_program_participants,
        },
      ]
    );
    mockQuery(
      'select count(`id`) as `count` from `assessment_submissions` where `assessment_id` = ? and `score` is null',
      [exampleProgramAssessment.id],
      [
        {
          count:
            exampleFacilitatorAssessmentSubmissionsSummary.num_ungraded_submissions,
        },
      ]
    );

    expect(
      await constructFacilitatorAssessmentSummary(exampleProgramAssessment)
    ).toEqual(exampleFacilitatorAssessmentSubmissionsSummary);
  });
});

describe('constructParticipantAssessmentSummary', () => {
  it('should gather the relevant information for constructing a ParticipantAssessmentSubmissionsSummary for a given program assessment', async () => {
    mockQuery(
      'select `assessment_submission_states`.`title` from `assessment_submissions` inner join `assessment_submission_states` on `assessment_submission_states`.`id` = `assessment_submissions`.`assessment_submission_state_id` where `assessment_submissions`.`principal_id` = ? and `assessment_submissions`.`assessment_id` = ? order by `assessment_submissions`.`assessment_submission_state_id` desc limit ?',
      [participantPrincipalId, exampleProgramAssessment.id, 1],
      [
        {
          title:
            matchingAssessmentSubmissionsRowGraded.assessment_submission_state,
        },
      ]
    );
    mockQuery(
      'select `submitted_at` from `assessment_submissions` where `principal_id` = ? and `assessment_id` = ? order by `submitted_at` desc limit ?',
      [participantPrincipalId, exampleProgramAssessment.id, 1],
      [
        {
          submitted_at: matchingAssessmentSubmissionsRowGraded.submitted_at,
        },
      ]
    );
    mockQuery(
      'select `assessment_submissions`.`id` as `id`, `assessment_submission_states`.`title` as `assessment_submission_state`, `assessment_submissions`.`score`, `assessment_submissions`.`opened_at`, `assessment_submissions`.`submitted_at`, `assessment_submissions`.`updated_at` from `assessment_submissions` inner join `assessment_submission_states` on `assessment_submissions`.`assessment_submission_state_id` = `assessment_submission_states`.`id` where `assessment_submissions`.`principal_id` = ? and `assessment_submissions`.`assessment_id` = ?',
      [participantPrincipalId, exampleProgramAssessment.id],
      [matchingAssessmentSubmissionsRowGraded]
    );
    mockQuery(
      'select `score` from `assessment_submissions` where `principal_id` = ? and `assessment_id` = ? order by `score` desc limit ?',
      [participantPrincipalId, exampleProgramAssessment.id, 1],
      [{ score: matchingAssessmentSubmissionsRowGraded.score }]
    );

    expect(
      await constructParticipantAssessmentSummary(
        participantPrincipalId,
        exampleProgramAssessment
      )
    ).toEqual(exampleParticipantAssessmentSubmissionsSummary);
  });

  it('should gather the relevant information for constructing a ParticipantAssessmentSubmissionsSummary even if no submissions, before assessment is active', async () => {
    mockQuery(
      'select `assessment_submission_states`.`title` from `assessment_submissions` inner join `assessment_submission_states` on `assessment_submission_states`.`id` = `assessment_submissions`.`assessment_submission_state_id` where `assessment_submissions`.`principal_id` = ? and `assessment_submissions`.`assessment_id` = ? order by `assessment_submissions`.`assessment_submission_state_id` desc limit ?',
      [participantPrincipalId, exampleProgramAssessment.id, 1],
      []
    );
    mockQuery(
      'select `submitted_at` from `assessment_submissions` where `principal_id` = ? and `assessment_id` = ? order by `submitted_at` desc limit ?',
      [participantPrincipalId, exampleProgramAssessment.id, 1],
      []
    );

    mockQuery(
      'select `assessment_submissions`.`id` as `id`, `assessment_submission_states`.`title` as `assessment_submission_state`, `assessment_submissions`.`score`, `assessment_submissions`.`opened_at`, `assessment_submissions`.`submitted_at`, `assessment_submissions`.`updated_at` from `assessment_submissions` inner join `assessment_submission_states` on `assessment_submissions`.`assessment_submission_state_id` = `assessment_submission_states`.`id` where `assessment_submissions`.`principal_id` = ? and `assessment_submissions`.`assessment_id` = ?',
      [participantPrincipalId, exampleProgramAssessment.id],
      []
    );
    mockQuery(
      'select `score` from `assessment_submissions` where `principal_id` = ? and `assessment_id` = ? order by `score` desc limit ?',
      [participantPrincipalId, exampleProgramAssessment.id, 1],
      []
    );

    expect(
      await constructParticipantAssessmentSummary(
        participantPrincipalId,
        exampleProgramAssessmentNotAvailable
      )
    ).toEqual(exampleParticipantAssessmentSubmissionsInactive);
  });

  it('should gather the relevant information for constructing a ParticipantAssessmentSubmissionsSummary even if no submissions, for an active assessment', async () => {
    mockQuery(
      'select `assessment_submission_states`.`title` from `assessment_submissions` inner join `assessment_submission_states` on `assessment_submission_states`.`id` = `assessment_submissions`.`assessment_submission_state_id` where `assessment_submissions`.`principal_id` = ? and `assessment_submissions`.`assessment_id` = ? order by `assessment_submissions`.`assessment_submission_state_id` desc limit ?',
      [participantPrincipalId, exampleProgramAssessment.id, 1],
      []
    );
    mockQuery(
      'select `submitted_at` from `assessment_submissions` where `principal_id` = ? and `assessment_id` = ? order by `submitted_at` desc limit ?',
      [participantPrincipalId, exampleProgramAssessment.id, 1],
      []
    );
    mockQuery(
      'select `assessment_submissions`.`id` as `id`, `assessment_submission_states`.`title` as `assessment_submission_state`, `assessment_submissions`.`score`, `assessment_submissions`.`opened_at`, `assessment_submissions`.`submitted_at`, `assessment_submissions`.`updated_at` from `assessment_submissions` inner join `assessment_submission_states` on `assessment_submissions`.`assessment_submission_state_id` = `assessment_submission_states`.`id` where `assessment_submissions`.`principal_id` = ? and `assessment_submissions`.`assessment_id` = ?',
      [participantPrincipalId, exampleProgramAssessment.id],
      []
    );
    mockQuery(
      'select `score` from `assessment_submissions` where `principal_id` = ? and `assessment_id` = ? order by `score` desc limit ?',
      [participantPrincipalId, exampleProgramAssessment.id, 1],
      []
    );

    expect(
      await constructParticipantAssessmentSummary(
        participantPrincipalId,
        exampleProgramAssessment
      )
    ).toEqual(exampleParticipantAssessmentSubmissionsActive);
  });

  it('should gather the relevant information for constructing a ParticipantAssessmentSubmissionsSummary even if no submissions, after assessment is due', async () => {
    mockQuery(
      'select `assessment_submission_states`.`title` from `assessment_submissions` inner join `assessment_submission_states` on `assessment_submission_states`.`id` = `assessment_submissions`.`assessment_submission_state_id` where `assessment_submissions`.`principal_id` = ? and `assessment_submissions`.`assessment_id` = ? order by `assessment_submissions`.`assessment_submission_state_id` desc limit ?',
      [participantPrincipalId, exampleProgramAssessment.id, 1],
      []
    );
    mockQuery(
      'select `submitted_at` from `assessment_submissions` where `principal_id` = ? and `assessment_id` = ? order by `submitted_at` desc limit ?',
      [participantPrincipalId, exampleProgramAssessment.id, 1],
      []
    );
    mockQuery(
      'select `assessment_submissions`.`id` as `id`, `assessment_submission_states`.`title` as `assessment_submission_state`, `assessment_submissions`.`score`, `assessment_submissions`.`opened_at`, `assessment_submissions`.`submitted_at`, `assessment_submissions`.`updated_at` from `assessment_submissions` inner join `assessment_submission_states` on `assessment_submissions`.`assessment_submission_state_id` = `assessment_submission_states`.`id` where `assessment_submissions`.`principal_id` = ? and `assessment_submissions`.`assessment_id` = ?',
      [participantPrincipalId, exampleProgramAssessment.id],
      [1]
    );
    mockQuery(
      'select `score` from `assessment_submissions` where `principal_id` = ? and `assessment_id` = ? order by `score` desc limit ?',
      [participantPrincipalId, exampleProgramAssessment.id, 1],
      []
    );

    expect(
      await constructParticipantAssessmentSummary(
        participantPrincipalId,
        exampleProgramAssessmentPastDue
      )
    ).toEqual(exampleParticipantAssessmentSubmissionsPastDue);
  });
});

describe('createAssessmentSubmission', () => {
  it('should create a new AssessmentSubmission for a program assessment', async () => {
    const expectedNow = DateTime.utc(2023, 2, 9, 12, 0, 0);
    Settings.now = () => expectedNow.toMillis();

    mockQuery(
      'select `id` from `assessment_submission_states` where `title` = ?',
      ['Opened'],
      [{ id: 3 }]
    );
    mockQuery(
      'insert into `assessment_submissions` (`assessment_id`, `assessment_submission_state_id`, `principal_id`) values (?, ?, ?)',
      [exampleProgramAssessment.id, 3, participantPrincipalId],
      [exampleAssessmentSubmissionOpenedWithResponse.id]
    );
    mockQuery(
      'select `id` from `assessment_questions` where `assessment_id` = ?',
      [exampleProgramAssessment.assessment_id],
      [{ id: singleChoiceQuestionId }]
    );
    mockQuery(
      'insert into `assessment_responses` (`answer_id`, `assessment_id`, `question_id`, `response`, `submission_id`) values (DEFAULT, ?, ?, DEFAULT, ?)',
      [
        exampleProgramAssessment.id,
        singleChoiceQuestionId,
        exampleAssessmentSubmissionOpenedWithResponse.id,
      ],
      [assessmentSubmissionResponseSCId]
    );

    expect(
      await createAssessmentSubmission(
        participantPrincipalId,
        exampleProgramAssessment.id,
        exampleProgramAssessment.assessment_id
      )
    ).toEqual(exampleAssessmentSubmissionOpenedWithResponse);
  });
});

describe('createCurriculumAssessment', () => {
  it('should create a curriculum assessment ID without question', async () => {
    mockQuery(
      'insert into `curriculum_assessments` (`activity_id`, `curriculum_id`, `description`, `max_num_submissions`, `max_score`, `principal_id`, `time_limit`, `title`) values (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        sentNewCurriculumAssessment.activity_id,
        sentNewCurriculumAssessment.curriculum_id,
        sentNewCurriculumAssessment.description,
        sentNewCurriculumAssessment.max_num_submissions,
        sentNewCurriculumAssessment.max_score,
        sentNewCurriculumAssessment.principal_id,
        sentNewCurriculumAssessment.time_limit,
        sentNewCurriculumAssessment.title,
      ],
      [sentNewCurriculumAssessmentPostInsert.id]
    );
    expect(
      await createCurriculumAssessment(sentNewCurriculumAssessment)
    ).toEqual(sentNewCurriculumAssessmentPostInsert);
  });

  it('should create a curriculum assessment ID with a single choice question', async () => {
    mockQuery(
      'insert into `curriculum_assessments` (`activity_id`, `curriculum_id`, `description`, `max_num_submissions`, `max_score`, `principal_id`, `time_limit`, `title`) values (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        sentNewCurriculumAssessmentWithSCQuestion.activity_id,
        sentNewCurriculumAssessmentWithSCQuestion.curriculum_id,
        sentNewCurriculumAssessmentWithSCQuestion.description,
        sentNewCurriculumAssessmentWithSCQuestion.max_num_submissions,
        sentNewCurriculumAssessmentWithSCQuestion.max_score,
        sentNewCurriculumAssessmentWithSCQuestion.principal_id,
        sentNewCurriculumAssessmentWithSCQuestion.time_limit,
        sentNewCurriculumAssessmentWithSCQuestion.title,
      ],
      [sentNewCurriculumAssessmentWithSCQuestionPostInsert.id]
    );
    mockQuery(
      'insert into `assessment_questions` (`assessment_id`, `description`, `max_score`, `question_type_id`, `sort_order`, `title`) values (?, ?, ?, ?, ?, ?)',
      [
        sentNewCurriculumAssessmentWithSCQuestionPostInsert.id,
        sentNewSCAssessmentQuestion.description,
        sentNewSCAssessmentQuestion.max_score,
        1,
        sentNewSCAssessmentQuestion.sort_order,
        sentNewSCAssessmentQuestion.title,
      ],
      [singleChoiceQuestionId]
    );
    mockQuery(
      'insert into `assessment_answers` (`description`, `question_id`, `sort_order`, `title`) values (?, ?, ?, ?)',
      [
        sentNewSCAssessmentAnswer.description,
        singleChoiceQuestionId,
        sentNewSCAssessmentAnswer.sort_order,
        sentNewSCAssessmentAnswer.title,
      ],
      [singleChoiceAnswerId]
    );
    mockQuery(
      'update `assessment_questions` set `correct_answer_id` = ? where `id` = ?',
      [singleChoiceAnswerId, singleChoiceQuestionId],
      []
    );
    expect(
      await createCurriculumAssessment(
        sentNewCurriculumAssessmentWithSCQuestion
      )
    ).toEqual(sentNewCurriculumAssessmentWithSCQuestionPostInsert);
  });

  it('should create a curriculum assessment ID with a free response question', async () => {
    mockQuery(
      'insert into `curriculum_assessments` (`activity_id`, `curriculum_id`, `description`, `max_num_submissions`, `max_score`, `principal_id`, `time_limit`, `title`) values (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        sentNewCurriculumAssessmentWithFRQuestion.activity_id,
        sentNewCurriculumAssessmentWithFRQuestion.curriculum_id,
        sentNewCurriculumAssessmentWithFRQuestion.description,
        sentNewCurriculumAssessmentWithFRQuestion.max_num_submissions,
        sentNewCurriculumAssessmentWithFRQuestion.max_score,
        sentNewCurriculumAssessmentWithFRQuestion.principal_id,
        sentNewCurriculumAssessmentWithFRQuestion.time_limit,
        sentNewCurriculumAssessmentWithFRQuestion.title,
      ],
      [sentNewCurriculumAssessmentWithFRQuestionPostInsert.id]
    );
    mockQuery(
      'insert into `assessment_questions` (`assessment_id`, `description`, `max_score`, `question_type_id`, `sort_order`, `title`) values (?, ?, ?, ?, ?, ?)',
      [
        sentNewCurriculumAssessmentWithFRQuestionPostInsert.id,
        sentNewFRAssessmentQuestion.description,
        sentNewFRAssessmentQuestion.max_score,
        2,
        sentNewFRAssessmentQuestion.sort_order,
        sentNewFRAssessmentQuestion.title,
      ],
      [freeResponseQuestionId]
    );
    mockQuery(
      'insert into `assessment_answers` (`description`, `question_id`, `sort_order`, `title`) values (?, ?, ?, ?)',
      [
        sentNewFRAssessmentAnswer.description,
        freeResponseQuestionId,
        sentNewFRAssessmentAnswer.sort_order,
        sentNewFRAssessmentAnswer.title,
      ],
      [freeResponseCorrectAnswerId]
    );
    mockQuery(
      'update `assessment_questions` set `correct_answer_id` = ? where `id` = ?',
      [freeResponseCorrectAnswerId, freeResponseQuestionId],
      []
    );
    expect(
      await createCurriculumAssessment(
        sentNewCurriculumAssessmentWithFRQuestion
      )
    ).toEqual(sentNewCurriculumAssessmentWithFRQuestionPostInsert);
  });
});

describe('createProgramAssessment', () => {
  it('should insert a ProgramAssessment into the database', async () => {
    mockQuery(
      'insert into `program_assessments` (`assessment_id`, `available_after`, `due_date`, `program_id`) values (?, ?, ?, ?)',
      [
        sentNewProgramAssessment.assessment_id,
        sentNewProgramAssessment.available_after,
        sentNewProgramAssessment.due_date,
        sentNewProgramAssessment.program_id,
      ],
      [newProgramAssessmentsRow.id]
    );

    mockQuery(
      'select `id`, `title`, `start_date`, `end_date`, `time_zone`, `curriculum_id` from `programs` where `id` = ?',
      [sentNewProgramAssessment.program_id],
      [matchingProgramRow]
    );

    expect(await createProgramAssessment(sentNewProgramAssessment)).toEqual(
      exampleProgramAssessment
    );
  });
});

describe('deleteCurriculumAssessment', () => {
  it('should delete a CurriculumAssessment from the database', async () => {
    mockQuery(
      'delete from `curriculum_assessments` where `id` = ?',
      [curriculumAssessmentId],
      [1]
    );

    expect(await deleteCurriculumAssessment(curriculumAssessmentId)).toEqual([
      1,
    ]);
  });
});

describe('deleteProgramAssessment', () => {
  it('should delete a ProgramAssessment from  the database', async () => {
    mockQuery(
      'delete from `program_assessments` where `id` = ?',
      [programAssessmentId],
      [1]
    );

    expect(await deleteProgramAssessment(programAssessmentId)).toEqual([1]);
  });
});

describe('facilitatorProgramIdsMatchingCurriculum', () => {
  it('should return an array of program IDs for a principal that is facilitator of at least one program', async () => {
    mockQuery(
      'select `program_id` from `program_participants` where `principal_id` = ?',
      [facilitatorPrincipalId],
      [{ program_id: exampleProgramAssessment.program_id }]
    );
    mockQuery(
      'select `id`, `title`, `start_date`, `end_date`, `time_zone`, `curriculum_id` from `programs` where `curriculum_id` = ?',
      [exampleCurriculumAssessment.curriculum_id],
      [matchingProgramRow]
    );
    mockQuery(
      'select `program_participant_roles`.`title` from `program_participant_roles` inner join `program_participants` on `program_participant_roles`.`id` = `program_participants`.`role_id` where `principal_id` = ? and `program_id` = ?',
      [facilitatorPrincipalId, exampleProgramAssessment.program_id],
      [{ title: 'Facilitator' }]
    );

    expect(
      await facilitatorProgramIdsMatchingCurriculum(
        facilitatorPrincipalId,
        exampleCurriculumAssessment.curriculum_id
      )
    ).toEqual([exampleProgramAssessment.program_id]);
  });

  it('should return an empty array of program IDs for a principal that is not a facilitator of at least one program', async () => {
    mockQuery(
      'select `program_id` from `program_participants` where `principal_id` = ?',
      [participantPrincipalId],
      []
    );
    expect(
      await facilitatorProgramIdsMatchingCurriculum(
        participantPrincipalId,
        exampleCurriculumAssessment.curriculum_id
      )
    ).toEqual([]);
  });
});

describe('findProgramAssessment', () => {
  it('should return a ProgramAssessment for an existing program assessment ID', async () => {
    mockQuery(
      'select `program_id`, `assessment_id`, `available_after`, `due_date` from `program_assessments` where `id` = ?',
      [exampleProgramAssessment.id],
      [matchingProgramAssessmentsRow]
    );

    mockQuery(
      'select `id`, `title`, `start_date`, `end_date`, `time_zone`, `curriculum_id` from `programs` where `id` = ?',
      [exampleProgramAssessment.program_id],
      [matchingProgramRow]
    );

    expect(await findProgramAssessment(exampleProgramAssessment.id)).toEqual(
      exampleProgramAssessment
    );
  });

  it('should return null for a program assessment ID that does not exist', async () => {
    mockQuery(
      'select `program_id`, `assessment_id`, `available_after`, `due_date` from `program_assessments` where `id` = ?',
      [exampleProgramAssessment.id],
      []
    );

    expect(await findProgramAssessment(exampleProgramAssessment.id)).toEqual(
      null
    );
  });
});

describe('getAssessmentSubmission', () => {
  it('should get assessment submission based on given submission ID', async () => {
    const assessmentSubmissionId = exampleAssessmentSubmissionGraded.id;
    const responsesIncluded = true;
    const gradingsIncluded = true;

    mockQuery(
      'select `assessment_submissions`.`assessment_id`, `assessment_submissions`.`principal_id`, `assessment_submission_states`.`title` as `assessment_submission_state`, `assessment_submissions`.`score`, `assessment_submissions`.`opened_at`, `assessment_submissions`.`submitted_at`, `assessment_submissions`.`updated_at` from `assessment_submissions` inner join `assessment_submission_states` on `assessment_submissions`.`assessment_submission_state_id` = `assessment_submission_states`.`id` where `assessment_submissions`.`id` = ?',
      [assessmentSubmissionId],
      [matchingAssessmentSubmissionsRowGraded]
    );

    mockQuery(
      'select `id`, `assessment_id`, `question_id`, `answer_id`, `response`, `score`, `grader_response` from `assessment_responses` where `submission_id` = ?',
      [assessmentSubmissionId],
      [matchingAssessmentResponsesRowSCGraded]
    );

    expect(
      await getAssessmentSubmission(
        assessmentSubmissionId,
        responsesIncluded,
        gradingsIncluded
      )
    ).toEqual(exampleAssessmentSubmissionGraded);
  });

  it('should get assessment submission with null for responses (if no responses found) based on given submission ID', async () => {
    const assessmentSubmissionId = matchingAssessmentSubmissionOpenedRow.id;
    const responsesIncluded = true;
    const gradingsIncluded = true;

    mockQuery(
      'select `assessment_submissions`.`assessment_id`, `assessment_submissions`.`principal_id`, `assessment_submission_states`.`title` as `assessment_submission_state`, `assessment_submissions`.`score`, `assessment_submissions`.`opened_at`, `assessment_submissions`.`submitted_at`, `assessment_submissions`.`updated_at` from `assessment_submissions` inner join `assessment_submission_states` on `assessment_submissions`.`assessment_submission_state_id` = `assessment_submission_states`.`id` where `assessment_submissions`.`id` = ?',
      [assessmentSubmissionId],
      [matchingAssessmentSubmissionOpenedRow]
    );

    mockQuery(
      'select `id`, `assessment_id`, `question_id`, `answer_id`, `response`, `score`, `grader_response` from `assessment_responses` where `submission_id` = ?',
      [assessmentSubmissionId],
      []
    );

    expect(
      await getAssessmentSubmission(
        assessmentSubmissionId,
        responsesIncluded,
        gradingsIncluded
      )
    ).toEqual(exampleAssessmentSubmissionOpened);
  });

  it('should return null for a assessment submission ID that does not exist', async () => {
    mockQuery(
      'select `assessment_submissions`.`assessment_id`, `assessment_submissions`.`principal_id`, `assessment_submission_states`.`title` as `assessment_submission_state`, `assessment_submissions`.`score`, `assessment_submissions`.`opened_at`, `assessment_submissions`.`submitted_at`, `assessment_submissions`.`updated_at` from `assessment_submissions` inner join `assessment_submission_states` on `assessment_submissions`.`assessment_submission_state_id` = `assessment_submission_states`.`id` where `assessment_submissions`.`id` = ?',
      [exampleAssessmentSubmissionGraded.id],
      []
    );

    expect(
      await getAssessmentSubmission(
        exampleAssessmentSubmissionGraded.id,
        true,
        true
      )
    ).toEqual(null);
  });
});

describe('getCurriculumAssessment', () => {
  it('should return a CurriculumAssessment for an existing curriculum assessment ID', async () => {
    const questionsAndAllAnswersIncluded = true,
      questionsAndCorrectAnswersIncluded = true;

    mockQuery(
      'select `curriculum_assessments`.`title`, `curriculum_assessments`.`max_score`, `curriculum_assessments`.`max_num_submissions`, `curriculum_assessments`.`time_limit`, `curriculum_assessments`.`curriculum_id`, `curriculum_assessments`.`activity_id`, `curriculum_assessments`.`principal_id` from `curriculum_assessments` inner join `activities` on `curriculum_assessments`.`curriculum_id` = `activities`.`id` where `curriculum_assessments`.`id` = ?',
      [curriculumAssessmentId],
      [matchingCurriculumAssessmentRow]
    );
    mockQuery(
      'select `activity_types`.`title` from `activity_types` inner join `activities` on `activities`.`activity_type_id` = `activity_types`.`id` where `activities`.`id` = ?',
      [matchingCurriculumAssessmentRow.activity_id],
      [
        {
          title:
            exampleCurriculumAssessmentWithSCCorrectAnswers.assessment_type,
        },
      ]
    );
    mockQuery(
      'select `assessment_questions`.`id`, `assessment_questions`.`title`, `description`, `assessment_question_types`.`title` as `question_type`, `correct_answer_id`, `max_score`, `sort_order` from `assessment_questions` inner join `assessment_question_types` on `assessment_questions`.`question_type_id` = `assessment_question_types`.`id` where `assessment_questions`.`assessment_id` = ? order by `sort_order` asc',
      [exampleCurriculumAssessmentWithSCCorrectAnswers.id],
      [matchingAssessmentQuestionsSCRow]
    );

    const questionIds = [matchingAssessmentQuestionsSCRow.id];

    mockQuery(
      'select `id`, `question_id`, `title`, `description`, `sort_order` from `assessment_answers` where `question_id` = ? order by `sort_order` asc',
      [questionIds[0]],
      [matchingAssessmentAnswersSCRow]
    );

    expect(
      await getCurriculumAssessment(
        exampleCurriculumAssessmentWithSCCorrectAnswers.id,
        questionsAndAllAnswersIncluded,
        questionsAndCorrectAnswersIncluded
      )
    ).toEqual(exampleCurriculumAssessmentWithSCCorrectAnswers);
  });

  it('should return null for a curriculum assessment ID that does not exist', async () => {
    mockQuery(
      'select `curriculum_assessments`.`title`, `curriculum_assessments`.`max_score`, `curriculum_assessments`.`max_num_submissions`, `curriculum_assessments`.`time_limit`, `curriculum_assessments`.`curriculum_id`, `curriculum_assessments`.`activity_id`, `curriculum_assessments`.`principal_id` from `curriculum_assessments` inner join `activities` on `curriculum_assessments`.`curriculum_id` = `activities`.`id` where `curriculum_assessments`.`id` = ?',
      [curriculumAssessmentId],
      []
    );

    expect(
      await getCurriculumAssessment(curriculumAssessmentId, true, true)
    ).toEqual(null);
  });
});

describe('getPrincipalProgramRole', () => {
  it('should return the correct role for a facilitator based on principal ID and program ID', async () => {
    mockQuery(
      'select `program_participant_roles`.`title` from `program_participant_roles` inner join `program_participants` on `program_participant_roles`.`id` = `program_participants`.`role_id` where `principal_id` = ? and `program_id` = ?',
      [facilitatorPrincipalId, exampleProgramAssessment.program_id],
      [programParticipantRolesRows[0]]
    );

    expect(
      await getPrincipalProgramRole(
        facilitatorPrincipalId,
        exampleProgramAssessment.program_id
      )
    ).toEqual('Facilitator');
  });

  it('should return the correct role for a participant based on principal ID and program ID', async () => {
    mockQuery(
      'select `program_participant_roles`.`title` from `program_participant_roles` inner join `program_participants` on `program_participant_roles`.`id` = `program_participants`.`role_id` where `principal_id` = ? and `program_id` = ?',
      [participantPrincipalId, exampleProgramAssessment.program_id],
      [programParticipantRolesRows[1]]
    );

    expect(
      await getPrincipalProgramRole(
        participantPrincipalId,
        exampleProgramAssessment.program_id
      )
    ).toEqual('Participant');
  });

  it('should return null for a user not enrolled in the program', async () => {
    mockQuery(
      'select `program_participant_roles`.`title` from `program_participant_roles` inner join `program_participants` on `program_participant_roles`.`id` = `program_participants`.`role_id` where `principal_id` = ? and `program_id` = ?',
      [unenrolledPrincipalId, exampleProgramAssessment.program_id],
      []
    );

    expect(
      await getPrincipalProgramRole(
        unenrolledPrincipalId,
        exampleProgramAssessment.program_id
      )
    ).toEqual(null);
  });
});

describe('listAllProgramAssessmentSubmissions', () => {
  it('should return all program assessment submissions for a given program assessment', async () => {
    mockQuery(
      'select `assessment_submissions`.`id`, `assessment_submission_states`.`title` as `assessment_submission_state`, `assessment_submissions`.`principal_id`, `assessment_submissions`.`score`, `assessment_submissions`.`opened_at`, `assessment_submissions`.`submitted_at`, `assessment_submissions`.`updated_at` from `assessment_submissions` inner join `assessment_submission_states` on `assessment_submissions`.`assessment_submission_state_id` = `assessment_submission_states`.`id` where `assessment_id` = ?',
      [exampleAssessmentSubmissionOpened.assessment_id],
      [
        matchingAssessmentSubmissionOpenedRow,
        matchingOtherAssessmentSubmissionSubmittedRow,
        matchingAssessmentSubmissionsRowGraded,
      ]
    );

    expect(
      await listAllProgramAssessmentSubmissions(
        exampleAssessmentSubmissionOpened.assessment_id
      )
    ).toEqual([
      exampleAssessmentSubmissionOpened,
      exampleOtherAssessmentSubmissionSubmitted,
      exampleAssessmentSubmissionGradedNoResponses,
    ]);
  });

  it('should return null if no program assessment submissions for a given program assessment', async () => {
    mockQuery(
      'select `assessment_submissions`.`id`, `assessment_submission_states`.`title` as `assessment_submission_state`, `assessment_submissions`.`principal_id`, `assessment_submissions`.`score`, `assessment_submissions`.`opened_at`, `assessment_submissions`.`submitted_at`, `assessment_submissions`.`updated_at` from `assessment_submissions` inner join `assessment_submission_states` on `assessment_submissions`.`assessment_submission_state_id` = `assessment_submission_states`.`id` where `assessment_id` = ?',
      [exampleAssessmentSubmissionOpened.assessment_id],
      []
    );

    expect(
      await listAllProgramAssessmentSubmissions(
        exampleAssessmentSubmissionOpened.assessment_id
      )
    ).toEqual(null);
  });
});

describe('listParticipantProgramAssessmentSubmissions', () => {
  it('should return program assessment submissions for a participant for a given program assessment', async () => {
    mockQuery(
      'select `assessment_submissions`.`id` as `id`, `assessment_submission_states`.`title` as `assessment_submission_state`, `assessment_submissions`.`score`, `assessment_submissions`.`opened_at`, `assessment_submissions`.`submitted_at`, `assessment_submissions`.`updated_at` from `assessment_submissions` inner join `assessment_submission_states` on `assessment_submissions`.`assessment_submission_state_id` = `assessment_submission_states`.`id` where `assessment_submissions`.`principal_id` = ? and `assessment_submissions`.`assessment_id` = ?',
      [participantPrincipalId, exampleAssessmentSubmissionOpened.assessment_id],
      [matchingAssessmentSubmissionOpenedRow]
    );
    expect(
      await listParticipantProgramAssessmentSubmissions(
        participantPrincipalId,
        exampleAssessmentSubmissionOpened.assessment_id
      )
    ).toEqual([exampleAssessmentSubmissionOpened]);
  });

  it('should return null if no program assessment submissions for a given program assessment', async () => {
    mockQuery(
      'select `assessment_submissions`.`id` as `id`, `assessment_submission_states`.`title` as `assessment_submission_state`, `assessment_submissions`.`score`, `assessment_submissions`.`opened_at`, `assessment_submissions`.`submitted_at`, `assessment_submissions`.`updated_at` from `assessment_submissions` inner join `assessment_submission_states` on `assessment_submissions`.`assessment_submission_state_id` = `assessment_submission_states`.`id` where `assessment_submissions`.`principal_id` = ? and `assessment_submissions`.`assessment_id` = ?',
      [participantPrincipalId, exampleAssessmentSubmissionOpened.assessment_id],
      []
    );

    expect(
      await listParticipantProgramAssessmentSubmissions(
        participantPrincipalId,
        exampleAssessmentSubmissionOpened.assessment_id
      )
    ).toEqual(null);
  });
});

describe('listPrincipalEnrolledProgramIds', () => {
  const enrolledProgramsList = [{ program_id: 2 }];
  it('should return program Id list for  which a principal is ficilitator ', async () => {
    mockQuery(
      'select `program_id` from `program_participants` where `principal_id` = ?',
      [facilitatorPrincipalId],
      enrolledProgramsList
    );
    expect(
      await listPrincipalEnrolledProgramIds(facilitatorPrincipalId)
    ).toEqual([enrolledProgramsList[0].program_id]);
  });
  it('should return program Id list for  which a principal is participant enrolloed in program ', async () => {
    mockQuery(
      'select `program_id` from `program_participants` where `principal_id` = ?',
      [participantPrincipalId],
      enrolledProgramsList
    );
    expect(
      await listPrincipalEnrolledProgramIds(participantPrincipalId)
    ).toEqual([enrolledProgramsList[0].program_id]);
  });
});

describe('listProgramAssessments', () => {
  it('should return all ProgramAssessments linked to a program ID', async () => {
    mockQuery(
      'select `id`, `assessment_id`, `available_after`, `due_date` from `program_assessments` where `program_id` = ?',
      [matchingProgramAssessmentsRow.program_id],
      [matchingProgramAssessmentsRow]
    );

    mockQuery(
      'select `id`, `title`, `start_date`, `end_date`, `time_zone`, `curriculum_id` from `programs` where `id` = ?',
      [matchingProgramAssessmentsRow.program_id],
      [matchingProgramRow]
    );

    expect(
      await listProgramAssessments(matchingProgramAssessmentsRow.program_id)
    ).toEqual([exampleProgramAssessment]);
  });

  it('should return null if no ProgramAssessments linked to a program ID were found', async () => {
    mockQuery(
      'select `id`, `assessment_id`, `available_after`, `due_date` from `program_assessments` where `program_id` = ?',
      [matchingProgramAssessmentsRow.program_id],
      []
    );

    expect(
      await listProgramAssessments(matchingProgramAssessmentsRow.program_id)
    ).toEqual(null);
  });
});

describe('removeGradingInformation', () => {
  it('should remove all grading-related information from an AssessmentSubmission', () => {
    expect(removeGradingInformation(exampleAssessmentSubmissionGraded)).toEqual(
      exampleAssessmentSubmissionGradedRemovedGrades
    );
  });
});

describe('updateAssessmentSubmission', () => {
  it('should update an existing in-progress assessment submission by a participant with a changed response', async () => {
    const expectedNow = DateTime.utc(2023, 2, 9, 12, 5, 0);
    Settings.now = () => expectedNow.toMillis();

    mockQuery(
      'select `assessment_submissions`.`assessment_id`, `assessment_submissions`.`principal_id`, `assessment_submission_states`.`title` as `assessment_submission_state`, `assessment_submissions`.`score`, `assessment_submissions`.`opened_at`, `assessment_submissions`.`submitted_at`, `assessment_submissions`.`updated_at` from `assessment_submissions` inner join `assessment_submission_states` on `assessment_submissions`.`assessment_submission_state_id` = `assessment_submission_states`.`id` where `assessment_submissions`.`id` = ?',
      [assessmentSubmissionId],
      [matchingAssessmentSubmissionInProgressRow]
    );
    mockQuery(
      'select `id`, `assessment_id`, `question_id`, `answer_id`, `response`, `score`, `grader_response` from `assessment_responses` where `submission_id` = ?',
      [assessmentSubmissionId],
      [
        matchingAssessmentResponsesRowSCOpened,
        matchingAssessmentResponsesRowFROpened,
      ]
    );
    mockQuery(
      'select `program_id`, `assessment_id`, `available_after`, `due_date` from `program_assessments` where `id` = ?',
      [exampleProgramAssessment.id],
      [matchingProgramAssessmentsRow]
    );
    mockQuery(
      'select `id`, `title`, `start_date`, `end_date`, `time_zone`, `curriculum_id` from `programs` where `id` = ?',
      [exampleProgramAssessment.program_id],
      [matchingProgramRow]
    );
    mockQuery(
      'select `curriculum_assessments`.`title`, `curriculum_assessments`.`max_score`, `curriculum_assessments`.`max_num_submissions`, `curriculum_assessments`.`time_limit`, `curriculum_assessments`.`curriculum_id`, `curriculum_assessments`.`activity_id`, `curriculum_assessments`.`principal_id` from `curriculum_assessments` inner join `activities` on `curriculum_assessments`.`curriculum_id` = `activities`.`id` where `curriculum_assessments`.`id` = ?',
      [curriculumAssessmentId],
      [matchingCurriculumAssessmentRow]
    );
    mockQuery(
      'select `activity_types`.`title` from `activity_types` inner join `activities` on `activities`.`activity_type_id` = `activity_types`.`id` where `activities`.`id` = ?',
      [matchingCurriculumAssessmentRow.activity_id],
      [
        {
          title:
            exampleCurriculumAssessmentWithSCCorrectAnswers.assessment_type,
        },
      ]
    );
    mockQuery(
      'update `assessment_responses` set `answer_id` = ? where `id` = ?',
      [
        matchingAssessmentResponsesRowSCInProgress.answer_id,
        matchingAssessmentResponsesRowSCInProgress.id,
      ],
      1
    );
    mockQuery(
      'update `assessment_responses` set `response` = ? where `id` = ?',
      [
        matchingAssessmentResponsesRowFRInProgress.response,
        matchingAssessmentResponsesRowFRInProgress.id,
      ],
      1
    );
    mockQuery(
      'select `id` from `assessment_submission_states` where `title` = ?',
      ['In Progress'],
      [{ id: 4 }]
    );
    mockQuery(
      'update `assessment_submissions` set `assessment_submission_state_id` = ? where `id` = ?',
      [4, sentUpdatedAssessmentSubmissionChangedResponse.id],
      1
    );

    expect(
      await updateAssessmentSubmission(
        exampleAssessmentSubmissionInProgressSCFR,
        false
      )
    ).toEqual(exampleAssessmentSubmissionInProgressSCFR);
  });

  it('should update an existing submitted assessment submission by adding grading information from a facilitator', async () => {
    const expectedNow = DateTime.utc(2023, 2, 9, 12, 5, 0);
    Settings.now = () => expectedNow.toMillis();

    mockQuery(
      'select `assessment_submissions`.`assessment_id`, `assessment_submissions`.`principal_id`, `assessment_submission_states`.`title` as `assessment_submission_state`, `assessment_submissions`.`score`, `assessment_submissions`.`opened_at`, `assessment_submissions`.`submitted_at`, `assessment_submissions`.`updated_at` from `assessment_submissions` inner join `assessment_submission_states` on `assessment_submissions`.`assessment_submission_state_id` = `assessment_submission_states`.`id` where `assessment_submissions`.`id` = ?',
      [assessmentSubmissionId],
      [matchingAssessmentSubmissionsSubmittedRow]
    );

    mockQuery(
      'select `id`, `assessment_id`, `question_id`, `answer_id`, `response`, `score`, `grader_response` from `assessment_responses` where `submission_id` = ?',
      [assessmentSubmissionId],
      [matchingAssessmentResponsesRowSCInProgress]
    );

    mockQuery(
      'update `assessment_responses` set `score` = ?, `grader_response` = ? where `id` = ?',
      [
        matchingAssessmentResponsesRowSCGraded.score,
        matchingAssessmentResponsesRowSCGraded.grader_response,
        matchingAssessmentResponsesRowSCGraded.id,
      ],

      1
    );

    mockQuery(
      'select `id` from `assessment_submission_states` where `title` = ?',
      ['Graded'],
      [{ id: 7 }]
    );

    mockQuery(
      'update `assessment_submissions` set `assessment_submission_state_id` = ?, `score` = ? where `id` = ?',
      [
        7,
        exampleAssessmentSubmissionGraded.score,
        exampleAssessmentSubmissionGraded.id,
      ],
      1
    );

    expect(
      await updateAssessmentSubmission(exampleAssessmentSubmissionGraded, true)
    ).toEqual(exampleAssessmentSubmissionGraded);
  });

  it('should update an existing in-progress assessment submission by a participant with a new SC response', async () => {
    const expectedNow = DateTime.utc(2023, 2, 9, 12, 5, 0);
    Settings.now = () => expectedNow.toMillis();

    mockQuery(
      'select `assessment_submissions`.`assessment_id`, `assessment_submissions`.`principal_id`, `assessment_submission_states`.`title` as `assessment_submission_state`, `assessment_submissions`.`score`, `assessment_submissions`.`opened_at`, `assessment_submissions`.`submitted_at`, `assessment_submissions`.`updated_at` from `assessment_submissions` inner join `assessment_submission_states` on `assessment_submissions`.`assessment_submission_state_id` = `assessment_submission_states`.`id` where `assessment_submissions`.`id` = ?',
      [assessmentSubmissionId],
      [matchingAssessmentSubmissionInProgressRow]
    );
    mockQuery(
      'select `id`, `assessment_id`, `question_id`, `answer_id`, `response`, `score`, `grader_response` from `assessment_responses` where `submission_id` = ?',
      [assessmentSubmissionId],
      []
    );
    mockQuery(
      'select `program_id`, `assessment_id`, `available_after`, `due_date` from `program_assessments` where `id` = ?',
      [exampleProgramAssessment.id],
      [matchingProgramAssessmentsRow]
    );
    mockQuery(
      'select `id`, `title`, `start_date`, `end_date`, `time_zone`, `curriculum_id` from `programs` where `id` = ?',
      [exampleProgramAssessment.program_id],
      [matchingProgramRow]
    );
    mockQuery(
      'select `curriculum_assessments`.`title`, `curriculum_assessments`.`max_score`, `curriculum_assessments`.`max_num_submissions`, `curriculum_assessments`.`time_limit`, `curriculum_assessments`.`curriculum_id`, `curriculum_assessments`.`activity_id`, `curriculum_assessments`.`principal_id` from `curriculum_assessments` inner join `activities` on `curriculum_assessments`.`curriculum_id` = `activities`.`id` where `curriculum_assessments`.`id` = ?',
      [curriculumAssessmentId],
      [matchingCurriculumAssessmentRow]
    );
    mockQuery(
      'select `activity_types`.`title` from `activity_types` inner join `activities` on `activities`.`activity_type_id` = `activity_types`.`id` where `activities`.`id` = ?',
      [matchingCurriculumAssessmentRow.activity_id],
      [
        {
          title:
            exampleCurriculumAssessmentWithSCCorrectAnswers.assessment_type,
        },
      ]
    );
    mockQuery(
      'insert into `assessment_responses` (`answer_id`, `assessment_id`, `question_id`, `response`, `submission_id`) values (?, ?, ?, DEFAULT, ?)',
      [
        singleChoiceAnswerId,
        programAssessmentId,
        singleChoiceQuestionId,
        exampleAssessmentSubmissionInProgress.id,
      ],
      [assessmentSubmissionResponseSCId]
    );
    mockQuery(
      'select `id` from `assessment_submission_states` where `title` = ?',
      ['In Progress'],
      [{ id: 4 }]
    );
    mockQuery(
      'update `assessment_submissions` set `assessment_submission_state_id` = ? where `id` = ?',
      [4, exampleAssessmentSubmissionInProgress.id],
      1
    );

    expect(
      await updateAssessmentSubmission(
        sentUpdatedAssessmentSubmissionWithNewSCResponse,
        false
      )
    ).toEqual(exampleAssessmentSubmissionInProgress);
  });

  it('should update an existing in-progress assessment submission by a participant with a new FR response', async () => {
    const expectedNow = DateTime.utc(2023, 2, 9, 12, 5, 0);
    Settings.now = () => expectedNow.toMillis();

    mockQuery(
      'select `assessment_submissions`.`assessment_id`, `assessment_submissions`.`principal_id`, `assessment_submission_states`.`title` as `assessment_submission_state`, `assessment_submissions`.`score`, `assessment_submissions`.`opened_at`, `assessment_submissions`.`submitted_at`, `assessment_submissions`.`updated_at` from `assessment_submissions` inner join `assessment_submission_states` on `assessment_submissions`.`assessment_submission_state_id` = `assessment_submission_states`.`id` where `assessment_submissions`.`id` = ?',
      [assessmentSubmissionId],
      [matchingAssessmentSubmissionInProgressRow]
    );
    mockQuery(
      'select `id`, `assessment_id`, `question_id`, `answer_id`, `response`, `score`, `grader_response` from `assessment_responses` where `submission_id` = ?',
      [assessmentSubmissionId],
      []
    );
    mockQuery(
      'select `program_id`, `assessment_id`, `available_after`, `due_date` from `program_assessments` where `id` = ?',
      [exampleProgramAssessment.id],
      [matchingProgramAssessmentsRow]
    );
    mockQuery(
      'select `id`, `title`, `start_date`, `end_date`, `time_zone`, `curriculum_id` from `programs` where `id` = ?',
      [exampleProgramAssessment.program_id],
      [matchingProgramRow]
    );
    mockQuery(
      'select `curriculum_assessments`.`title`, `curriculum_assessments`.`max_score`, `curriculum_assessments`.`max_num_submissions`, `curriculum_assessments`.`time_limit`, `curriculum_assessments`.`curriculum_id`, `curriculum_assessments`.`activity_id`, `curriculum_assessments`.`principal_id` from `curriculum_assessments` inner join `activities` on `curriculum_assessments`.`curriculum_id` = `activities`.`id` where `curriculum_assessments`.`id` = ?',
      [curriculumAssessmentId],
      [matchingCurriculumAssessmentRow]
    );
    mockQuery(
      'select `activity_types`.`title` from `activity_types` inner join `activities` on `activities`.`activity_type_id` = `activity_types`.`id` where `activities`.`id` = ?',
      [matchingCurriculumAssessmentRow.activity_id],
      [
        {
          title:
            exampleCurriculumAssessmentWithSCCorrectAnswers.assessment_type,
        },
      ]
    );
    mockQuery(
      'insert into `assessment_responses` (`answer_id`, `assessment_id`, `question_id`, `response`, `submission_id`) values (DEFAULT, ?, ?, ?, ?)',
      [
        programAssessmentId,
        freeResponseQuestionId,
        sentNewFRAssessmentResponse.response_text,
        exampleAssessmentSubmissionInProgress.id,
      ],
      [assessmentSubmissionResponseFRId]
    );
    mockQuery(
      'select `id` from `assessment_submission_states` where `title` = ?',
      ['In Progress'],
      [{ id: 4 }]
    );
    mockQuery(
      'update `assessment_submissions` set `assessment_submission_state_id` = ? where `id` = ?',
      [4, exampleAssessmentSubmissionInProgress.id],
      1
    );

    expect(
      await updateAssessmentSubmission(
        sentUpdatedAssessmentSubmissionWithNewFRResponse,
        false
      )
    ).toEqual(exampleAssessmentSubmissionFRInProgress);
  });

  it('should submit an assessment submission marked as being submitted by updating its state and submission date', async () => {
    const expectedNow = DateTime.utc(2023, 2, 9, 13, 23, 45);
    Settings.now = () => expectedNow.toMillis();

    mockQuery(
      'select `assessment_submissions`.`assessment_id`, `assessment_submissions`.`principal_id`, `assessment_submission_states`.`title` as `assessment_submission_state`, `assessment_submissions`.`score`, `assessment_submissions`.`opened_at`, `assessment_submissions`.`submitted_at`, `assessment_submissions`.`updated_at` from `assessment_submissions` inner join `assessment_submission_states` on `assessment_submissions`.`assessment_submission_state_id` = `assessment_submission_states`.`id` where `assessment_submissions`.`id` = ?',
      [assessmentSubmissionId],
      [matchingAssessmentSubmissionInProgressRow]
    );

    mockQuery(
      'select `id`, `assessment_id`, `question_id`, `answer_id`, `response`, `score`, `grader_response` from `assessment_responses` where `submission_id` = ?',
      [assessmentSubmissionId],
      [matchingAssessmentResponsesRowSCInProgress]
    );

    mockQuery(
      'select `program_id`, `assessment_id`, `available_after`, `due_date` from `program_assessments` where `id` = ?',
      [exampleProgramAssessment.id],
      [matchingProgramAssessmentsRow]
    );

    mockQuery(
      'select `id`, `title`, `start_date`, `end_date`, `time_zone`, `curriculum_id` from `programs` where `id` = ?',
      [exampleProgramAssessment.program_id],
      [matchingProgramRow]
    );

    mockQuery(
      'select `curriculum_assessments`.`title`, `curriculum_assessments`.`max_score`, `curriculum_assessments`.`max_num_submissions`, `curriculum_assessments`.`time_limit`, `curriculum_assessments`.`curriculum_id`, `curriculum_assessments`.`activity_id`, `curriculum_assessments`.`principal_id` from `curriculum_assessments` inner join `activities` on `curriculum_assessments`.`curriculum_id` = `activities`.`id` where `curriculum_assessments`.`id` = ?',
      [curriculumAssessmentId],
      [matchingCurriculumAssessmentRow]
    );

    mockQuery(
      'select `activity_types`.`title` from `activity_types` inner join `activities` on `activities`.`activity_type_id` = `activity_types`.`id` where `activities`.`id` = ?',
      [matchingCurriculumAssessmentRow.activity_id],
      [
        {
          title:
            exampleCurriculumAssessmentWithSCCorrectAnswers.assessment_type,
        },
      ]
    );

    mockQuery(
      'select `id` from `assessment_submission_states` where `title` = ?',
      ['Submitted'],
      [{ id: 6 }]
    );

    mockQuery(
      'update `assessment_submissions` set `assessment_submission_state_id` = ?, `submitted_at` = CURRENT_TIMESTAMP where `id` = ?',
      [6, exampleAssessmentSubmissionSubmitted.id],
      1
    );

    expect(
      await updateAssessmentSubmission(
        exampleAssessmentSubmissionSubmitted,
        false
      )
    ).toEqual(exampleAssessmentSubmissionSubmitted);
  });

  it('should automatically expire an in-progress assessment submission after the due date', async () => {
    const expectedNow = DateTime.utc(2023, 2, 10, 8, 0, 10);
    Settings.now = () => expectedNow.toMillis();

    mockQuery(
      'select `assessment_submissions`.`assessment_id`, `assessment_submissions`.`principal_id`, `assessment_submission_states`.`title` as `assessment_submission_state`, `assessment_submissions`.`score`, `assessment_submissions`.`opened_at`, `assessment_submissions`.`submitted_at`, `assessment_submissions`.`updated_at` from `assessment_submissions` inner join `assessment_submission_states` on `assessment_submissions`.`assessment_submission_state_id` = `assessment_submission_states`.`id` where `assessment_submissions`.`id` = ?',
      [assessmentSubmissionId],
      [matchingAssessmentSubmissionInProgressRow]
    );
    mockQuery(
      'select `id`, `assessment_id`, `question_id`, `answer_id`, `response`, `score`, `grader_response` from `assessment_responses` where `submission_id` = ?',
      [assessmentSubmissionId],
      [
        matchingAssessmentResponsesRowSCOpened,
        matchingAssessmentResponsesRowFRInProgress,
      ]
    );
    mockQuery(
      'select `program_id`, `assessment_id`, `available_after`, `due_date` from `program_assessments` where `id` = ?',
      [exampleProgramAssessmentPastDue.id],
      [matchingProgramAssessmentPastDueRow]
    );
    mockQuery(
      'select `id`, `title`, `start_date`, `end_date`, `time_zone`, `curriculum_id` from `programs` where `id` = ?',
      [exampleProgramAssessmentPastDue.program_id],
      [matchingProgramRow]
    );
    mockQuery(
      'select `curriculum_assessments`.`title`, `curriculum_assessments`.`max_score`, `curriculum_assessments`.`max_num_submissions`, `curriculum_assessments`.`time_limit`, `curriculum_assessments`.`curriculum_id`, `curriculum_assessments`.`activity_id`, `curriculum_assessments`.`principal_id` from `curriculum_assessments` inner join `activities` on `curriculum_assessments`.`curriculum_id` = `activities`.`id` where `curriculum_assessments`.`id` = ?',
      [curriculumAssessmentId],
      [matchingCurriculumAssessmentRow]
    );
    mockQuery(
      'select `activity_types`.`title` from `activity_types` inner join `activities` on `activities`.`activity_type_id` = `activity_types`.`id` where `activities`.`id` = ?',
      [matchingCurriculumAssessmentRow.activity_id],
      [
        {
          title:
            exampleCurriculumAssessmentWithSCCorrectAnswers.assessment_type,
        },
      ]
    );
    mockQuery(
      'select `id` from `assessment_submission_states` where `title` = ?',
      ['Expired'],
      [{ id: 5 }]
    );
    mockQuery(
      'update `assessment_submissions` set `assessment_submission_state_id` = ? where `id` = ?',
      [5, exampleAssessmentSubmissionInProgress.id],
      []
    );

    expect(
      await updateAssessmentSubmission(
        exampleAssessmentSubmissionInProgressSCFRLateStart,
        false
      )
    ).toEqual(exampleAssessmentSubmissionPastDueDate);
  });

  it('should automatically expire an in-progress assessment submission after the time limit', async () => {
    const expectedNow = DateTime.utc(2023, 2, 9, 14, 0, 10);
    Settings.now = () => expectedNow.toMillis();

    mockQuery(
      'select `assessment_submissions`.`assessment_id`, `assessment_submissions`.`principal_id`, `assessment_submission_states`.`title` as `assessment_submission_state`, `assessment_submissions`.`score`, `assessment_submissions`.`opened_at`, `assessment_submissions`.`submitted_at`, `assessment_submissions`.`updated_at` from `assessment_submissions` inner join `assessment_submission_states` on `assessment_submissions`.`assessment_submission_state_id` = `assessment_submission_states`.`id` where `assessment_submissions`.`id` = ?',
      [assessmentSubmissionId],
      [matchingAssessmentSubmissionInProgressRow]
    );
    mockQuery(
      'select `id`, `assessment_id`, `question_id`, `answer_id`, `response`, `score`, `grader_response` from `assessment_responses` where `submission_id` = ?',
      [assessmentSubmissionId],
      [matchingAssessmentResponsesRowSCOpened]
    );
    mockQuery(
      'select `program_id`, `assessment_id`, `available_after`, `due_date` from `program_assessments` where `id` = ?',
      [exampleProgramAssessment.id],
      [matchingProgramAssessmentsRow]
    );
    mockQuery(
      'select `id`, `title`, `start_date`, `end_date`, `time_zone`, `curriculum_id` from `programs` where `id` = ?',
      [exampleProgramAssessmentPastDue.program_id],
      [matchingProgramRow]
    );
    mockQuery(
      'select `curriculum_assessments`.`title`, `curriculum_assessments`.`max_score`, `curriculum_assessments`.`max_num_submissions`, `curriculum_assessments`.`time_limit`, `curriculum_assessments`.`curriculum_id`, `curriculum_assessments`.`activity_id`, `curriculum_assessments`.`principal_id` from `curriculum_assessments` inner join `activities` on `curriculum_assessments`.`curriculum_id` = `activities`.`id` where `curriculum_assessments`.`id` = ?',
      [curriculumAssessmentId],
      [matchingCurriculumAssessmentRow]
    );
    mockQuery(
      'select `activity_types`.`title` from `activity_types` inner join `activities` on `activities`.`activity_type_id` = `activity_types`.`id` where `activities`.`id` = ?',
      [matchingCurriculumAssessmentRow.activity_id],
      [
        {
          title:
            exampleCurriculumAssessmentWithSCCorrectAnswers.assessment_type,
        },
      ]
    );
    mockQuery(
      'select `id` from `assessment_submission_states` where `title` = ?',
      ['Expired'],
      [{ id: 5 }]
    );
    mockQuery(
      'update `assessment_submissions` set `assessment_submission_state_id` = ? where `id` = ?',
      [5, exampleAssessmentSubmissionInProgress.id],
      []
    );

    expect(
      await updateAssessmentSubmission(
        exampleAssessmentSubmissionInProgress,
        false
      )
    ).toEqual(exampleAssessmentSubmissionExpiredPlusWeek);
  });

  it('should not allow a participant to modify their responses to an expired submission', async () => {
    const expectedNow = DateTime.utc(2023, 2, 9, 12, 5, 0);
    Settings.now = () => expectedNow.toMillis();

    mockQuery(
      'select `assessment_submissions`.`assessment_id`, `assessment_submissions`.`principal_id`, `assessment_submission_states`.`title` as `assessment_submission_state`, `assessment_submissions`.`score`, `assessment_submissions`.`opened_at`, `assessment_submissions`.`submitted_at`, `assessment_submissions`.`updated_at` from `assessment_submissions` inner join `assessment_submission_states` on `assessment_submissions`.`assessment_submission_state_id` = `assessment_submission_states`.`id` where `assessment_submissions`.`id` = ?',
      [assessmentSubmissionId],
      [matchingAssessmentSubmissionExpiredRow]
    );
    mockQuery(
      'select `id`, `assessment_id`, `question_id`, `answer_id`, `response`, `score`, `grader_response` from `assessment_responses` where `submission_id` = ?',
      [assessmentSubmissionId],
      [matchingAssessmentResponsesRowSCInProgress]
    );

    expect(
      await updateAssessmentSubmission(
        exampleAssessmentSubmissionInProgress,
        false
      )
    ).toEqual(exampleAssessmentSubmissionExpired);
  });

  it('should not allow a participant to update grading information for themselves', async () => {
    const expectedNow = DateTime.utc(2023, 2, 9, 12, 5, 0);
    Settings.now = () => expectedNow.toMillis();

    mockQuery(
      'select `assessment_submissions`.`assessment_id`, `assessment_submissions`.`principal_id`, `assessment_submission_states`.`title` as `assessment_submission_state`, `assessment_submissions`.`score`, `assessment_submissions`.`opened_at`, `assessment_submissions`.`submitted_at`, `assessment_submissions`.`updated_at` from `assessment_submissions` inner join `assessment_submission_states` on `assessment_submissions`.`assessment_submission_state_id` = `assessment_submission_states`.`id` where `assessment_submissions`.`id` = ?',
      [assessmentSubmissionId],
      [matchingAssessmentSubmissionsSubmittedRow]
    );
    mockQuery(
      'select `id`, `assessment_id`, `question_id`, `answer_id`, `response`, `score`, `grader_response` from `assessment_responses` where `submission_id` = ?',
      [assessmentSubmissionId],
      [matchingAssessmentResponsesRowSCSubmitted]
    );

    expect(
      await updateAssessmentSubmission(exampleAssessmentSubmissionGraded, false)
    ).toEqual(exampleAssessmentSubmissionSubmitted);
  });
  it('should update an existing in-progress assessment submission by a participant with a changed response for FR response', async () => {
    const expectedNow = DateTime.utc(2023, 2, 9, 12, 5, 0);
    Settings.now = () => expectedNow.toMillis();

    mockQuery(
      'select `assessment_submissions`.`assessment_id`, `assessment_submissions`.`principal_id`, `assessment_submission_states`.`title` as `assessment_submission_state`, `assessment_submissions`.`score`, `assessment_submissions`.`opened_at`, `assessment_submissions`.`submitted_at`, `assessment_submissions`.`updated_at` from `assessment_submissions` inner join `assessment_submission_states` on `assessment_submissions`.`assessment_submission_state_id` = `assessment_submission_states`.`id` where `assessment_submissions`.`id` = ?',
      [assessmentSubmissionId],
      [matchingAssessmentSubmissionInProgressRow]
    );
    mockQuery(
      'select `id`, `assessment_id`, `question_id`, `answer_id`, `response`, `score`, `grader_response` from `assessment_responses` where `submission_id` = ?',
      [assessmentSubmissionId],
      [matchingAssessmentResponsesRowFROpened]
    );
    mockQuery(
      'select `program_id`, `assessment_id`, `available_after`, `due_date` from `program_assessments` where `id` = ?',
      [exampleProgramAssessment.id],
      [matchingProgramAssessmentsRow]
    );
    mockQuery(
      'select `id`, `title`, `start_date`, `end_date`, `time_zone`, `curriculum_id` from `programs` where `id` = ?',
      [exampleProgramAssessment.program_id],
      [matchingProgramRow]
    );
    mockQuery(
      'select `curriculum_assessments`.`title`, `curriculum_assessments`.`max_score`, `curriculum_assessments`.`max_num_submissions`, `curriculum_assessments`.`time_limit`, `curriculum_assessments`.`curriculum_id`, `curriculum_assessments`.`activity_id`, `curriculum_assessments`.`principal_id` from `curriculum_assessments` inner join `activities` on `curriculum_assessments`.`curriculum_id` = `activities`.`id` where `curriculum_assessments`.`id` = ?',
      [curriculumAssessmentId],
      [matchingCurriculumAssessmentRow]
    );
    mockQuery(
      'select `activity_types`.`title` from `activity_types` inner join `activities` on `activities`.`activity_type_id` = `activity_types`.`id` where `activities`.`id` = ?',
      [matchingCurriculumAssessmentRow.activity_id],
      [
        {
          title:
            exampleCurriculumAssessmentWithFRCorrectAnswers.assessment_type,
        },
      ]
    );
    mockQuery(
      'update `assessment_responses` set `response` = ? where `id` = ?',
      [
        matchingAssessmentResponsesRowFRInProgress.response,
        matchingAssessmentResponsesRowFRInProgress.id,
      ],
      1
    );
    mockQuery(
      'select `id` from `assessment_submission_states` where `title` = ?',
      ['In Progress'],
      [{ id: 4 }]
    );
    mockQuery(
      'update `assessment_submissions` set `assessment_submission_state_id` = ? where `id` = ?',
      [4, sentUpdatedAssessmentSubmissionChangedFRResponse.id],
      1
    );

    expect(
      await updateAssessmentSubmission(
        exampleAssessmentSubmissionFRInProgress,
        false
      )
    ).toEqual(exampleAssessmentSubmissionFRInProgress);
  });
});

describe('updateCurriculumAssessment', () => {
  it('should update a curriculum assessment with existing questions and updated answers', async () => {
    mockQuery(
      'select `assessment_questions`.`id`, `assessment_questions`.`title`, `description`, `assessment_question_types`.`title` as `question_type`, `correct_answer_id`, `max_score`, `sort_order` from `assessment_questions` inner join `assessment_question_types` on `assessment_questions`.`question_type_id` = `assessment_question_types`.`id` where `assessment_questions`.`assessment_id` = ? order by `sort_order` asc',
      [exampleCurriculumAssessmentWithSCCorrectAnswers.id],
      [matchingAssessmentQuestionsSCRow]
    );

    mockQuery(
      'select `id`, `question_id`, `title`, `description`, `sort_order` from `assessment_answers` where `question_id` = ? order by `sort_order` asc',
      [matchingAssessmentQuestionsSCRow.id],
      [matchingAssessmentAnswersSCRow]
    );

    mockQuery(
      'update `assessment_answers` set `title` = ?, `description` = ?, `sort_order` = ? where `id` = ?',
      [
        updatedAssessmentAnswersSCRow.title,
        updatedAssessmentAnswersSCRow.description,
        updatedAssessmentAnswersSCRow.sort_order,
        updatedAssessmentAnswersSCRow.id,
      ],
      [1]
    );

    mockQuery(
      'update `assessment_questions` set `title` = ?, `description` = ?, `correct_answer_id` = ?, `max_score` = ?, `sort_order` = ? where `id` = ?',
      [
        matchingAssessmentQuestionsSCRow.title,
        matchingAssessmentQuestionsSCRow.description,
        matchingAssessmentQuestionsSCRow.correct_answer_id,
        matchingAssessmentQuestionsSCRow.max_score,
        matchingAssessmentQuestionsSCRow.sort_order,
        matchingAssessmentQuestionsSCRow.id,
      ],
      [1]
    );

    mockQuery(
      'update `curriculum_assessments` set `title` = ?, `description` = ?, `max_score` = ?, `max_num_submissions` = ?, `time_limit` = ?, `activity_id` = ? where `id` = ?',
      [
        matchingCurriculumAssessmentRow.title,
        matchingCurriculumAssessmentRow.description,
        matchingCurriculumAssessmentRow.max_score,
        matchingCurriculumAssessmentRow.max_num_submissions,
        matchingCurriculumAssessmentRow.time_limit,
        matchingCurriculumAssessmentRow.activity_id,
        matchingCurriculumAssessmentRow.id,
      ],
      [1]
    );

    expect(
      await updateCurriculumAssessment(
        exampleCurriculumAssessmentWithUpdatedSCCorrectAnswer
      )
    ).toEqual(exampleCurriculumAssessmentWithUpdatedSCCorrectAnswer);
  });

  it('should update a curriculum assessment with new questions', async () => {
    mockQuery(
      'select `assessment_questions`.`id`, `assessment_questions`.`title`, `description`, `assessment_question_types`.`title` as `question_type`, `correct_answer_id`, `max_score`, `sort_order` from `assessment_questions` inner join `assessment_question_types` on `assessment_questions`.`question_type_id` = `assessment_question_types`.`id` where `assessment_questions`.`assessment_id` = ? order by `sort_order` asc',
      [exampleCurriculumAssessmentWithSCCorrectAnswers.id],
      []
    );

    mockQuery(
      'insert into `assessment_questions` (`assessment_id`, `description`, `max_score`, `question_type_id`, `sort_order`, `title`) values (?, ?, ?, ?, ?, ?)',
      [
        curriculumAssessmentId,
        sentNewSCAssessmentQuestion.description,
        sentNewSCAssessmentQuestion.max_score,
        1,
        sentNewSCAssessmentQuestion.sort_order,
        sentNewSCAssessmentQuestion.title,
      ],
      [singleChoiceQuestionId]
    );

    mockQuery(
      'insert into `assessment_answers` (`description`, `question_id`, `sort_order`, `title`) values (?, ?, ?, ?)',
      [
        sentNewSCAssessmentAnswer.description,
        singleChoiceQuestionId,
        sentNewSCAssessmentAnswer.sort_order,
        sentNewSCAssessmentAnswer.title,
      ],
      [singleChoiceAnswerId]
    );

    mockQuery(
      'update `assessment_questions` set `correct_answer_id` = ? where `id` = ?',
      [
        matchingAssessmentQuestionsSCRow.correct_answer_id,
        singleChoiceQuestionId,
      ],
      [1]
    );

    mockQuery(
      'update `curriculum_assessments` set `title` = ?, `description` = ?, `max_score` = ?, `max_num_submissions` = ?, `time_limit` = ?, `activity_id` = ? where `id` = ?',
      [
        matchingCurriculumAssessmentRow.title,
        matchingCurriculumAssessmentRow.description,
        matchingCurriculumAssessmentRow.max_score,
        matchingCurriculumAssessmentRow.max_num_submissions,
        matchingCurriculumAssessmentRow.time_limit,
        matchingCurriculumAssessmentRow.activity_id,
        matchingCurriculumAssessmentRow.id,
      ],
      [1]
    );

    expect(
      await updateCurriculumAssessment(
        sentCurriculumAssessmentWithNewSCQuestion
      )
    ).toEqual(exampleCurriculumAssessmentWithSCCorrectAnswers);
  });

  it('should update a curriculum assessment with new question and delete old questions', async () => {
    mockQuery(
      'select `assessment_questions`.`id`, `assessment_questions`.`title`, `description`, `assessment_question_types`.`title` as `question_type`, `correct_answer_id`, `max_score`, `sort_order` from `assessment_questions` inner join `assessment_question_types` on `assessment_questions`.`question_type_id` = `assessment_question_types`.`id` where `assessment_questions`.`assessment_id` = ? order by `sort_order` asc',
      [exampleCurriculumAssessmentWithFRCorrectAnswers.id],
      [matchingAssessmentQuestionsFRRow]
    );

    mockQuery(
      'delete from `assessment_questions` where `id` = ?',
      [matchingAssessmentQuestionsFRRow.id],
      [1]
    );

    mockQuery(
      'insert into `assessment_questions` (`assessment_id`, `description`, `max_score`, `question_type_id`, `sort_order`, `title`) values (?, ?, ?, ?, ?, ?)',
      [
        curriculumAssessmentId,
        sentNewSCAssessmentQuestion.description,
        sentNewSCAssessmentQuestion.max_score,
        1,
        sentNewSCAssessmentQuestion.sort_order,
        sentNewSCAssessmentQuestion.title,
      ],
      [singleChoiceQuestionId]
    );

    mockQuery(
      'insert into `assessment_answers` (`description`, `question_id`, `sort_order`, `title`) values (?, ?, ?, ?)',
      [
        sentNewSCAssessmentAnswer.description,
        singleChoiceQuestionId,
        sentNewSCAssessmentAnswer.sort_order,
        sentNewSCAssessmentAnswer.title,
      ],
      [singleChoiceAnswerId]
    );

    mockQuery(
      'update `assessment_questions` set `correct_answer_id` = ? where `id` = ?',
      [
        matchingAssessmentQuestionsSCRow.correct_answer_id,
        singleChoiceQuestionId,
      ],
      [1]
    );

    mockQuery(
      'update `curriculum_assessments` set `title` = ?, `description` = ?, `max_score` = ?, `max_num_submissions` = ?, `time_limit` = ?, `activity_id` = ? where `id` = ?',
      [
        matchingCurriculumAssessmentRow.title,
        matchingCurriculumAssessmentRow.description,
        matchingCurriculumAssessmentRow.max_score,
        matchingCurriculumAssessmentRow.max_num_submissions,
        matchingCurriculumAssessmentRow.time_limit,
        matchingCurriculumAssessmentRow.activity_id,
        matchingCurriculumAssessmentRow.id,
      ],
      [1]
    );

    expect(
      await updateCurriculumAssessment(
        sentCurriculumAssessmentWithNewSCQuestion2
      )
    ).toEqual(exampleCurriculumAssessmentWithSCCorrectAnswers);
  });

  it('should update a curriculum assessment with new answer and delete existing answer', async () => {
    mockQuery(
      'select `assessment_questions`.`id`, `assessment_questions`.`title`, `description`, `assessment_question_types`.`title` as `question_type`, `correct_answer_id`, `max_score`, `sort_order` from `assessment_questions` inner join `assessment_question_types` on `assessment_questions`.`question_type_id` = `assessment_question_types`.`id` where `assessment_questions`.`assessment_id` = ? order by `sort_order` asc',
      [exampleCurriculumAssessmentWithSCCorrectAnswers.id],
      [matchingAssessmentQuestionsSCRow]
    );

    mockQuery(
      'select `id`, `question_id`, `title`, `description`, `sort_order` from `assessment_answers` where `question_id` = ? order by `sort_order` asc',
      [matchingAssessmentQuestionsSCRow.id],
      [matchingAssessmentAnswersSCRow]
    );

    mockQuery(
      'delete from `assessment_answers` where `id` = ?',
      [matchingAssessmentAnswersSCRow.id],
      [1]
    );

    mockQuery(
      'insert into `assessment_answers` (`description`, `question_id`, `sort_order`, `title`) values (?, ?, ?, ?)',
      [
        sentNewSCAssessmentAnswer.description,
        singleChoiceQuestionId,
        sentNewSCAssessmentAnswer.sort_order,
        sentNewSCAssessmentAnswer.title,
      ],
      [singleChoiceAnswerId]
    );

    mockQuery(
      'update `assessment_questions` set `title` = ?, `description` = ?, `correct_answer_id` = ?, `max_score` = ?, `sort_order` = ? where `id` = ?',
      [
        matchingAssessmentQuestionsSCRow.title,
        matchingAssessmentQuestionsSCRow.description,
        singleChoiceAnswerId,
        matchingAssessmentQuestionsSCRow.max_score,
        matchingAssessmentQuestionsSCRow.sort_order,
        matchingAssessmentQuestionsSCRow.id,
      ],
      [1]
    );

    mockQuery(
      'update `curriculum_assessments` set `title` = ?, `description` = ?, `max_score` = ?, `max_num_submissions` = ?, `time_limit` = ?, `activity_id` = ? where `id` = ?',
      [
        matchingCurriculumAssessmentRow.title,
        matchingCurriculumAssessmentRow.description,
        matchingCurriculumAssessmentRow.max_score,
        matchingCurriculumAssessmentRow.max_num_submissions,
        matchingCurriculumAssessmentRow.time_limit,
        matchingCurriculumAssessmentRow.activity_id,
        matchingCurriculumAssessmentRow.id,
      ],
      [1]
    );

    expect(
      await updateCurriculumAssessment(
        sentCurriculumAssessmentWithSCQuestionNewAnswer
      )
    ).toEqual(exampleCurriculumAssessmentWithSCCorrectAnswers);
  });
});

describe('updateProgramAssessment', () => {
  it('should return update for an existing program assessment ID', async () => {
    mockQuery(
      'update `program_assessments` set `available_after` = ?, `due_date` = ? where `id` = ?',
      [
        updatedProgramAssessmentsRow.available_after,
        updatedProgramAssessmentsRow.due_date,
        updatedProgramAssessmentsRow.id,
      ],
      []
    );

    expect(await updateProgramAssessment(updatedProgramAssessmentsRow)).toEqual(
      updatedProgramAssessmentsRow
    );
  });
});
