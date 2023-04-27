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

describe('constructFacilitatorAssessmentSummary', () => {
  it('should gather the relevant information for constructing a FacilitatorAssessmentSubmissionsSummary for a given program assessment', async () => {
    mockQuery(
      'select count(distinct `principal_id`) as `count` from `assessment_submissions` where `assessment_id` = ?',
      [programAssessments[0].id],
      [
        {
          count: facilitatorSummaries[0].num_participants_with_submissions,
        },
      ]
    );
    mockQuery(
      'select count(`id`) as `count` from `program_participants` where `program_id` = ? and `role_id` = ?',
      [programAssessments[0].program_id, 2],
      [
        {
          count: facilitatorSummaries[0].num_program_participants,
        },
      ]
    );
    mockQuery(
      'select count(`id`) as `count` from `assessment_submissions` where `assessment_id` = ? and `score` is null',
      [programAssessments[0].id],
      [
        {
          count: facilitatorSummaries[0].num_ungraded_submissions,
        },
      ]
    );

    expect(
      await constructFacilitatorAssessmentSummary(programAssessments[0])
    ).toEqual(facilitatorSummaries[0]);
  });
});

describe('constructParticipantAssessmentSummary', () => {
  it('should gather the relevant information for constructing a ParticipantAssessmentSubmissionsSummary for a given program assessment', async () => {
    mockQuery(
      'select `assessment_submission_states`.`title` from `assessment_submissions` inner join `assessment_submission_states` on `assessment_submission_states`.`id` = `assessment_submissions`.`assessment_submission_state_id` where `assessment_submissions`.`principal_id` = ? and `assessment_submissions`.`assessment_id` = ? order by `assessment_submissions`.`assessment_submission_state_id` desc limit ?',
      [participantPrincipalId, programAssessments[0].id, 1],
      [
        {
          title: assessmentSubmissionsRows[5].assessment_submission_state,
        },
      ]
    );
    mockQuery(
      'select `submitted_at` from `assessment_submissions` where `principal_id` = ? and `assessment_id` = ? order by `submitted_at` desc limit ?',
      [participantPrincipalId, programAssessments[0].id, 1],
      [
        {
          submitted_at: assessmentSubmissionsRows[5].submitted_at,
        },
      ]
    );
    mockQuery(
      'select `assessment_submissions`.`id` as `id`, `assessment_submission_states`.`title` as `assessment_submission_state`, `assessment_submissions`.`score`, `assessment_submissions`.`opened_at`, `assessment_submissions`.`submitted_at`, `assessment_submissions`.`updated_at` from `assessment_submissions` inner join `assessment_submission_states` on `assessment_submissions`.`assessment_submission_state_id` = `assessment_submission_states`.`id` where `assessment_submissions`.`principal_id` = ? and `assessment_submissions`.`assessment_id` = ?',
      [participantPrincipalId, programAssessments[0].id],
      [assessmentSubmissionsRows[5]]
    );
    mockQuery(
      'select `score` from `assessment_submissions` where `principal_id` = ? and `assessment_id` = ? order by `score` desc limit ?',
      [participantPrincipalId, programAssessments[0].id, 1],
      [{ score: assessmentSubmissionsRows[5].score }]
    );

    expect(
      await constructParticipantAssessmentSummary(
        participantPrincipalId,
        programAssessments[0]
      )
    ).toEqual(participantSummaries[3]);
  });

  it('should gather the relevant information for constructing a ParticipantAssessmentSubmissionsSummary even if no submissions, before assessment is active', async () => {
    mockQuery(
      'select `assessment_submission_states`.`title` from `assessment_submissions` inner join `assessment_submission_states` on `assessment_submission_states`.`id` = `assessment_submissions`.`assessment_submission_state_id` where `assessment_submissions`.`principal_id` = ? and `assessment_submissions`.`assessment_id` = ? order by `assessment_submissions`.`assessment_submission_state_id` desc limit ?',
      [participantPrincipalId, programAssessments[0].id, 1],
      []
    );
    mockQuery(
      'select `submitted_at` from `assessment_submissions` where `principal_id` = ? and `assessment_id` = ? order by `submitted_at` desc limit ?',
      [participantPrincipalId, programAssessments[0].id, 1],
      []
    );

    mockQuery(
      'select `assessment_submissions`.`id` as `id`, `assessment_submission_states`.`title` as `assessment_submission_state`, `assessment_submissions`.`score`, `assessment_submissions`.`opened_at`, `assessment_submissions`.`submitted_at`, `assessment_submissions`.`updated_at` from `assessment_submissions` inner join `assessment_submission_states` on `assessment_submissions`.`assessment_submission_state_id` = `assessment_submission_states`.`id` where `assessment_submissions`.`principal_id` = ? and `assessment_submissions`.`assessment_id` = ?',
      [participantPrincipalId, programAssessments[0].id],
      []
    );
    mockQuery(
      'select `score` from `assessment_submissions` where `principal_id` = ? and `assessment_id` = ? order by `score` desc limit ?',
      [participantPrincipalId, programAssessments[0].id, 1],
      []
    );

    expect(
      await constructParticipantAssessmentSummary(
        participantPrincipalId,
        programAssessments[2]
      )
    ).toEqual(participantSummaries[0]);
  });

  it('should gather the relevant information for constructing a ParticipantAssessmentSubmissionsSummary even if no submissions, for an active assessment', async () => {
    mockQuery(
      'select `assessment_submission_states`.`title` from `assessment_submissions` inner join `assessment_submission_states` on `assessment_submission_states`.`id` = `assessment_submissions`.`assessment_submission_state_id` where `assessment_submissions`.`principal_id` = ? and `assessment_submissions`.`assessment_id` = ? order by `assessment_submissions`.`assessment_submission_state_id` desc limit ?',
      [participantPrincipalId, programAssessments[0].id, 1],
      []
    );
    mockQuery(
      'select `submitted_at` from `assessment_submissions` where `principal_id` = ? and `assessment_id` = ? order by `submitted_at` desc limit ?',
      [participantPrincipalId, programAssessments[0].id, 1],
      []
    );
    mockQuery(
      'select `assessment_submissions`.`id` as `id`, `assessment_submission_states`.`title` as `assessment_submission_state`, `assessment_submissions`.`score`, `assessment_submissions`.`opened_at`, `assessment_submissions`.`submitted_at`, `assessment_submissions`.`updated_at` from `assessment_submissions` inner join `assessment_submission_states` on `assessment_submissions`.`assessment_submission_state_id` = `assessment_submission_states`.`id` where `assessment_submissions`.`principal_id` = ? and `assessment_submissions`.`assessment_id` = ?',
      [participantPrincipalId, programAssessments[0].id],
      []
    );
    mockQuery(
      'select `score` from `assessment_submissions` where `principal_id` = ? and `assessment_id` = ? order by `score` desc limit ?',
      [participantPrincipalId, programAssessments[0].id, 1],
      []
    );

    expect(
      await constructParticipantAssessmentSummary(
        participantPrincipalId,
        programAssessments[0]
      )
    ).toEqual(participantSummaries[2]);
  });

  it('should gather the relevant information for constructing a ParticipantAssessmentSubmissionsSummary even if no submissions, after assessment is due', async () => {
    mockQuery(
      'select `assessment_submission_states`.`title` from `assessment_submissions` inner join `assessment_submission_states` on `assessment_submission_states`.`id` = `assessment_submissions`.`assessment_submission_state_id` where `assessment_submissions`.`principal_id` = ? and `assessment_submissions`.`assessment_id` = ? order by `assessment_submissions`.`assessment_submission_state_id` desc limit ?',
      [participantPrincipalId, programAssessments[0].id, 1],
      []
    );
    mockQuery(
      'select `submitted_at` from `assessment_submissions` where `principal_id` = ? and `assessment_id` = ? order by `submitted_at` desc limit ?',
      [participantPrincipalId, programAssessments[0].id, 1],
      []
    );
    mockQuery(
      'select `assessment_submissions`.`id` as `id`, `assessment_submission_states`.`title` as `assessment_submission_state`, `assessment_submissions`.`score`, `assessment_submissions`.`opened_at`, `assessment_submissions`.`submitted_at`, `assessment_submissions`.`updated_at` from `assessment_submissions` inner join `assessment_submission_states` on `assessment_submissions`.`assessment_submission_state_id` = `assessment_submission_states`.`id` where `assessment_submissions`.`principal_id` = ? and `assessment_submissions`.`assessment_id` = ?',
      [participantPrincipalId, programAssessments[0].id],
      [1]
    );
    mockQuery(
      'select `score` from `assessment_submissions` where `principal_id` = ? and `assessment_id` = ? order by `score` desc limit ?',
      [participantPrincipalId, programAssessments[0].id, 1],
      []
    );

    expect(
      await constructParticipantAssessmentSummary(
        participantPrincipalId,
        programAssessments[1]
      )
    ).toEqual(participantSummaries[1]);
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
      [programAssessments[0].id, 3, participantPrincipalId],
      [assessmentSubmissions[1].id]
    );
    mockQuery(
      'select `id` from `assessment_questions` where `assessment_id` = ?',
      [programAssessments[0].assessment_id],
      [{ id: singleChoiceQuestionId }]
    );
    mockQuery(
      'insert into `assessment_responses` (`answer_id`, `assessment_id`, `question_id`, `response`, `submission_id`) values (DEFAULT, ?, ?, DEFAULT, ?)',
      [
        programAssessments[0].id,
        singleChoiceQuestionId,
        assessmentSubmissions[1].id,
      ],
      [assessmentSubmissionResponseSCId]
    );

    expect(
      await createAssessmentSubmission(
        participantPrincipalId,
        programAssessments[0].id,
        programAssessments[0].assessment_id
      )
    ).toEqual(assessmentSubmissions[1]);
  });
});

describe('createCurriculumAssessment', () => {
  it('should create a curriculum assessment ID without question', async () => {
    mockQuery(
      'insert into `curriculum_assessments` (`activity_id`, `curriculum_id`, `description`, `max_num_submissions`, `max_score`, `principal_id`, `time_limit`, `title`) values (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        curriculumAssessments[5].activity_id,
        curriculumAssessments[5].curriculum_id,
        curriculumAssessments[5].description,
        curriculumAssessments[5].max_num_submissions,
        curriculumAssessments[5].max_score,
        curriculumAssessments[5].principal_id,
        curriculumAssessments[5].time_limit,
        curriculumAssessments[5].title,
      ],
      [curriculumAssessments[13].id]
    );
    expect(await createCurriculumAssessment(curriculumAssessments[5])).toEqual(
      curriculumAssessments[13]
    );
  });

  it('should create a curriculum assessment ID with a single choice question', async () => {
    mockQuery(
      'insert into `curriculum_assessments` (`activity_id`, `curriculum_id`, `description`, `max_num_submissions`, `max_score`, `principal_id`, `time_limit`, `title`) values (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        curriculumAssessments[6].activity_id,
        curriculumAssessments[6].curriculum_id,
        curriculumAssessments[6].description,
        curriculumAssessments[6].max_num_submissions,
        curriculumAssessments[6].max_score,
        curriculumAssessments[6].principal_id,
        curriculumAssessments[6].time_limit,
        curriculumAssessments[6].title,
      ],
      [curriculumAssessments[14].id]
    );
    mockQuery(
      'insert into `assessment_questions` (`assessment_id`, `description`, `max_score`, `question_type_id`, `sort_order`, `title`) values (?, ?, ?, ?, ?, ?)',
      [
        curriculumAssessments[14].id,
        questions[4].description,
        questions[4].max_score,
        1,
        questions[4].sort_order,
        questions[4].title,
      ],
      [singleChoiceQuestionId]
    );
    mockQuery(
      'insert into `assessment_answers` (`description`, `question_id`, `sort_order`, `title`) values (?, ?, ?, ?)',
      [
        answers[4].description,
        singleChoiceQuestionId,
        answers[4].sort_order,
        answers[4].title,
      ],
      [singleChoiceAnswerId]
    );
    mockQuery(
      'update `assessment_questions` set `correct_answer_id` = ? where `id` = ?',
      [singleChoiceAnswerId, singleChoiceQuestionId],
      []
    );
    expect(await createCurriculumAssessment(curriculumAssessments[6])).toEqual(
      curriculumAssessments[14]
    );
  });

  it('should create a curriculum assessment ID with a free response question', async () => {
    mockQuery(
      'insert into `curriculum_assessments` (`activity_id`, `curriculum_id`, `description`, `max_num_submissions`, `max_score`, `principal_id`, `time_limit`, `title`) values (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        curriculumAssessments[7].activity_id,
        curriculumAssessments[7].curriculum_id,
        curriculumAssessments[7].description,
        curriculumAssessments[7].max_num_submissions,
        curriculumAssessments[7].max_score,
        curriculumAssessments[7].principal_id,
        curriculumAssessments[7].time_limit,
        curriculumAssessments[7].title,
      ],
      [curriculumAssessments[15].id]
    );
    mockQuery(
      'insert into `assessment_questions` (`assessment_id`, `description`, `max_score`, `question_type_id`, `sort_order`, `title`) values (?, ?, ?, ?, ?, ?)',
      [
        curriculumAssessments[15].id,
        questions[5].description,
        questions[5].max_score,
        2,
        questions[5].sort_order,
        questions[5].title,
      ],
      [freeResponseQuestionId]
    );
    mockQuery(
      'insert into `assessment_answers` (`description`, `question_id`, `sort_order`, `title`) values (?, ?, ?, ?)',
      [
        answers[5].description,
        freeResponseQuestionId,
        answers[5].sort_order,
        answers[5].title,
      ],
      [freeResponseCorrectAnswerId]
    );
    mockQuery(
      'update `assessment_questions` set `correct_answer_id` = ? where `id` = ?',
      [freeResponseCorrectAnswerId, freeResponseQuestionId],
      []
    );
    expect(await createCurriculumAssessment(curriculumAssessments[7])).toEqual(
      curriculumAssessments[15]
    );
  });
});

describe('createProgramAssessment', () => {
  it('should insert a ProgramAssessment into the database', async () => {
    mockQuery(
      'insert into `program_assessments` (`assessment_id`, `available_after`, `due_date`, `program_id`) values (?, ?, ?, ?)',
      [
        programAssessments[3].assessment_id,
        programAssessments[3].available_after,
        programAssessments[3].due_date,
        programAssessments[3].program_id,
      ],
      [programAssessmentsRows[4].id]
    );

    mockQuery(
      'select `id`, `title`, `start_date`, `end_date`, `time_zone`, `curriculum_id` from `programs` where `id` = ?',
      [programAssessments[3].program_id],
      [programsRows[0]]
    );

    expect(await createProgramAssessment(programAssessments[3])).toEqual(
      programAssessments[0]
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
      [{ program_id: programAssessments[0].program_id }]
    );
    mockQuery(
      'select `id`, `title`, `start_date`, `end_date`, `time_zone`, `curriculum_id` from `programs` where `curriculum_id` = ?',
      [curriculumAssessments[0].curriculum_id],
      [programsRows[0]]
    );
    mockQuery(
      'select `program_participant_roles`.`title` from `program_participant_roles` inner join `program_participants` on `program_participant_roles`.`id` = `program_participants`.`role_id` where `principal_id` = ? and `program_id` = ?',
      [facilitatorPrincipalId, programAssessments[0].program_id],
      [{ title: 'Facilitator' }]
    );

    expect(
      await facilitatorProgramIdsMatchingCurriculum(
        facilitatorPrincipalId,
        curriculumAssessments[0].curriculum_id
      )
    ).toEqual([programAssessments[0].program_id]);
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
        curriculumAssessments[0].curriculum_id
      )
    ).toEqual([]);
  });
});

describe('findProgramAssessment', () => {
  it('should return a ProgramAssessment for an existing program assessment ID', async () => {
    mockQuery(
      'select `program_id`, `assessment_id`, `available_after`, `due_date` from `program_assessments` where `id` = ?',
      [programAssessments[0].id],
      [programAssessmentsRows[0]]
    );

    mockQuery(
      'select `id`, `title`, `start_date`, `end_date`, `time_zone`, `curriculum_id` from `programs` where `id` = ?',
      [programAssessments[0].program_id],
      [programsRows[0]]
    );

    expect(await findProgramAssessment(programAssessments[0].id)).toEqual(
      programAssessments[0]
    );
  });

  it('should return null for a program assessment ID that does not exist', async () => {
    mockQuery(
      'select `program_id`, `assessment_id`, `available_after`, `due_date` from `program_assessments` where `id` = ?',
      [programAssessments[0].id],
      []
    );

    expect(await findProgramAssessment(programAssessments[0].id)).toEqual(null);
  });
});

describe('getAssessmentSubmission', () => {
  it('should get assessment submission based on given submission ID', async () => {
    const assessmentSubmissionId = assessmentSubmissions[13].id;
    const responsesIncluded = true;
    const gradingsIncluded = true;

    mockQuery(
      'select `assessment_submissions`.`assessment_id`, `assessment_submissions`.`principal_id`, `assessment_submission_states`.`title` as `assessment_submission_state`, `assessment_submissions`.`score`, `assessment_submissions`.`opened_at`, `assessment_submissions`.`submitted_at`, `assessment_submissions`.`updated_at` from `assessment_submissions` inner join `assessment_submission_states` on `assessment_submissions`.`assessment_submission_state_id` = `assessment_submission_states`.`id` where `assessment_submissions`.`id` = ?',
      [assessmentSubmissionId],
      [assessmentSubmissionsRows[5]]
    );

    mockQuery(
      'select `id`, `assessment_id`, `question_id`, `answer_id`, `response`, `score`, `grader_response` from `assessment_responses` where `submission_id` = ?',
      [assessmentSubmissionId],
      [assessmentResponsesRows[3]]
    );

    expect(
      await getAssessmentSubmission(
        assessmentSubmissionId,
        responsesIncluded,
        gradingsIncluded
      )
    ).toEqual(assessmentSubmissions[13]);
  });

  it('should get assessment submission with null for responses (if no responses found) based on given submission ID', async () => {
    const assessmentSubmissionId = assessmentSubmissionsRows[0].id;
    const responsesIncluded = true;
    const gradingsIncluded = true;

    mockQuery(
      'select `assessment_submissions`.`assessment_id`, `assessment_submissions`.`principal_id`, `assessment_submission_states`.`title` as `assessment_submission_state`, `assessment_submissions`.`score`, `assessment_submissions`.`opened_at`, `assessment_submissions`.`submitted_at`, `assessment_submissions`.`updated_at` from `assessment_submissions` inner join `assessment_submission_states` on `assessment_submissions`.`assessment_submission_state_id` = `assessment_submission_states`.`id` where `assessment_submissions`.`id` = ?',
      [assessmentSubmissionId],
      [assessmentSubmissionsRows[0]]
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
    ).toEqual(assessmentSubmissions[0]);
  });

  it('should return null for a assessment submission ID that does not exist', async () => {
    mockQuery(
      'select `assessment_submissions`.`assessment_id`, `assessment_submissions`.`principal_id`, `assessment_submission_states`.`title` as `assessment_submission_state`, `assessment_submissions`.`score`, `assessment_submissions`.`opened_at`, `assessment_submissions`.`submitted_at`, `assessment_submissions`.`updated_at` from `assessment_submissions` inner join `assessment_submission_states` on `assessment_submissions`.`assessment_submission_state_id` = `assessment_submission_states`.`id` where `assessment_submissions`.`id` = ?',
      [assessmentSubmissions[13].id],
      []
    );

    expect(
      await getAssessmentSubmission(assessmentSubmissions[13].id, true, true)
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
      [curriculumAssessmentsRows[0]]
    );
    mockQuery(
      'select `activity_types`.`title` from `activity_types` inner join `activities` on `activities`.`activity_type_id` = `activity_types`.`id` where `activities`.`id` = ?',
      [curriculumAssessmentsRows[0].activity_id],
      [
        {
          title: curriculumAssessments[3].assessment_type,
        },
      ]
    );
    mockQuery(
      'select `assessment_questions`.`id`, `assessment_questions`.`title`, `description`, `assessment_question_types`.`title` as `question_type`, `correct_answer_id`, `max_score`, `sort_order` from `assessment_questions` inner join `assessment_question_types` on `assessment_questions`.`question_type_id` = `assessment_question_types`.`id` where `assessment_questions`.`assessment_id` = ? order by `sort_order` asc',
      [curriculumAssessments[3].id],
      [assessmentQuestionsRows[0]]
    );

    const questionIds = [assessmentQuestionsRows[0].id];

    mockQuery(
      'select `id`, `question_id`, `title`, `description`, `sort_order` from `assessment_answers` where `question_id` = ? order by `sort_order` asc',
      [questionIds[0]],
      [assessmentAnswersRows[0]]
    );

    expect(
      await getCurriculumAssessment(
        curriculumAssessments[3].id,
        questionsAndAllAnswersIncluded,
        questionsAndCorrectAnswersIncluded
      )
    ).toEqual(curriculumAssessments[3]);
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
      [facilitatorPrincipalId, programAssessments[0].program_id],
      [programParticipantRolesRows[0]]
    );

    expect(
      await getPrincipalProgramRole(
        facilitatorPrincipalId,
        programAssessments[0].program_id
      )
    ).toEqual('Facilitator');
  });

  it('should return the correct role for a participant based on principal ID and program ID', async () => {
    mockQuery(
      'select `program_participant_roles`.`title` from `program_participant_roles` inner join `program_participants` on `program_participant_roles`.`id` = `program_participants`.`role_id` where `principal_id` = ? and `program_id` = ?',
      [participantPrincipalId, programAssessments[0].program_id],
      [programParticipantRolesRows[1]]
    );

    expect(
      await getPrincipalProgramRole(
        participantPrincipalId,
        programAssessments[0].program_id
      )
    ).toEqual('Participant');
  });

  it('should return null for a user not enrolled in the program', async () => {
    mockQuery(
      'select `program_participant_roles`.`title` from `program_participant_roles` inner join `program_participants` on `program_participant_roles`.`id` = `program_participants`.`role_id` where `principal_id` = ? and `program_id` = ?',
      [unenrolledPrincipalId, programAssessments[0].program_id],
      []
    );

    expect(
      await getPrincipalProgramRole(
        unenrolledPrincipalId,
        programAssessments[0].program_id
      )
    ).toEqual(null);
  });
});

describe('listAllProgramAssessmentSubmissions', () => {
  it('should return all program assessment submissions for a given program assessment', async () => {
    mockQuery(
      'select `assessment_submissions`.`id`, `assessment_submission_states`.`title` as `assessment_submission_state`, `assessment_submissions`.`principal_id`, `assessment_submissions`.`score`, `assessment_submissions`.`opened_at`, `assessment_submissions`.`submitted_at`, `assessment_submissions`.`updated_at` from `assessment_submissions` inner join `assessment_submission_states` on `assessment_submissions`.`assessment_submission_state_id` = `assessment_submission_states`.`id` where `assessment_id` = ?',
      [assessmentSubmissions[0].assessment_id],
      [
        assessmentSubmissionsRows[0],
        assessmentSubmissionsRows[4],
        assessmentSubmissionsRows[5],
      ]
    );

    expect(
      await listAllProgramAssessmentSubmissions(
        assessmentSubmissions[0].assessment_id
      )
    ).toEqual([
      assessmentSubmissions[0],
      assessmentSubmissions[11],
      assessmentSubmissions[12],
    ]);
  });

  it('should return null if no program assessment submissions for a given program assessment', async () => {
    mockQuery(
      'select `assessment_submissions`.`id`, `assessment_submission_states`.`title` as `assessment_submission_state`, `assessment_submissions`.`principal_id`, `assessment_submissions`.`score`, `assessment_submissions`.`opened_at`, `assessment_submissions`.`submitted_at`, `assessment_submissions`.`updated_at` from `assessment_submissions` inner join `assessment_submission_states` on `assessment_submissions`.`assessment_submission_state_id` = `assessment_submission_states`.`id` where `assessment_id` = ?',
      [assessmentSubmissions[0].assessment_id],
      []
    );

    expect(
      await listAllProgramAssessmentSubmissions(
        assessmentSubmissions[0].assessment_id
      )
    ).toEqual(null);
  });
});

describe('listParticipantProgramAssessmentSubmissions', () => {
  it('should return program assessment submissions for a participant for a given program assessment', async () => {
    mockQuery(
      'select `assessment_submissions`.`id` as `id`, `assessment_submission_states`.`title` as `assessment_submission_state`, `assessment_submissions`.`score`, `assessment_submissions`.`opened_at`, `assessment_submissions`.`submitted_at`, `assessment_submissions`.`updated_at` from `assessment_submissions` inner join `assessment_submission_states` on `assessment_submissions`.`assessment_submission_state_id` = `assessment_submission_states`.`id` where `assessment_submissions`.`principal_id` = ? and `assessment_submissions`.`assessment_id` = ?',
      [participantPrincipalId, assessmentSubmissions[0].assessment_id],
      [assessmentSubmissionsRows[0]]
    );
    expect(
      await listParticipantProgramAssessmentSubmissions(
        participantPrincipalId,
        assessmentSubmissions[0].assessment_id
      )
    ).toEqual([assessmentSubmissions[0]]);
  });

  it('should return null if no program assessment submissions for a given program assessment', async () => {
    mockQuery(
      'select `assessment_submissions`.`id` as `id`, `assessment_submission_states`.`title` as `assessment_submission_state`, `assessment_submissions`.`score`, `assessment_submissions`.`opened_at`, `assessment_submissions`.`submitted_at`, `assessment_submissions`.`updated_at` from `assessment_submissions` inner join `assessment_submission_states` on `assessment_submissions`.`assessment_submission_state_id` = `assessment_submission_states`.`id` where `assessment_submissions`.`principal_id` = ? and `assessment_submissions`.`assessment_id` = ?',
      [participantPrincipalId, assessmentSubmissions[0].assessment_id],
      []
    );

    expect(
      await listParticipantProgramAssessmentSubmissions(
        participantPrincipalId,
        assessmentSubmissions[0].assessment_id
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
      [programAssessmentsRows[0].program_id],
      [programAssessmentsRows[0]]
    );

    mockQuery(
      'select `id`, `title`, `start_date`, `end_date`, `time_zone`, `curriculum_id` from `programs` where `id` = ?',
      [programAssessmentsRows[0].program_id],
      [programsRows[0]]
    );

    expect(
      await listProgramAssessments(programAssessmentsRows[0].program_id)
    ).toEqual([programAssessments[0]]);
  });

  it('should return null if no ProgramAssessments linked to a program ID were found', async () => {
    mockQuery(
      'select `id`, `assessment_id`, `available_after`, `due_date` from `program_assessments` where `program_id` = ?',
      [programAssessmentsRows[0].program_id],
      []
    );

    expect(
      await listProgramAssessments(programAssessmentsRows[0].program_id)
    ).toEqual(null);
  });
});

describe('removeGradingInformation', () => {
  it('should remove all grading-related information from an AssessmentSubmission', () => {
    expect(removeGradingInformation(assessmentSubmissions[13])).toEqual(
      assessmentSubmissions[14]
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
      [assessmentSubmissionsRows[1]]
    );
    mockQuery(
      'select `id`, `assessment_id`, `question_id`, `answer_id`, `response`, `score`, `grader_response` from `assessment_responses` where `submission_id` = ?',
      [assessmentSubmissionId],
      [assessmentResponsesRows[0], assessmentResponsesRows[4]]
    );
    mockQuery(
      'select `program_id`, `assessment_id`, `available_after`, `due_date` from `program_assessments` where `id` = ?',
      [programAssessments[0].id],
      [programAssessmentsRows[0]]
    );
    mockQuery(
      'select `id`, `title`, `start_date`, `end_date`, `time_zone`, `curriculum_id` from `programs` where `id` = ?',
      [programAssessments[0].program_id],
      [programsRows[0]]
    );
    mockQuery(
      'select `curriculum_assessments`.`title`, `curriculum_assessments`.`max_score`, `curriculum_assessments`.`max_num_submissions`, `curriculum_assessments`.`time_limit`, `curriculum_assessments`.`curriculum_id`, `curriculum_assessments`.`activity_id`, `curriculum_assessments`.`principal_id` from `curriculum_assessments` inner join `activities` on `curriculum_assessments`.`curriculum_id` = `activities`.`id` where `curriculum_assessments`.`id` = ?',
      [curriculumAssessmentId],
      [curriculumAssessmentsRows[0]]
    );
    mockQuery(
      'select `activity_types`.`title` from `activity_types` inner join `activities` on `activities`.`activity_type_id` = `activity_types`.`id` where `activities`.`id` = ?',
      [curriculumAssessmentsRows[0].activity_id],
      [
        {
          title: curriculumAssessments[3].assessment_type,
        },
      ]
    );
    mockQuery(
      'update `assessment_responses` set `answer_id` = ? where `id` = ?',
      [assessmentResponsesRows[1].answer_id, assessmentResponsesRows[1].id],
      1
    );
    mockQuery(
      'update `assessment_responses` set `response` = ? where `id` = ?',
      [assessmentResponsesRows[5].response, assessmentResponsesRows[5].id],
      1
    );
    mockQuery(
      'select `id` from `assessment_submission_states` where `title` = ?',
      ['In Progress'],
      [{ id: 4 }]
    );
    mockQuery(
      'update `assessment_submissions` set `assessment_submission_state_id` = ? where `id` = ?',
      [4, assessmentSubmissions[17].id],
      1
    );

    expect(
      await updateAssessmentSubmission(assessmentSubmissions[4], false)
    ).toEqual(assessmentSubmissions[4]);
  });

  it('should update an existing submitted assessment submission by adding grading information from a facilitator', async () => {
    const expectedNow = DateTime.utc(2023, 2, 9, 12, 5, 0);
    Settings.now = () => expectedNow.toMillis();

    mockQuery(
      'select `assessment_submissions`.`assessment_id`, `assessment_submissions`.`principal_id`, `assessment_submission_states`.`title` as `assessment_submission_state`, `assessment_submissions`.`score`, `assessment_submissions`.`opened_at`, `assessment_submissions`.`submitted_at`, `assessment_submissions`.`updated_at` from `assessment_submissions` inner join `assessment_submission_states` on `assessment_submissions`.`assessment_submission_state_id` = `assessment_submission_states`.`id` where `assessment_submissions`.`id` = ?',
      [assessmentSubmissionId],
      [assessmentSubmissionsRows[3]]
    );

    mockQuery(
      'select `id`, `assessment_id`, `question_id`, `answer_id`, `response`, `score`, `grader_response` from `assessment_responses` where `submission_id` = ?',
      [assessmentSubmissionId],
      [assessmentResponsesRows[1]]
    );

    mockQuery(
      'update `assessment_responses` set `score` = ?, `grader_response` = ? where `id` = ?',
      [
        assessmentResponsesRows[3].score,
        assessmentResponsesRows[3].grader_response,
        assessmentResponsesRows[3].id,
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
      [7, assessmentSubmissions[13].score, assessmentSubmissions[13].id],
      1
    );

    expect(
      await updateAssessmentSubmission(assessmentSubmissions[13], true)
    ).toEqual(assessmentSubmissions[13]);
  });

  it('should update an existing in-progress assessment submission by a participant with a new SC response', async () => {
    const expectedNow = DateTime.utc(2023, 2, 9, 12, 5, 0);
    Settings.now = () => expectedNow.toMillis();

    mockQuery(
      'select `assessment_submissions`.`assessment_id`, `assessment_submissions`.`principal_id`, `assessment_submission_states`.`title` as `assessment_submission_state`, `assessment_submissions`.`score`, `assessment_submissions`.`opened_at`, `assessment_submissions`.`submitted_at`, `assessment_submissions`.`updated_at` from `assessment_submissions` inner join `assessment_submission_states` on `assessment_submissions`.`assessment_submission_state_id` = `assessment_submission_states`.`id` where `assessment_submissions`.`id` = ?',
      [assessmentSubmissionId],
      [assessmentSubmissionsRows[1]]
    );
    mockQuery(
      'select `id`, `assessment_id`, `question_id`, `answer_id`, `response`, `score`, `grader_response` from `assessment_responses` where `submission_id` = ?',
      [assessmentSubmissionId],
      []
    );
    mockQuery(
      'select `program_id`, `assessment_id`, `available_after`, `due_date` from `program_assessments` where `id` = ?',
      [programAssessments[0].id],
      [programAssessmentsRows[0]]
    );
    mockQuery(
      'select `id`, `title`, `start_date`, `end_date`, `time_zone`, `curriculum_id` from `programs` where `id` = ?',
      [programAssessments[0].program_id],
      [programsRows[0]]
    );
    mockQuery(
      'select `curriculum_assessments`.`title`, `curriculum_assessments`.`max_score`, `curriculum_assessments`.`max_num_submissions`, `curriculum_assessments`.`time_limit`, `curriculum_assessments`.`curriculum_id`, `curriculum_assessments`.`activity_id`, `curriculum_assessments`.`principal_id` from `curriculum_assessments` inner join `activities` on `curriculum_assessments`.`curriculum_id` = `activities`.`id` where `curriculum_assessments`.`id` = ?',
      [curriculumAssessmentId],
      [curriculumAssessmentsRows[0]]
    );
    mockQuery(
      'select `activity_types`.`title` from `activity_types` inner join `activities` on `activities`.`activity_type_id` = `activity_types`.`id` where `activities`.`id` = ?',
      [curriculumAssessmentsRows[0].activity_id],
      [
        {
          title: curriculumAssessments[3].assessment_type,
        },
      ]
    );
    mockQuery(
      'insert into `assessment_responses` (`answer_id`, `assessment_id`, `question_id`, `response`, `submission_id`) values (?, ?, ?, DEFAULT, ?)',
      [
        singleChoiceAnswerId,
        programAssessmentId,
        singleChoiceQuestionId,
        assessmentSubmissions[2].id,
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
      [4, assessmentSubmissions[2].id],
      1
    );

    expect(
      await updateAssessmentSubmission(assessmentSubmissions[15], false)
    ).toEqual(assessmentSubmissions[2]);
  });

  it('should update an existing in-progress assessment submission by a participant with a new FR response', async () => {
    const expectedNow = DateTime.utc(2023, 2, 9, 12, 5, 0);
    Settings.now = () => expectedNow.toMillis();

    mockQuery(
      'select `assessment_submissions`.`assessment_id`, `assessment_submissions`.`principal_id`, `assessment_submission_states`.`title` as `assessment_submission_state`, `assessment_submissions`.`score`, `assessment_submissions`.`opened_at`, `assessment_submissions`.`submitted_at`, `assessment_submissions`.`updated_at` from `assessment_submissions` inner join `assessment_submission_states` on `assessment_submissions`.`assessment_submission_state_id` = `assessment_submission_states`.`id` where `assessment_submissions`.`id` = ?',
      [assessmentSubmissionId],
      [assessmentSubmissionsRows[1]]
    );
    mockQuery(
      'select `id`, `assessment_id`, `question_id`, `answer_id`, `response`, `score`, `grader_response` from `assessment_responses` where `submission_id` = ?',
      [assessmentSubmissionId],
      []
    );
    mockQuery(
      'select `program_id`, `assessment_id`, `available_after`, `due_date` from `program_assessments` where `id` = ?',
      [programAssessments[0].id],
      [programAssessmentsRows[0]]
    );
    mockQuery(
      'select `id`, `title`, `start_date`, `end_date`, `time_zone`, `curriculum_id` from `programs` where `id` = ?',
      [programAssessments[0].program_id],
      [programsRows[0]]
    );
    mockQuery(
      'select `curriculum_assessments`.`title`, `curriculum_assessments`.`max_score`, `curriculum_assessments`.`max_num_submissions`, `curriculum_assessments`.`time_limit`, `curriculum_assessments`.`curriculum_id`, `curriculum_assessments`.`activity_id`, `curriculum_assessments`.`principal_id` from `curriculum_assessments` inner join `activities` on `curriculum_assessments`.`curriculum_id` = `activities`.`id` where `curriculum_assessments`.`id` = ?',
      [curriculumAssessmentId],
      [curriculumAssessmentsRows[0]]
    );
    mockQuery(
      'select `activity_types`.`title` from `activity_types` inner join `activities` on `activities`.`activity_type_id` = `activity_types`.`id` where `activities`.`id` = ?',
      [curriculumAssessmentsRows[0].activity_id],
      [
        {
          title: curriculumAssessments[3].assessment_type,
        },
      ]
    );
    mockQuery(
      'insert into `assessment_responses` (`answer_id`, `assessment_id`, `question_id`, `response`, `submission_id`) values (DEFAULT, ?, ?, ?, ?)',
      [
        programAssessmentId,
        freeResponseQuestionId,
        assessmentResponses[7].response_text,
        assessmentSubmissions[2].id,
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
      [4, assessmentSubmissions[2].id],
      1
    );

    expect(
      await updateAssessmentSubmission(assessmentSubmissions[16], false)
    ).toEqual(assessmentSubmissions[3]);
  });

  it('should submit an assessment submission marked as being submitted by updating its state and submission date', async () => {
    const expectedNow = DateTime.utc(2023, 2, 9, 13, 23, 45);
    Settings.now = () => expectedNow.toMillis();

    mockQuery(
      'select `assessment_submissions`.`assessment_id`, `assessment_submissions`.`principal_id`, `assessment_submission_states`.`title` as `assessment_submission_state`, `assessment_submissions`.`score`, `assessment_submissions`.`opened_at`, `assessment_submissions`.`submitted_at`, `assessment_submissions`.`updated_at` from `assessment_submissions` inner join `assessment_submission_states` on `assessment_submissions`.`assessment_submission_state_id` = `assessment_submission_states`.`id` where `assessment_submissions`.`id` = ?',
      [assessmentSubmissionId],
      [assessmentSubmissionsRows[1]]
    );

    mockQuery(
      'select `id`, `assessment_id`, `question_id`, `answer_id`, `response`, `score`, `grader_response` from `assessment_responses` where `submission_id` = ?',
      [assessmentSubmissionId],
      [assessmentResponsesRows[1]]
    );

    mockQuery(
      'select `program_id`, `assessment_id`, `available_after`, `due_date` from `program_assessments` where `id` = ?',
      [programAssessments[0].id],
      [programAssessmentsRows[0]]
    );

    mockQuery(
      'select `id`, `title`, `start_date`, `end_date`, `time_zone`, `curriculum_id` from `programs` where `id` = ?',
      [programAssessments[0].program_id],
      [programsRows[0]]
    );

    mockQuery(
      'select `curriculum_assessments`.`title`, `curriculum_assessments`.`max_score`, `curriculum_assessments`.`max_num_submissions`, `curriculum_assessments`.`time_limit`, `curriculum_assessments`.`curriculum_id`, `curriculum_assessments`.`activity_id`, `curriculum_assessments`.`principal_id` from `curriculum_assessments` inner join `activities` on `curriculum_assessments`.`curriculum_id` = `activities`.`id` where `curriculum_assessments`.`id` = ?',
      [curriculumAssessmentId],
      [curriculumAssessmentsRows[0]]
    );

    mockQuery(
      'select `activity_types`.`title` from `activity_types` inner join `activities` on `activities`.`activity_type_id` = `activity_types`.`id` where `activities`.`id` = ?',
      [curriculumAssessmentsRows[0].activity_id],
      [
        {
          title: curriculumAssessments[3].assessment_type,
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
      [6, assessmentSubmissions[9].id],
      1
    );

    expect(
      await updateAssessmentSubmission(assessmentSubmissions[9], false)
    ).toEqual(assessmentSubmissions[9]);
  });

  it('should automatically expire an in-progress assessment submission after the due date', async () => {
    const expectedNow = DateTime.utc(2023, 2, 10, 8, 0, 10);
    Settings.now = () => expectedNow.toMillis();

    mockQuery(
      'select `assessment_submissions`.`assessment_id`, `assessment_submissions`.`principal_id`, `assessment_submission_states`.`title` as `assessment_submission_state`, `assessment_submissions`.`score`, `assessment_submissions`.`opened_at`, `assessment_submissions`.`submitted_at`, `assessment_submissions`.`updated_at` from `assessment_submissions` inner join `assessment_submission_states` on `assessment_submissions`.`assessment_submission_state_id` = `assessment_submission_states`.`id` where `assessment_submissions`.`id` = ?',
      [assessmentSubmissionId],
      [assessmentSubmissionsRows[1]]
    );
    mockQuery(
      'select `id`, `assessment_id`, `question_id`, `answer_id`, `response`, `score`, `grader_response` from `assessment_responses` where `submission_id` = ?',
      [assessmentSubmissionId],
      [assessmentResponsesRows[0], assessmentResponsesRows[5]]
    );
    mockQuery(
      'select `program_id`, `assessment_id`, `available_after`, `due_date` from `program_assessments` where `id` = ?',
      [programAssessments[1].id],
      [programAssessmentsRows[1]]
    );
    mockQuery(
      'select `id`, `title`, `start_date`, `end_date`, `time_zone`, `curriculum_id` from `programs` where `id` = ?',
      [programAssessments[1].program_id],
      [programsRows[0]]
    );
    mockQuery(
      'select `curriculum_assessments`.`title`, `curriculum_assessments`.`max_score`, `curriculum_assessments`.`max_num_submissions`, `curriculum_assessments`.`time_limit`, `curriculum_assessments`.`curriculum_id`, `curriculum_assessments`.`activity_id`, `curriculum_assessments`.`principal_id` from `curriculum_assessments` inner join `activities` on `curriculum_assessments`.`curriculum_id` = `activities`.`id` where `curriculum_assessments`.`id` = ?',
      [curriculumAssessmentId],
      [curriculumAssessmentsRows[0]]
    );
    mockQuery(
      'select `activity_types`.`title` from `activity_types` inner join `activities` on `activities`.`activity_type_id` = `activity_types`.`id` where `activities`.`id` = ?',
      [curriculumAssessmentsRows[0].activity_id],
      [
        {
          title: curriculumAssessments[3].assessment_type,
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
      [5, assessmentSubmissions[2].id],
      []
    );

    expect(
      await updateAssessmentSubmission(assessmentSubmissions[5], false)
    ).toEqual(assessmentSubmissions[6]);
  });

  it('should automatically expire an in-progress assessment submission after the time limit', async () => {
    const expectedNow = DateTime.utc(2023, 2, 9, 14, 0, 10);
    Settings.now = () => expectedNow.toMillis();

    mockQuery(
      'select `assessment_submissions`.`assessment_id`, `assessment_submissions`.`principal_id`, `assessment_submission_states`.`title` as `assessment_submission_state`, `assessment_submissions`.`score`, `assessment_submissions`.`opened_at`, `assessment_submissions`.`submitted_at`, `assessment_submissions`.`updated_at` from `assessment_submissions` inner join `assessment_submission_states` on `assessment_submissions`.`assessment_submission_state_id` = `assessment_submission_states`.`id` where `assessment_submissions`.`id` = ?',
      [assessmentSubmissionId],
      [assessmentSubmissionsRows[1]]
    );
    mockQuery(
      'select `id`, `assessment_id`, `question_id`, `answer_id`, `response`, `score`, `grader_response` from `assessment_responses` where `submission_id` = ?',
      [assessmentSubmissionId],
      [assessmentResponsesRows[0]]
    );
    mockQuery(
      'select `program_id`, `assessment_id`, `available_after`, `due_date` from `program_assessments` where `id` = ?',
      [programAssessments[0].id],
      [programAssessmentsRows[0]]
    );
    mockQuery(
      'select `id`, `title`, `start_date`, `end_date`, `time_zone`, `curriculum_id` from `programs` where `id` = ?',
      [programAssessments[1].program_id],
      [programsRows[0]]
    );
    mockQuery(
      'select `curriculum_assessments`.`title`, `curriculum_assessments`.`max_score`, `curriculum_assessments`.`max_num_submissions`, `curriculum_assessments`.`time_limit`, `curriculum_assessments`.`curriculum_id`, `curriculum_assessments`.`activity_id`, `curriculum_assessments`.`principal_id` from `curriculum_assessments` inner join `activities` on `curriculum_assessments`.`curriculum_id` = `activities`.`id` where `curriculum_assessments`.`id` = ?',
      [curriculumAssessmentId],
      [curriculumAssessmentsRows[0]]
    );
    mockQuery(
      'select `activity_types`.`title` from `activity_types` inner join `activities` on `activities`.`activity_type_id` = `activity_types`.`id` where `activities`.`id` = ?',
      [curriculumAssessmentsRows[0].activity_id],
      [
        {
          title: curriculumAssessments[3].assessment_type,
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
      [5, assessmentSubmissions[2].id],
      []
    );

    expect(
      await updateAssessmentSubmission(assessmentSubmissions[2], false)
    ).toEqual(assessmentSubmissions[8]);
  });

  it('should not allow a participant to modify their responses to an expired submission', async () => {
    const expectedNow = DateTime.utc(2023, 2, 9, 12, 5, 0);
    Settings.now = () => expectedNow.toMillis();

    mockQuery(
      'select `assessment_submissions`.`assessment_id`, `assessment_submissions`.`principal_id`, `assessment_submission_states`.`title` as `assessment_submission_state`, `assessment_submissions`.`score`, `assessment_submissions`.`opened_at`, `assessment_submissions`.`submitted_at`, `assessment_submissions`.`updated_at` from `assessment_submissions` inner join `assessment_submission_states` on `assessment_submissions`.`assessment_submission_state_id` = `assessment_submission_states`.`id` where `assessment_submissions`.`id` = ?',
      [assessmentSubmissionId],
      [assessmentSubmissionsRows[2]]
    );
    mockQuery(
      'select `id`, `assessment_id`, `question_id`, `answer_id`, `response`, `score`, `grader_response` from `assessment_responses` where `submission_id` = ?',
      [assessmentSubmissionId],
      [assessmentResponsesRows[1]]
    );

    expect(
      await updateAssessmentSubmission(assessmentSubmissions[2], false)
    ).toEqual(assessmentSubmissions[7]);
  });

  it('should not allow a participant to update grading information for themselves', async () => {
    const expectedNow = DateTime.utc(2023, 2, 9, 12, 5, 0);
    Settings.now = () => expectedNow.toMillis();

    mockQuery(
      'select `assessment_submissions`.`assessment_id`, `assessment_submissions`.`principal_id`, `assessment_submission_states`.`title` as `assessment_submission_state`, `assessment_submissions`.`score`, `assessment_submissions`.`opened_at`, `assessment_submissions`.`submitted_at`, `assessment_submissions`.`updated_at` from `assessment_submissions` inner join `assessment_submission_states` on `assessment_submissions`.`assessment_submission_state_id` = `assessment_submission_states`.`id` where `assessment_submissions`.`id` = ?',
      [assessmentSubmissionId],
      [assessmentSubmissionsRows[3]]
    );
    mockQuery(
      'select `id`, `assessment_id`, `question_id`, `answer_id`, `response`, `score`, `grader_response` from `assessment_responses` where `submission_id` = ?',
      [assessmentSubmissionId],
      [assessmentResponsesRows[2]]
    );

    expect(
      await updateAssessmentSubmission(assessmentSubmissions[13], false)
    ).toEqual(assessmentSubmissions[9]);
  });
  it('should update an existing in-progress assessment submission by a participant with a changed response for FR response', async () => {
    const expectedNow = DateTime.utc(2023, 2, 9, 12, 5, 0);
    Settings.now = () => expectedNow.toMillis();

    mockQuery(
      'select `assessment_submissions`.`assessment_id`, `assessment_submissions`.`principal_id`, `assessment_submission_states`.`title` as `assessment_submission_state`, `assessment_submissions`.`score`, `assessment_submissions`.`opened_at`, `assessment_submissions`.`submitted_at`, `assessment_submissions`.`updated_at` from `assessment_submissions` inner join `assessment_submission_states` on `assessment_submissions`.`assessment_submission_state_id` = `assessment_submission_states`.`id` where `assessment_submissions`.`id` = ?',
      [assessmentSubmissionId],
      [assessmentSubmissionsRows[1]]
    );
    mockQuery(
      'select `id`, `assessment_id`, `question_id`, `answer_id`, `response`, `score`, `grader_response` from `assessment_responses` where `submission_id` = ?',
      [assessmentSubmissionId],
      [assessmentResponsesRows[4]]
    );
    mockQuery(
      'select `program_id`, `assessment_id`, `available_after`, `due_date` from `program_assessments` where `id` = ?',
      [programAssessments[0].id],
      [programAssessmentsRows[0]]
    );
    mockQuery(
      'select `id`, `title`, `start_date`, `end_date`, `time_zone`, `curriculum_id` from `programs` where `id` = ?',
      [programAssessments[0].program_id],
      [programsRows[0]]
    );
    mockQuery(
      'select `curriculum_assessments`.`title`, `curriculum_assessments`.`max_score`, `curriculum_assessments`.`max_num_submissions`, `curriculum_assessments`.`time_limit`, `curriculum_assessments`.`curriculum_id`, `curriculum_assessments`.`activity_id`, `curriculum_assessments`.`principal_id` from `curriculum_assessments` inner join `activities` on `curriculum_assessments`.`curriculum_id` = `activities`.`id` where `curriculum_assessments`.`id` = ?',
      [curriculumAssessmentId],
      [curriculumAssessmentsRows[0]]
    );
    mockQuery(
      'select `activity_types`.`title` from `activity_types` inner join `activities` on `activities`.`activity_type_id` = `activity_types`.`id` where `activities`.`id` = ?',
      [curriculumAssessmentsRows[0].activity_id],
      [
        {
          title: curriculumAssessments[4].assessment_type,
        },
      ]
    );
    mockQuery(
      'update `assessment_responses` set `response` = ? where `id` = ?',
      [assessmentResponsesRows[5].response, assessmentResponsesRows[5].id],
      1
    );
    mockQuery(
      'select `id` from `assessment_submission_states` where `title` = ?',
      ['In Progress'],
      [{ id: 4 }]
    );
    mockQuery(
      'update `assessment_submissions` set `assessment_submission_state_id` = ? where `id` = ?',
      [4, assessmentSubmissions[18].id],
      1
    );

    expect(
      await updateAssessmentSubmission(assessmentSubmissions[3], false)
    ).toEqual(assessmentSubmissions[3]);
  });
});

describe('updateCurriculumAssessment', () => {
  it('should update a curriculum assessment with existing questions and updated answers', async () => {
    mockQuery(
      'select `assessment_questions`.`id`, `assessment_questions`.`title`, `description`, `assessment_question_types`.`title` as `question_type`, `correct_answer_id`, `max_score`, `sort_order` from `assessment_questions` inner join `assessment_question_types` on `assessment_questions`.`question_type_id` = `assessment_question_types`.`id` where `assessment_questions`.`assessment_id` = ? order by `sort_order` asc',
      [curriculumAssessments[3].id],
      [assessmentQuestionsRows[0]]
    );

    mockQuery(
      'select `id`, `question_id`, `title`, `description`, `sort_order` from `assessment_answers` where `question_id` = ? order by `sort_order` asc',
      [assessmentQuestionsRows[0].id],
      [assessmentAnswersRows[0]]
    );

    mockQuery(
      'update `assessment_answers` set `title` = ?, `description` = ?, `sort_order` = ? where `id` = ?',
      [
        assessmentAnswersRows[2].title,
        assessmentAnswersRows[2].description,
        assessmentAnswersRows[2].sort_order,
        assessmentAnswersRows[2].id,
      ],
      [1]
    );

    mockQuery(
      'update `assessment_questions` set `title` = ?, `description` = ?, `correct_answer_id` = ?, `max_score` = ?, `sort_order` = ? where `id` = ?',
      [
        assessmentQuestionsRows[0].title,
        assessmentQuestionsRows[0].description,
        assessmentQuestionsRows[0].correct_answer_id,
        assessmentQuestionsRows[0].max_score,
        assessmentQuestionsRows[0].sort_order,
        assessmentQuestionsRows[0].id,
      ],
      [1]
    );

    mockQuery(
      'update `curriculum_assessments` set `title` = ?, `description` = ?, `max_score` = ?, `max_num_submissions` = ?, `time_limit` = ?, `activity_id` = ? where `id` = ?',
      [
        curriculumAssessmentsRows[0].title,
        curriculumAssessmentsRows[0].description,
        curriculumAssessmentsRows[0].max_score,
        curriculumAssessmentsRows[0].max_num_submissions,
        curriculumAssessmentsRows[0].time_limit,
        curriculumAssessmentsRows[0].activity_id,
        curriculumAssessmentsRows[0].id,
      ],
      [1]
    );

    expect(await updateCurriculumAssessment(curriculumAssessments[12])).toEqual(
      curriculumAssessments[12]
    );
  });

  it('should update a curriculum assessment with new questions', async () => {
    mockQuery(
      'select `assessment_questions`.`id`, `assessment_questions`.`title`, `description`, `assessment_question_types`.`title` as `question_type`, `correct_answer_id`, `max_score`, `sort_order` from `assessment_questions` inner join `assessment_question_types` on `assessment_questions`.`question_type_id` = `assessment_question_types`.`id` where `assessment_questions`.`assessment_id` = ? order by `sort_order` asc',
      [curriculumAssessments[3].id],
      []
    );

    mockQuery(
      'insert into `assessment_questions` (`assessment_id`, `description`, `max_score`, `question_type_id`, `sort_order`, `title`) values (?, ?, ?, ?, ?, ?)',
      [
        curriculumAssessmentId,
        questions[4].description,
        questions[4].max_score,
        1,
        questions[4].sort_order,
        questions[4].title,
      ],
      [singleChoiceQuestionId]
    );

    mockQuery(
      'insert into `assessment_answers` (`description`, `question_id`, `sort_order`, `title`) values (?, ?, ?, ?)',
      [
        answers[4].description,
        singleChoiceQuestionId,
        answers[4].sort_order,
        answers[4].title,
      ],
      [singleChoiceAnswerId]
    );

    mockQuery(
      'update `assessment_questions` set `correct_answer_id` = ? where `id` = ?',
      [assessmentQuestionsRows[0].correct_answer_id, singleChoiceQuestionId],
      [1]
    );

    mockQuery(
      'update `curriculum_assessments` set `title` = ?, `description` = ?, `max_score` = ?, `max_num_submissions` = ?, `time_limit` = ?, `activity_id` = ? where `id` = ?',
      [
        curriculumAssessmentsRows[0].title,
        curriculumAssessmentsRows[0].description,
        curriculumAssessmentsRows[0].max_score,
        curriculumAssessmentsRows[0].max_num_submissions,
        curriculumAssessmentsRows[0].time_limit,
        curriculumAssessmentsRows[0].activity_id,
        curriculumAssessmentsRows[0].id,
      ],
      [1]
    );

    expect(await updateCurriculumAssessment(curriculumAssessments[9])).toEqual(
      curriculumAssessments[3]
    );
  });

  it('should update a curriculum assessment with new question and delete old questions', async () => {
    mockQuery(
      'select `assessment_questions`.`id`, `assessment_questions`.`title`, `description`, `assessment_question_types`.`title` as `question_type`, `correct_answer_id`, `max_score`, `sort_order` from `assessment_questions` inner join `assessment_question_types` on `assessment_questions`.`question_type_id` = `assessment_question_types`.`id` where `assessment_questions`.`assessment_id` = ? order by `sort_order` asc',
      [curriculumAssessments[4].id],
      [assessmentQuestionsRows[1]]
    );

    mockQuery(
      'delete from `assessment_questions` where `id` = ?',
      [assessmentQuestionsRows[1].id],
      [1]
    );

    mockQuery(
      'insert into `assessment_questions` (`assessment_id`, `description`, `max_score`, `question_type_id`, `sort_order`, `title`) values (?, ?, ?, ?, ?, ?)',
      [
        curriculumAssessmentId,
        questions[4].description,
        questions[4].max_score,
        1,
        questions[4].sort_order,
        questions[4].title,
      ],
      [singleChoiceQuestionId]
    );

    mockQuery(
      'insert into `assessment_answers` (`description`, `question_id`, `sort_order`, `title`) values (?, ?, ?, ?)',
      [
        answers[4].description,
        singleChoiceQuestionId,
        answers[4].sort_order,
        answers[4].title,
      ],
      [singleChoiceAnswerId]
    );

    mockQuery(
      'update `assessment_questions` set `correct_answer_id` = ? where `id` = ?',
      [assessmentQuestionsRows[0].correct_answer_id, singleChoiceQuestionId],
      [1]
    );

    mockQuery(
      'update `curriculum_assessments` set `title` = ?, `description` = ?, `max_score` = ?, `max_num_submissions` = ?, `time_limit` = ?, `activity_id` = ? where `id` = ?',
      [
        curriculumAssessmentsRows[0].title,
        curriculumAssessmentsRows[0].description,
        curriculumAssessmentsRows[0].max_score,
        curriculumAssessmentsRows[0].max_num_submissions,
        curriculumAssessmentsRows[0].time_limit,
        curriculumAssessmentsRows[0].activity_id,
        curriculumAssessmentsRows[0].id,
      ],
      [1]
    );

    expect(await updateCurriculumAssessment(curriculumAssessments[10])).toEqual(
      curriculumAssessments[3]
    );
  });

  it('should update a curriculum assessment with new answer and delete existing answer', async () => {
    mockQuery(
      'select `assessment_questions`.`id`, `assessment_questions`.`title`, `description`, `assessment_question_types`.`title` as `question_type`, `correct_answer_id`, `max_score`, `sort_order` from `assessment_questions` inner join `assessment_question_types` on `assessment_questions`.`question_type_id` = `assessment_question_types`.`id` where `assessment_questions`.`assessment_id` = ? order by `sort_order` asc',
      [curriculumAssessments[3].id],
      [assessmentQuestionsRows[0]]
    );

    mockQuery(
      'select `id`, `question_id`, `title`, `description`, `sort_order` from `assessment_answers` where `question_id` = ? order by `sort_order` asc',
      [assessmentQuestionsRows[0].id],
      [assessmentAnswersRows[0]]
    );

    mockQuery(
      'delete from `assessment_answers` where `id` = ?',
      [assessmentAnswersRows[0].id],
      [1]
    );

    mockQuery(
      'insert into `assessment_answers` (`description`, `question_id`, `sort_order`, `title`) values (?, ?, ?, ?)',
      [
        answers[4].description,
        singleChoiceQuestionId,
        answers[4].sort_order,
        answers[4].title,
      ],
      [singleChoiceAnswerId]
    );

    mockQuery(
      'update `assessment_questions` set `title` = ?, `description` = ?, `correct_answer_id` = ?, `max_score` = ?, `sort_order` = ? where `id` = ?',
      [
        assessmentQuestionsRows[0].title,
        assessmentQuestionsRows[0].description,
        singleChoiceAnswerId,
        assessmentQuestionsRows[0].max_score,
        assessmentQuestionsRows[0].sort_order,
        assessmentQuestionsRows[0].id,
      ],
      [1]
    );

    mockQuery(
      'update `curriculum_assessments` set `title` = ?, `description` = ?, `max_score` = ?, `max_num_submissions` = ?, `time_limit` = ?, `activity_id` = ? where `id` = ?',
      [
        curriculumAssessmentsRows[0].title,
        curriculumAssessmentsRows[0].description,
        curriculumAssessmentsRows[0].max_score,
        curriculumAssessmentsRows[0].max_num_submissions,
        curriculumAssessmentsRows[0].time_limit,
        curriculumAssessmentsRows[0].activity_id,
        curriculumAssessmentsRows[0].id,
      ],
      [1]
    );

    expect(await updateCurriculumAssessment(curriculumAssessments[11])).toEqual(
      curriculumAssessments[3]
    );
  });
});

describe('updateProgramAssessment', () => {
  it('should return update for an existing program assessment ID', async () => {
    mockQuery(
      'update `program_assessments` set `available_after` = ?, `due_date` = ? where `id` = ?',
      [
        programAssessmentsRows[3].available_after,
        programAssessmentsRows[3].due_date,
        programAssessmentsRows[3].id,
      ],
      []
    );

    expect(await updateProgramAssessment(programAssessmentsRows[3])).toEqual(
      programAssessmentsRows[3]
    );
  });
});
