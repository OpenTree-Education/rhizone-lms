import {
  collectionEnvelope,
  errorEnvelope,
  itemEnvelope,
} from '../responseEnvelope';
import { createAppAgentForRouter, mockPrincipalId } from '../routerTestUtils';

import {
  AssessmentDetails,
  AssessmentSubmission,
  AssessmentWithSubmissions,
  AssessmentWithSummary,
  CurriculumAssessment,
  FacilitatorAssessmentSubmissionsSummary,
  ParticipantAssessmentSubmissionsSummary,
  ProgramAssessment,
  SavedAssessment,
} from '../../models';
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
  updateAssessmentSubmission,
  updateCurriculumAssessment,
  updateProgramAssessment,
} from '../../services/assessmentsService';

import assessmentsRouter from '../assessmentsRouter';

jest.mock('../../services/assessmentsService');

const mockConstructFacilitatorAssessmentSummary = jest.mocked(
  constructFacilitatorAssessmentSummary
);
const mockConstructParticipantAssessmentSummary = jest.mocked(
  constructParticipantAssessmentSummary
);
const mockCreateAssessmentSubmission = jest.mocked(createAssessmentSubmission);
const mockCreateCurriculumAssessment = jest.mocked(createCurriculumAssessment);
const mockCreateProgramAssessment = jest.mocked(createProgramAssessment);
const mockDeleteCurriculumAssessment = jest.mocked(deleteCurriculumAssessment);
const mockDeleteProgramAssessment = jest.mocked(deleteProgramAssessment);
const mockFindProgramAssessment = jest.mocked(findProgramAssessment);
const mockGetAssessmentSubmission = jest.mocked(getAssessmentSubmission);
const mockGetCurriculumAssessment = jest.mocked(getCurriculumAssessment);
const mockFacilitatorProgramIdsMatchingCurriculum = jest.mocked(
  facilitatorProgramIdsMatchingCurriculum
);
const mockGetPrincipalProgramRole = jest.mocked(getPrincipalProgramRole);
const mockListAllProgramAssessmentSubmissions = jest.mocked(
  listAllProgramAssessmentSubmissions
);
const mockListParticipantProgramAssessmentSubmissions = jest.mocked(
  listParticipantProgramAssessmentSubmissions
);
const mockListPrincipalEnrolledProgramIds = jest.mocked(
  listPrincipalEnrolledProgramIds
);
const mockListProgramAssessments = jest.mocked(listProgramAssessments);
const mockUpdateAssessmentSubmission = jest.mocked(updateAssessmentSubmission);
const mockUpdateCurriculumAssessment = jest.mocked(updateCurriculumAssessment);
const mockUpdateProgramAssessment = jest.mocked(updateProgramAssessment);

/* EXAMPLE DATA: Variables */

const participantPrincipalId = 30;
const unenrolledPrincipalId = 31;
const otherParticipantPrincipalId = 32;
const facilitatorPrincipalId = 300;
const curriculumId = 4;
const curriculumAssessmentId = 8;
const assessmentSubmissionId = 32;
const facilitatorProgramIdsThatMatchCurriculum = [12, 20, 30];

/* EXAMPLE DATA: Database Rows */

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

describe('assessmentsRouter', () => {
  const appAgent = createAppAgentForRouter(assessmentsRouter);
  describe('GET /', () => {
    it('should respond with an empty list for a user not enrolled in any programs', done => {
      mockListPrincipalEnrolledProgramIds.mockResolvedValue([]);

      mockPrincipalId(unenrolledPrincipalId);

      appAgent.get('/').expect(200, collectionEnvelope([], 0), err => {
        expect(mockListPrincipalEnrolledProgramIds).toHaveBeenCalledWith(
          unenrolledPrincipalId
        );
        done(err);
      });
    });

    it('should respond with a list of all assessments (without questions) for participant enrolled in one program', done => {
      const ParticipantAssessmentSubmissionsSummary: AssessmentWithSummary[] = [
        {
          curriculum_assessment: curriculumAssessments[0],
          program_assessment: programAssessments[0],
          participant_submissions_summary: participantSummaries[3],
          principal_program_role: 'Participant',
        },
      ];
      mockListPrincipalEnrolledProgramIds.mockResolvedValue([
        programAssessments[0].program_id,
      ]);
      mockGetPrincipalProgramRole.mockResolvedValue('Participant');
      mockListProgramAssessments.mockResolvedValue([programAssessments[0]]);
      mockGetCurriculumAssessment.mockResolvedValue(curriculumAssessments[0]);
      mockConstructParticipantAssessmentSummary.mockResolvedValue(
        participantSummaries[3]
      );
      mockPrincipalId(participantPrincipalId);

      appAgent
        .get('/')
        .expect(
          200,
          collectionEnvelope(
            ParticipantAssessmentSubmissionsSummary,
            ParticipantAssessmentSubmissionsSummary.length
          ),
          err => {
            expect(mockListPrincipalEnrolledProgramIds).toHaveBeenCalledWith(
              participantPrincipalId
            );
            expect(mockGetPrincipalProgramRole).toHaveBeenCalledWith(
              participantPrincipalId,
              programAssessments[0].program_id
            );
            expect(mockListProgramAssessments).toHaveBeenCalledWith(
              programAssessments[0].program_id
            );
            expect(mockGetCurriculumAssessment).toHaveBeenCalledWith(
              programAssessments[0].assessment_id,
              false,
              false
            );
            expect(
              mockConstructParticipantAssessmentSummary
            ).toHaveBeenCalledWith(
              participantPrincipalId,
              programAssessments[0]
            );
            done(err);
          }
        );
    });

    it('should respond with a list of all assessments (without questions) for facilitator of one program', done => {
      const facilitatorAssessmentListResponse: AssessmentWithSummary[] = [
        {
          curriculum_assessment: curriculumAssessments[0],
          program_assessment: programAssessments[0],
          facilitator_submissions_summary: facilitatorSummaries[0],
          principal_program_role: 'Facilitator',
        },
      ];
      mockListPrincipalEnrolledProgramIds.mockResolvedValue([
        programAssessments[0].program_id,
      ]);
      mockGetPrincipalProgramRole.mockResolvedValue('Facilitator');
      mockListProgramAssessments.mockResolvedValue([programAssessments[0]]);
      mockGetCurriculumAssessment.mockResolvedValue(curriculumAssessments[0]);
      mockConstructFacilitatorAssessmentSummary.mockResolvedValue(
        facilitatorSummaries[0]
      );

      mockPrincipalId(facilitatorPrincipalId);

      appAgent
        .get('/')
        .expect(
          200,
          collectionEnvelope(
            facilitatorAssessmentListResponse,
            facilitatorAssessmentListResponse.length
          ),
          err => {
            expect(mockListPrincipalEnrolledProgramIds).toHaveBeenCalledWith(
              facilitatorPrincipalId
            );
            expect(mockGetPrincipalProgramRole).toHaveBeenCalledWith(
              facilitatorPrincipalId,
              programAssessments[0].program_id
            );
            expect(mockListProgramAssessments).toBeCalledWith(
              programAssessments[0].program_id
            );
            expect(mockGetCurriculumAssessment).toHaveBeenCalledWith(
              programAssessments[0].assessment_id,
              false,
              false
            );
            expect(
              mockConstructFacilitatorAssessmentSummary
            ).toHaveBeenCalledWith(programAssessments[0]);
            done(err);
          }
        );
    });

    it('should throw an error if a database error was encountered', done => {
      mockListPrincipalEnrolledProgramIds.mockRejectedValue(new Error());

      mockPrincipalId(facilitatorPrincipalId);

      appAgent.get('/').expect(500, done);
    });
  });

  describe('GET /curriculum/:curriculumAssessmentId', () => {
    it('should retrieve a curriculum assessment if the logged-in principal ID is the program facilitator', done => {
      mockGetCurriculumAssessment.mockResolvedValue(curriculumAssessments[3]);
      mockFacilitatorProgramIdsMatchingCurriculum.mockResolvedValue([
        programAssessments[0].program_id,
      ]);

      mockPrincipalId(facilitatorPrincipalId);

      appAgent
        .get(`/curriculum/${curriculumAssessments[3].id}`)
        .expect(200, itemEnvelope(curriculumAssessments[3]), err => {
          expect(mockGetCurriculumAssessment).toHaveBeenCalledWith(
            curriculumAssessments[3].id,
            true,
            true
          );
          expect(
            mockFacilitatorProgramIdsMatchingCurriculum
          ).toHaveBeenCalledWith(
            facilitatorPrincipalId,
            curriculumAssessments[3].curriculum_id
          );

          done(err);
        });
    });

    it('should respond with an UnauthorizedError if the logged-in principal ID is not the program facilitator', done => {
      mockGetCurriculumAssessment.mockResolvedValue(curriculumAssessments[3]);
      mockFacilitatorProgramIdsMatchingCurriculum.mockResolvedValue([]);

      mockPrincipalId(participantPrincipalId);

      appAgent
        .get(`/curriculum/${curriculumAssessments[3].id}`)
        .expect(
          401,
          errorEnvelope(
            `Not allowed to access curriculum assessment with ID ${curriculumAssessments[3].id}.`
          ),
          err => {
            expect(mockGetCurriculumAssessment).toHaveBeenCalledWith(
              curriculumAssessments[3].id,
              true,
              true
            );
            expect(
              mockFacilitatorProgramIdsMatchingCurriculum
            ).toHaveBeenCalledWith(
              participantPrincipalId,
              curriculumAssessments[3].curriculum_id
            );

            done(err);
          }
        );
    });

    it('should respond with an BadRequestError if the curriculum assessment ID is not a number.', done => {
      mockPrincipalId(facilitatorPrincipalId);

      appAgent
        .get(`/curriculum/test`)
        .expect(
          400,
          errorEnvelope(`"${Number(test)}" is not a valid submission ID.`),
          err => {
            done(err);
          }
        );
    });

    it('should respond with a NotFoundError if the curriculum assessment ID was not found in the database', done => {
      mockGetCurriculumAssessment.mockResolvedValue(null);

      mockPrincipalId(facilitatorPrincipalId);

      appAgent
        .get(`/curriculum/${curriculumAssessments[3].id}`)
        .expect(
          404,
          errorEnvelope(
            `Could not find curriculum assessment with ID ${curriculumAssessments[3].id}.`
          ),
          err => {
            expect(mockGetCurriculumAssessment).toHaveBeenCalledWith(
              curriculumAssessments[3].id,
              true,
              true
            );

            done(err);
          }
        );
    });
  });

  describe('POST /curriculum', () => {
    it('should create a curriculum assessment if the logged-in principal ID is the program facilitator', done => {
      const matchingFacilitatorPrograms = [3, 4, 6];
      mockFacilitatorProgramIdsMatchingCurriculum.mockResolvedValue(
        matchingFacilitatorPrograms
      );
      mockCreateCurriculumAssessment.mockResolvedValue(
        curriculumAssessments[13]
      );
      mockPrincipalId(facilitatorPrincipalId);

      appAgent
        .post(`/curriculum`)
        .send(curriculumAssessments[5])
        .expect(201, err => {
          expect(
            mockFacilitatorProgramIdsMatchingCurriculum
          ).toHaveBeenCalledWith(
            facilitatorPrincipalId,
            curriculumAssessments[5].curriculum_id
          );
          expect(mockCreateCurriculumAssessment).toHaveBeenCalledWith(
            curriculumAssessments[5]
          );

          done(err);
        });
    });

    it('should respond with an Unauthorized Error if the logged-in principal id is not the facilitator', done => {
      mockFacilitatorProgramIdsMatchingCurriculum.mockResolvedValue([]);
      mockPrincipalId(participantPrincipalId);

      appAgent
        .post(`/curriculum`)
        .send(curriculumAssessments[5])
        .expect(
          401,
          errorEnvelope(
            `Not allowed to add a new assessment for this curriculum.`
          ),
          err => {
            expect(
              mockFacilitatorProgramIdsMatchingCurriculum
            ).toHaveBeenCalledWith(
              participantPrincipalId,
              curriculumAssessments[5].curriculum_id
            );
            done(err);
          }
        );
    });

    it('should reponse with BadRequestError if the information missing', done => {
      mockPrincipalId(facilitatorPrincipalId);

      appAgent
        .post(`/curriculum`)
        .send({ description: 'test' })
        .expect(
          422,
          errorEnvelope(`Was not given a valid curriculum assessment.`),
          err => {
            done(err);
          }
        );
    });
  });

  describe('PUT /curriculum/:curriculumAssessmentId', () => {
    it('should update a curriculum assessment if the logged-in principal ID is the program facilitator', done => {
      mockGetCurriculumAssessment.mockResolvedValue(curriculumAssessments[3]);
      mockFacilitatorProgramIdsMatchingCurriculum.mockResolvedValue(
        facilitatorProgramIdsThatMatchCurriculum
      );
      mockUpdateCurriculumAssessment.mockResolvedValue(
        curriculumAssessments[8]
      );

      mockPrincipalId(facilitatorPrincipalId);

      appAgent
        .put(`/curriculum/${curriculumAssessments[0].id}`)
        .send(curriculumAssessments[8])
        .expect(200, itemEnvelope(curriculumAssessments[8]), err => {
          expect(mockGetCurriculumAssessment).toHaveBeenCalledWith(
            curriculumAssessments[0].id
          );
          expect(
            mockFacilitatorProgramIdsMatchingCurriculum
          ).toHaveBeenCalledWith(facilitatorPrincipalId, curriculumId);
          expect(mockUpdateCurriculumAssessment).toHaveBeenCalledWith(
            curriculumAssessments[8]
          );

          done(err);
        });
    });

    it('should respond with a BadRequestError if the curriculumAssessment ID is not a valid number.', done => {
      const curriculumAssessmentIdInvalid = 0;
      mockPrincipalId(facilitatorPrincipalId);

      appAgent
        .put(`/curriculum/${curriculumAssessmentIdInvalid}`)
        .expect(
          400,
          errorEnvelope(
            `"${Number(
              curriculumAssessmentIdInvalid
            )}" is not a valid curriculum assessment ID.`
          ),
          done
        );
    });

    it('should respond with a ValidationError if given an curriculum assessment is not valid', done => {
      mockPrincipalId(facilitatorPrincipalId);

      appAgent
        .put(`/curriculum/${curriculumAssessments[0].id}`)
        .send({ assessment_type: 'test' })
        .expect(
          422,
          errorEnvelope(`Was not given a valid curriculum assessment.`),
          err => {
            done(err);
          }
        );
    });

    it('should respond with a NotFoundError if the curriculum assessment ID was not found in the database', done => {
      mockGetCurriculumAssessment.mockResolvedValue(null);
      mockPrincipalId(facilitatorPrincipalId);

      appAgent
        .put(`/curriculum/${curriculumAssessments[0].id}`)
        .send(curriculumAssessments[8])
        .expect(
          404,
          errorEnvelope(
            `Could not find curriculum assessment with ID ${curriculumAssessments[0].id}.`
          ),
          err => {
            expect(mockGetCurriculumAssessment).toHaveBeenCalledWith(
              curriculumAssessments[0].id
            );

            done(err);
          }
        );
    });

    it('should respond with an Unauthorized Error if the the facilitator is not taking the program with the curriculum', done => {
      mockGetCurriculumAssessment.mockResolvedValue(curriculumAssessments[0]);
      mockFacilitatorProgramIdsMatchingCurriculum.mockResolvedValue([]);

      mockPrincipalId(participantPrincipalId);

      appAgent
        .put(`/curriculum/${curriculumAssessments[0].id}`)
        .send(curriculumAssessments[8])
        .expect(
          401,
          errorEnvelope(
            `Not allowed to make modifications to curriculum assessment with ID ${curriculumAssessments[0].id}.`
          ),
          err => {
            expect(mockGetCurriculumAssessment).toHaveBeenCalledWith(
              curriculumAssessments[0].id
            );

            expect(
              mockFacilitatorProgramIdsMatchingCurriculum
            ).toHaveBeenCalledWith(participantPrincipalId, curriculumId);

            done(err);
          }
        );
    });

    it('should respond with InternalServerError if curriculum assessment with given ID could not be updated', done => {
      mockGetCurriculumAssessment.mockResolvedValue(curriculumAssessments[3]);
      mockFacilitatorProgramIdsMatchingCurriculum.mockResolvedValue(
        facilitatorProgramIdsThatMatchCurriculum
      );
      mockUpdateCurriculumAssessment.mockResolvedValue(null);

      mockPrincipalId(facilitatorPrincipalId);

      appAgent
        .put(`/curriculum/${curriculumAssessments[0].id}`)
        .send(curriculumAssessments[8])

        .expect(
          500,
          errorEnvelope(
            `Could not update curriculum assessment with ID ${curriculumAssessments[0].id}.`
          ),
          err => {
            expect(mockGetCurriculumAssessment).toHaveBeenCalledWith(
              curriculumAssessments[0].id
            );
            expect(
              mockFacilitatorProgramIdsMatchingCurriculum
            ).toHaveBeenCalledWith(facilitatorPrincipalId, curriculumId);
            expect(mockUpdateCurriculumAssessment).toHaveBeenCalledWith(
              curriculumAssessments[8]
            );
            done(err);
          }
        );
    });
  });

  describe('DELETE /curriculum/:curriculumAssessmentId', () => {
    it('should delete a curriculumAssessment if principal ID is a program facilitator of that curriculum', done => {
      mockGetCurriculumAssessment.mockResolvedValue(curriculumAssessments[0]);

      mockFacilitatorProgramIdsMatchingCurriculum.mockResolvedValue(
        facilitatorProgramIdsThatMatchCurriculum
      );
      mockDeleteCurriculumAssessment.mockResolvedValue(null);

      mockPrincipalId(facilitatorPrincipalId);

      appAgent
        .delete(`/curriculum/${curriculumAssessmentId}`)
        .expect(204, {}, err => {
          expect(mockGetCurriculumAssessment).toHaveBeenCalledWith(
            curriculumAssessmentId
          );
          expect(
            mockFacilitatorProgramIdsMatchingCurriculum
          ).toHaveBeenCalledWith(facilitatorPrincipalId, curriculumId);

          expect(mockDeleteCurriculumAssessment).toHaveBeenCalledWith(
            curriculumAssessments[0].id
          );

          done(err);
        });
    });

    it('should respond with an Unauthorized Error if the the facilitator is not taking the program with the curriculum', done => {
      mockGetCurriculumAssessment.mockResolvedValue(curriculumAssessments[0]);
      mockFacilitatorProgramIdsMatchingCurriculum.mockResolvedValue([]);

      mockPrincipalId(participantPrincipalId);

      appAgent
        .delete(`/curriculum/${curriculumAssessmentId}`)
        .expect(
          401,
          errorEnvelope(
            `Not allowed to delete curriculum assessment with ID ${curriculumAssessmentId}.`
          ),
          err => {
            expect(mockGetCurriculumAssessment).toHaveBeenCalledWith(
              curriculumAssessmentId
            );

            expect(
              mockFacilitatorProgramIdsMatchingCurriculum
            ).toHaveBeenCalledWith(participantPrincipalId, curriculumId);

            done(err);
          }
        );
    });

    it('should respond with a BadRequestError if the curriculumAssessment ID is not a valid number.', done => {
      const curriculumId = 'test';
      mockPrincipalId(facilitatorPrincipalId);

      appAgent
        .delete(`/curriculum/${curriculumId}`)
        .expect(
          400,
          errorEnvelope(
            `"${Number(curriculumId)}" is not a valid curriculum assessment ID.`
          ),
          done
        );
    });

    it('should respond with a NotFoundError if the curriculum assessment ID was not found in the database', done => {
      mockGetCurriculumAssessment.mockResolvedValue(null);

      mockPrincipalId(facilitatorPrincipalId);

      appAgent
        .delete(`/curriculum/${curriculumAssessmentId}`)
        .expect(
          404,
          errorEnvelope(
            `Could not find curriculum assessment with ID ${curriculumAssessmentId}.`
          ),
          err => {
            expect(mockGetCurriculumAssessment).toHaveBeenCalledWith(
              curriculumAssessmentId
            );

            done(err);
          }
        );
    });
    it('should respond with a ConflictError if trying to delete curriculum Assessment ID that. ', done => {
      mockGetCurriculumAssessment.mockResolvedValue(curriculumAssessments[0]);
      mockFacilitatorProgramIdsMatchingCurriculum.mockResolvedValue(
        facilitatorProgramIdsThatMatchCurriculum
      );
      mockDeleteCurriculumAssessment.mockRejectedValue(new Error());

      mockPrincipalId(facilitatorPrincipalId);
      appAgent
        .delete(`/curriculum/${curriculumAssessmentId}`)
        .expect(
          409,
          errorEnvelope(`Cannot delete a curriculum assessment.`),
          err => {
            expect(mockGetCurriculumAssessment).toHaveBeenCalledWith(
              curriculumAssessmentId
            );

            expect(
              mockFacilitatorProgramIdsMatchingCurriculum
            ).toHaveBeenCalledWith(facilitatorPrincipalId, curriculumId);

            expect(mockDeleteCurriculumAssessment).toHaveBeenCalledWith(
              curriculumAssessments[0].id
            );

            done(err);
          }
        );
    });
  });

  describe('GET /program/:programAssessmentId', () => {
    it('should get a program assessment if the logged-in principal ID is the program facilitator', done => {
      mockFindProgramAssessment.mockResolvedValue(programAssessments[0]);
      mockGetPrincipalProgramRole.mockResolvedValue('Facilitator');
      mockGetCurriculumAssessment.mockResolvedValue(curriculumAssessments[3]);

      mockPrincipalId(facilitatorPrincipalId);

      appAgent
        .get(`/program/${programAssessments[0].id}`)
        .expect(200, itemEnvelope(assessmentDetails[0]), err => {
          expect(mockFindProgramAssessment).toHaveBeenCalledWith(
            programAssessments[0].id
          );

          expect(mockGetPrincipalProgramRole).toHaveBeenCalledWith(
            facilitatorPrincipalId,
            programAssessments[0].program_id
          );
          expect(mockGetCurriculumAssessment).toHaveBeenCalledWith(
            programAssessments[0].assessment_id,
            true,
            true
          );

          done(err);
        });
    });

    it('should respond with an Unauthorized Error if the logged-in principal id is not the facilitator', done => {
      mockFindProgramAssessment.mockResolvedValue(programAssessments[0]);
      mockGetPrincipalProgramRole.mockResolvedValue(null);

      mockPrincipalId(otherParticipantPrincipalId);

      appAgent
        .get(`/program/${programAssessments[0].id}`)
        .expect(
          401,
          errorEnvelope(
            `Could not access assessment with Program Assessment ID ${programAssessments[0].id}.`
          ),
          err => {
            expect(mockFindProgramAssessment).toHaveBeenCalledWith(
              programAssessments[0].id
            );

            expect(mockGetPrincipalProgramRole).toHaveBeenCalledWith(
              otherParticipantPrincipalId,
              programAssessments[0].program_id
            );

            done(err);
          }
        );
    });

    it('should respond with an BadRequestError if the program assessment ID is not a number.', done => {
      const exampleAssessmentFromUser = 'test';

      mockPrincipalId(otherParticipantPrincipalId);

      appAgent
        .get(`/program/${exampleAssessmentFromUser}`)
        .expect(
          400,
          errorEnvelope(
            `"${Number(
              exampleAssessmentFromUser
            )}" is not a valid submission ID.`
          ),
          done
        );
    });

    it('should respond with a NotFoundError if the program assessment ID was not found in the database', done => {
      const programAssessmentId = 20;

      mockFindProgramAssessment.mockResolvedValue(null);

      mockPrincipalId(facilitatorPrincipalId);
      appAgent
        .get(`/program/${programAssessmentId}`)
        .expect(
          404,
          errorEnvelope(
            `Could not find program assessment with ID ${programAssessmentId}.`
          ),
          err => {
            expect(mockFindProgramAssessment).toHaveBeenCalledWith(
              programAssessmentId
            );

            done(err);
          }
        );
    });
  });

  describe('POST /program', () => {
    it('should create a new program assessment if the logged-in principal ID is the program facilitator', done => {
      mockGetPrincipalProgramRole.mockResolvedValue('Facilitator');
      mockCreateProgramAssessment.mockResolvedValue(programAssessmentsRows[3]);

      mockPrincipalId(facilitatorPrincipalId);

      appAgent
        .post(`/program`)
        .send(programAssessmentsRows[0])
        .expect(201, err => {
          expect(mockGetPrincipalProgramRole).toHaveBeenCalledWith(
            facilitatorPrincipalId,
            programAssessmentsRows[0].program_id
          );

          expect(mockCreateProgramAssessment).toHaveBeenCalledWith(
            programAssessmentsRows[0]
          );

          done(err);
        });
    });

    it('should respond with an Unauthorized Error if the logged-in principal id is not the facilitator', done => {
      mockGetPrincipalProgramRole.mockResolvedValue('Participant');

      mockPrincipalId(participantPrincipalId);

      appAgent
        .post(`/program`)
        .send(programAssessmentsRows[0])
        .expect(
          401,
          errorEnvelope(
            `User is not allowed to create new program assessments for this program.`
          ),
          err => {
            expect(mockGetPrincipalProgramRole).toHaveBeenCalledWith(
              participantPrincipalId,
              programAssessmentsRows[0].program_id
            );

            done(err);
          }
        );
    });

    it('should respond with a BadRequestError if given an invalid program assessment', done => {
      mockPrincipalId(facilitatorPrincipalId);

      appAgent
        .post(`/program`)
        .send({ available_after: '2023-08-10' })
        .expect(
          400,
          errorEnvelope(`Was not given a valid program assessment.`),
          err => {
            done(err);
          }
        );
    });
  });

  describe('PUT /program/:programAssessmentId', () => {
    it('should update a program assessment if the logged-in principal ID is the program facilitator', done => {
      mockFindProgramAssessment.mockResolvedValue(programAssessments[0]);
      mockGetPrincipalProgramRole.mockResolvedValue('Facilitator');
      mockUpdateProgramAssessment.mockResolvedValue(programAssessmentsRows[3]);

      mockPrincipalId(facilitatorPrincipalId);

      appAgent
        .put(`/program/${programAssessments[0].id}`)
        .send(programAssessmentsRows[3])
        .expect(200, itemEnvelope(programAssessmentsRows[3]), err => {
          expect(mockFindProgramAssessment).toHaveBeenCalledWith(
            programAssessments[0].id
          );

          expect(mockGetPrincipalProgramRole).toHaveBeenCalledWith(
            facilitatorPrincipalId,
            programAssessments[0].program_id
          );

          expect(mockUpdateProgramAssessment).toHaveBeenCalledWith(
            programAssessmentsRows[3]
          );

          done(err);
        });
    });

    it('should respond with an Unauthorized Error if the logged-in principal id is not the facilitator', done => {
      mockFindProgramAssessment.mockResolvedValue(programAssessments[0]);
      mockGetPrincipalProgramRole.mockResolvedValue(null);

      mockPrincipalId(otherParticipantPrincipalId);

      appAgent
        .put(`/program/${programAssessments[0].id}`)
        .send(programAssessmentsRows[3])
        .expect(
          401,
          errorEnvelope(
            `Could not access program Assessment with ID ${programAssessments[0].id}.`
          ),
          err => {
            expect(mockFindProgramAssessment).toHaveBeenCalledWith(
              programAssessments[0].id
            );

            expect(mockGetPrincipalProgramRole).toHaveBeenCalledWith(
              otherParticipantPrincipalId,
              programAssessments[0].program_id
            );

            done(err);
          }
        );
    });

    it('should respond with an BadRequestError if the program assessment ID is not a number.', done => {
      const exampleAssessmentFromUser = 'test';

      mockPrincipalId(otherParticipantPrincipalId);

      appAgent
        .put(`/program/${exampleAssessmentFromUser}`)
        .send(programAssessments[0])
        .expect(
          400,
          errorEnvelope(
            `"${Number(
              exampleAssessmentFromUser
            )}" is not a valid program assessment ID.`
          ),
          done
        );
    });

    it('should respond with an BadRequestError if not given a valid program assessment.', done => {
      const exampleAssessmentFormUser = 'test';

      mockFindProgramAssessment.mockResolvedValue(programAssessments[0]);
      mockGetPrincipalProgramRole.mockResolvedValue('Facilitator');

      mockPrincipalId(facilitatorPrincipalId);

      appAgent
        .put(`/program/${programAssessments[0].id}`)
        .send(exampleAssessmentFormUser)
        .expect(
          400,
          errorEnvelope(`Was not given a valid program assessment.`),
          err => {
            expect(mockFindProgramAssessment).toHaveBeenCalledWith(
              programAssessments[0].id
            );

            expect(mockGetPrincipalProgramRole).toHaveBeenCalledWith(
              facilitatorPrincipalId,
              programAssessments[0].program_id
            );

            done(err);
          }
        );
    });

    it('should respond with a NotFoundError if the program assessment ID was not found in the database', done => {
      const programAssessmentId = 20;

      mockFindProgramAssessment.mockResolvedValue(null);

      mockPrincipalId(facilitatorPrincipalId);
      appAgent
        .put(`/program/${programAssessmentId}`)
        .send(programAssessmentsRows[3])
        .expect(
          404,
          errorEnvelope(
            `Could not find program assessment with ID ${programAssessmentId}.`
          ),
          err => {
            expect(mockFindProgramAssessment).toHaveBeenCalledWith(
              programAssessmentId
            );

            done(err);
          }
        );
    });
  });

  describe('DELETE /program/:programAssessmentId', () => {
    it('should delete a program assessment in the system if logged-in user is facilitator of that program', done => {
      mockFindProgramAssessment.mockResolvedValue(programAssessments[0]);
      mockGetPrincipalProgramRole.mockResolvedValue('Facilitator');
      mockDeleteProgramAssessment.mockResolvedValue(null);

      mockPrincipalId(facilitatorPrincipalId);
      appAgent
        .delete(`/program/${programAssessments[0].id}`)
        .expect(204, {}, err => {
          expect(mockFindProgramAssessment).toHaveBeenCalledWith(
            programAssessments[0].id
          );
          expect(mockGetPrincipalProgramRole).toHaveBeenCalledWith(
            facilitatorPrincipalId,
            programAssessments[0].program_id
          );
          expect(mockDeleteProgramAssessment).toHaveBeenCalledWith(
            programAssessments[0].id
          );
          done(err);
        });
    });

    it('should return an error if logged-in user is not a facilitator of that program', done => {
      mockFindProgramAssessment.mockResolvedValue(programAssessments[0]);
      mockGetPrincipalProgramRole.mockResolvedValue('Participant');

      mockPrincipalId(participantPrincipalId);
      appAgent
        .delete(`/program/${programAssessments[0].id}`)
        .expect(
          401,
          errorEnvelope(
            `Not allowed to access program assessment with ID ${programAssessments[0].id}.`
          ),
          err => {
            expect(mockFindProgramAssessment).toHaveBeenCalledWith(
              programAssessments[0].id
            );
            expect(mockGetPrincipalProgramRole).toHaveBeenCalledWith(
              participantPrincipalId,
              programAssessments[0].program_id
            );
            done(err);
          }
        );
    });

    it('should respond with a BadRequestError if given an invalid program assessment ID', done => {
      const programAssessmentId = 'test';

      appAgent
        .delete(`/program/${programAssessmentId}`)
        .expect(
          400,
          errorEnvelope(
            `"${Number(
              programAssessmentId
            )}" is not a valid program assessment ID.`
          ),
          done
        );
    });
    it('should respond with a NotFoundError if assessment ID not exist', done => {
      mockFindProgramAssessment.mockResolvedValue(null);
      appAgent
        .delete(`/program/${programAssessments[0].id}`)
        .expect(
          404,
          errorEnvelope(
            `Could not find program assessment with ID ${programAssessments[0].id}.`
          ),
          err => {
            expect(mockFindProgramAssessment).toHaveBeenCalledWith(
              programAssessments[0].id
            );
            done(err);
          }
        );
    });
    it('should respond with a ConflictError if trying to delete program assessment that has participant submissions. ', done => {
      mockFindProgramAssessment.mockResolvedValue(programAssessments[0]);
      mockGetPrincipalProgramRole.mockResolvedValue('Facilitator');
      mockDeleteProgramAssessment.mockRejectedValue(new Error());
      mockPrincipalId(facilitatorPrincipalId);
      appAgent
        .delete(`/program/${programAssessments[0].id}`)
        .expect(
          409,
          errorEnvelope(
            `Cannot delete a program assessment that has participant submissions.`
          ),
          err => {
            expect(mockFindProgramAssessment).toHaveBeenCalledWith(
              programAssessments[0].id
            );
            expect(mockGetPrincipalProgramRole).toHaveBeenCalledWith(
              facilitatorPrincipalId,
              programAssessments[0].program_id
            );
            expect(mockDeleteProgramAssessment).toHaveBeenCalledWith(
              programAssessments[0].id
            );

            done(err);
          }
        );
    });
  });

  describe('GET /program/:programAssessmentId/submissions', () => {
    it('should show a facilitator an AssessmentWithSubmissions with all participant submissions', done => {
      mockFindProgramAssessment.mockResolvedValue(programAssessments[0]);
      mockGetPrincipalProgramRole.mockResolvedValue('Facilitator');
      mockListAllProgramAssessmentSubmissions.mockResolvedValue([
        assessmentSubmissions[2],
        assessmentSubmissions[11],
      ]);
      mockGetCurriculumAssessment.mockResolvedValue(curriculumAssessments[0]);

      mockPrincipalId(facilitatorPrincipalId);

      appAgent
        .get(`/program/${programAssessments[0].id}/submissions`)
        .expect(200, itemEnvelope(assessmentsWithSubmissions[1]), err => {
          expect(mockFindProgramAssessment).toHaveBeenCalledWith(
            programAssessments[0].id
          );

          expect(mockGetPrincipalProgramRole).toHaveBeenCalledWith(
            facilitatorPrincipalId,
            programAssessments[0].program_id
          );

          expect(mockListAllProgramAssessmentSubmissions).toHaveBeenCalledWith(
            programAssessments[0].id
          );

          expect(mockGetCurriculumAssessment).toHaveBeenCalledWith(
            programAssessments[0].assessment_id,
            false,
            false
          );

          done(err);
        });
    });

    it('should show a participant an AssessmentWithSubmissions with their submissions', done => {
      mockFindProgramAssessment.mockResolvedValue(programAssessments[0]);
      mockGetPrincipalProgramRole.mockResolvedValue('Participant');
      mockListParticipantProgramAssessmentSubmissions.mockResolvedValue([
        assessmentSubmissions[2],
      ]);
      mockGetCurriculumAssessment.mockResolvedValue(curriculumAssessments[0]);

      mockPrincipalId(participantPrincipalId);
      appAgent
        .get(`/program/${programAssessments[0].id}/submissions`)
        .expect(200, itemEnvelope(assessmentsWithSubmissions[0]), err => {
          expect(mockFindProgramAssessment).toHaveBeenCalledWith(
            programAssessments[0].id
          );

          expect(mockGetPrincipalProgramRole).toHaveBeenCalledWith(
            participantPrincipalId,
            programAssessments[0].program_id
          );

          expect(
            mockListParticipantProgramAssessmentSubmissions
          ).toHaveBeenCalledWith(
            participantPrincipalId,
            programAssessments[0].id
          );

          expect(mockGetCurriculumAssessment).toHaveBeenCalledWith(
            programAssessments[0].assessment_id,
            false,
            false
          );

          done(err);
        });
    });

    it('should give an UnauthorizedError to anyone not enrolled in the course', done => {
      mockFindProgramAssessment.mockResolvedValue(programAssessments[0]);
      mockGetPrincipalProgramRole.mockResolvedValue(null);

      mockPrincipalId(unenrolledPrincipalId);
      appAgent
        .get(`/program/${programAssessments[0].id}/submissions`)
        .expect(
          401,
          errorEnvelope(
            `Could not access program assessment with ID ${programAssessments[0].id} without enrollment.`
          ),
          err => {
            expect(mockFindProgramAssessment).toHaveBeenCalledWith(
              programAssessments[0].id
            );

            expect(mockGetPrincipalProgramRole).toHaveBeenCalledWith(
              unenrolledPrincipalId,
              programAssessments[0].program_id
            );

            done(err);
          }
        );
    });

    it('should give a NotFoundError for a programAssessmentId not found in the database', done => {
      mockFindProgramAssessment.mockResolvedValue(null);

      mockPrincipalId(participantPrincipalId);
      appAgent
        .get(`/program/${programAssessments[0].id}/submissions`)
        .expect(
          404,
          errorEnvelope(
            `Could not find program assessment with ID ${programAssessments[0].id}`
          ),
          err => {
            expect(mockFindProgramAssessment).toHaveBeenCalledWith(
              programAssessments[0].id
            );

            done(err);
          }
        );
    });

    it('should give a BadRequestError for an invalid programAssessmentId', done => {
      mockPrincipalId(participantPrincipalId);
      appAgent
        .get(`/program/test/submissions`)
        .expect(
          400,
          errorEnvelope(`"test" is not a valid program assessment ID.`),
          err => {
            done(err);
          }
        );
    });
  });

  describe('GET /program/:programAssessmentId/submissions/new', () => {
    it('should respond with a bad request error if given an invalid assessment id', done => {
      const programAssessmentInvalidId = 'test';
      appAgent
        .get(`/program/${programAssessmentInvalidId}/submissions/new`)
        .expect(
          400,
          errorEnvelope(
            `"${programAssessmentInvalidId}" is not a valid program assessment ID.`
          ),
          done
        );
    });

    it('should respond with a NotFoundError if the assessment submission ID was not found in the database', done => {
      mockFindProgramAssessment.mockResolvedValue(null);

      mockPrincipalId(participantPrincipalId);

      appAgent
        .get(`/program/${programAssessments[0].id}/submissions/new`)
        .expect(
          404,
          errorEnvelope(
            `Could not find program assessment with ID ${programAssessments[0].id}.`
          ),
          err => {
            expect(mockFindProgramAssessment).toHaveBeenCalledWith(
              programAssessments[0].id
            );
            done(err);
          }
        );
    });

    it('should return an error when attempting to create a submission for a program assessment that is not yet available', done => {
      mockFindProgramAssessment.mockResolvedValue(programAssessments[2]);

      mockPrincipalId(participantPrincipalId);

      appAgent
        .get(`/program/${programAssessments[2].id}/submissions/new`)
        .expect(
          403,
          errorEnvelope(
            `Could not create a new submission of an assessment that's not yet available.`
          ),
          err => {
            expect(mockFindProgramAssessment).toHaveBeenCalledWith(
              programAssessments[2].id
            );
            done(err);
          }
        );
    });

    it('should return an error when attempting to create a submission when the program assessment due date has passed', done => {
      mockFindProgramAssessment.mockResolvedValue(programAssessments[1]);

      mockPrincipalId(participantPrincipalId);

      appAgent
        .get(`/program/${programAssessments[1].id}/submissions/new`)
        .expect(
          403,
          errorEnvelope(
            `Could not create a new submission of an assessment after its due date.`
          ),
          err => {
            expect(mockFindProgramAssessment).toHaveBeenCalledWith(
              programAssessments[1].id
            );
            done(err);
          }
        );
    });

    it('should return an error if logged-in user is not enrolled in the program', done => {
      mockFindProgramAssessment.mockResolvedValue(programAssessments[0]);
      mockGetPrincipalProgramRole.mockResolvedValue(null);

      mockPrincipalId(unenrolledPrincipalId);

      appAgent
        .get(`/program/${programAssessments[0].id}/submissions/new`)
        .expect(
          401,
          errorEnvelope(
            `Could not access program assessment with ID ${programAssessments[0].id}) without enrollment.`
          ),
          err => {
            expect(mockFindProgramAssessment).toHaveBeenCalledWith(
              programAssessments[0].id
            );

            expect(mockGetPrincipalProgramRole).toHaveBeenCalledWith(
              unenrolledPrincipalId,
              programAssessments[0].program_id
            );

            done(err);
          }
        );
    });

    it('should return an error if logged-in user is a facilitator', done => {
      mockFindProgramAssessment.mockResolvedValue(programAssessments[0]);
      mockGetPrincipalProgramRole.mockResolvedValue('Facilitator');

      mockPrincipalId(facilitatorPrincipalId);

      appAgent
        .get(`/program/${programAssessments[0].id}/submissions/new`)
        .expect(
          401,
          errorEnvelope(
            `Facilitators are not allowed to create program assessment submissions.`
          ),
          err => {
            expect(mockFindProgramAssessment).toHaveBeenCalledWith(
              programAssessments[0].id
            );

            expect(mockGetPrincipalProgramRole).toHaveBeenCalledWith(
              facilitatorPrincipalId,
              programAssessments[0].program_id
            );

            done(err);
          }
        );
    });

    it('should return an error if no possible submissions remain for this participant and this assessment', done => {
      mockFindProgramAssessment.mockResolvedValue(programAssessments[0]);
      mockGetPrincipalProgramRole.mockResolvedValue('Participant');
      mockGetCurriculumAssessment.mockResolvedValue(curriculumAssessments[1]);
      mockListParticipantProgramAssessmentSubmissions.mockResolvedValue([
        assessmentSubmissions[11],
      ]);

      mockPrincipalId(otherParticipantPrincipalId);

      appAgent
        .get(`/program/${programAssessments[0].id}/submissions/new`)
        .expect(
          403,
          errorEnvelope(
            `Could not create a new submission as you have reached the maximum number of submissions for this assessment.`
          ),
          err => {
            expect(mockFindProgramAssessment).toHaveBeenCalledWith(
              programAssessments[0].id
            );

            expect(mockGetPrincipalProgramRole).toHaveBeenCalledWith(
              otherParticipantPrincipalId,
              programAssessments[0].program_id
            );

            expect(mockGetCurriculumAssessment).toHaveBeenCalledWith(
              programAssessments[0].assessment_id,
              true,
              false
            );

            expect(
              mockListParticipantProgramAssessmentSubmissions
            ).toHaveBeenCalledWith(
              otherParticipantPrincipalId,
              programAssessments[0].id
            );

            done(err);
          }
        );
    });

    it('should return the existing submission if one is currently opened or in progress', done => {
      mockFindProgramAssessment.mockResolvedValue(programAssessments[0]);
      mockGetPrincipalProgramRole.mockResolvedValue('Participant');
      mockGetCurriculumAssessment.mockResolvedValue(curriculumAssessments[1]);
      mockListParticipantProgramAssessmentSubmissions.mockResolvedValue([
        assessmentSubmissions[0],
      ]);
      mockGetAssessmentSubmission.mockResolvedValue(assessmentSubmissions[0]);

      mockPrincipalId(participantPrincipalId);

      appAgent
        .get(`/program/${programAssessments[0].id}/submissions/new`)
        .expect(200, itemEnvelope(savedAssessments[0]), err => {
          expect(mockFindProgramAssessment).toHaveBeenCalledWith(
            programAssessments[0].id
          );

          expect(mockGetPrincipalProgramRole).toHaveBeenCalledWith(
            participantPrincipalId,
            programAssessments[0].program_id
          );

          expect(mockGetCurriculumAssessment).toHaveBeenCalledWith(
            programAssessments[0].assessment_id,
            true,
            false
          );

          expect(
            mockListParticipantProgramAssessmentSubmissions
          ).toHaveBeenCalledWith(
            participantPrincipalId,
            programAssessments[0].id
          );

          expect(mockGetAssessmentSubmission).toHaveBeenCalledWith(
            assessmentSubmissions[2].id,
            true,
            false
          );

          done(err);
        });
    });

    it('should return a participant a new submission without including the correct answers', done => {
      mockFindProgramAssessment.mockResolvedValue(programAssessments[0]);
      mockGetPrincipalProgramRole.mockResolvedValue('Participant');
      mockGetCurriculumAssessment.mockResolvedValue(curriculumAssessments[1]);
      mockListParticipantProgramAssessmentSubmissions.mockResolvedValue(null);
      mockCreateAssessmentSubmission.mockResolvedValue(
        assessmentSubmissions[0]
      );

      mockPrincipalId(participantPrincipalId);

      appAgent
        .get(`/program/${programAssessments[0].id}/submissions/new`)
        .expect(201, itemEnvelope(savedAssessments[0]), err => {
          expect(mockFindProgramAssessment).toHaveBeenCalledWith(
            programAssessments[0].id
          );

          expect(mockGetPrincipalProgramRole).toHaveBeenCalledWith(
            participantPrincipalId,
            programAssessments[0].program_id
          );

          expect(mockGetCurriculumAssessment).toHaveBeenCalledWith(
            programAssessments[0].assessment_id,
            true,
            false
          );

          expect(
            mockListParticipantProgramAssessmentSubmissions
          ).toHaveBeenCalledWith(
            participantPrincipalId,
            programAssessments[0].id
          );

          expect(mockCreateAssessmentSubmission).toHaveBeenCalledWith(
            participantPrincipalId,
            programAssessments[0].id,
            programAssessments[0].assessment_id
          );

          done(err);
        });
    });

    it('should return a participant a new submission without including the correct answers, even if a prior submitted submission exists', done => {
      mockFindProgramAssessment.mockResolvedValue(programAssessments[0]);
      mockGetPrincipalProgramRole.mockResolvedValue('Participant');
      mockGetCurriculumAssessment.mockResolvedValue(curriculumAssessments[2]);
      mockListParticipantProgramAssessmentSubmissions.mockResolvedValue([
        assessmentSubmissions[9],
      ]);
      mockCreateAssessmentSubmission.mockResolvedValue(
        assessmentSubmissions[0]
      );

      mockPrincipalId(participantPrincipalId);

      appAgent
        .get(`/program/${programAssessments[0].id}/submissions/new`)
        .expect(201, itemEnvelope(savedAssessments[1]), err => {
          expect(mockFindProgramAssessment).toHaveBeenCalledWith(
            programAssessments[0].id
          );

          expect(mockGetPrincipalProgramRole).toHaveBeenCalledWith(
            participantPrincipalId,
            programAssessments[0].program_id
          );

          expect(mockGetCurriculumAssessment).toHaveBeenCalledWith(
            programAssessments[0].assessment_id,
            true,
            false
          );

          expect(
            mockListParticipantProgramAssessmentSubmissions
          ).toHaveBeenCalledWith(
            participantPrincipalId,
            programAssessments[0].id
          );

          expect(mockCreateAssessmentSubmission).toHaveBeenCalledWith(
            participantPrincipalId,
            programAssessments[0].id,
            programAssessments[0].assessment_id
          );

          done(err);
        });
    });
  });

  describe('GET /submissions/:submissionId', () => {
    it("should show a facilitator the full submission information for a participant's ungraded submitted assessment, including the correct answers", done => {
      const facilitatorFullResponse: SavedAssessment = {
        curriculum_assessment: curriculumAssessments[3],
        program_assessment: programAssessments[0],
        principal_program_role: 'Facilitator',
        submission: assessmentSubmissions[9],
      };

      mockGetAssessmentSubmission.mockResolvedValue(assessmentSubmissions[9]);
      mockFindProgramAssessment.mockResolvedValue(programAssessments[0]);
      mockGetPrincipalProgramRole.mockResolvedValue('Facilitator');
      mockGetCurriculumAssessment.mockResolvedValue(curriculumAssessments[3]);

      mockPrincipalId(facilitatorPrincipalId);

      appAgent
        .get(`/submissions/${assessmentSubmissions[9].id}`)
        .expect(200, itemEnvelope(facilitatorFullResponse), err => {
          expect(mockGetAssessmentSubmission).toHaveBeenCalledWith(
            assessmentSubmissions[9].id,
            true
          );

          expect(mockFindProgramAssessment).toHaveBeenCalledWith(
            programAssessments[0].id
          );

          expect(mockGetPrincipalProgramRole).toHaveBeenCalledWith(
            facilitatorPrincipalId,
            programAssessments[0].program_id
          );

          expect(mockGetCurriculumAssessment).toHaveBeenCalledWith(
            programAssessments[0].assessment_id,
            true,
            true
          );

          done(err);
        });
    });

    it('should show a participant their submission information for an in-progress assessment without including the correct answers', done => {
      const participantInProgressAssessmentSubmission: SavedAssessment = {
        curriculum_assessment: curriculumAssessments[1],
        program_assessment: programAssessments[0],
        principal_program_role: 'Participant',
        submission: assessmentSubmissions[2],
      };

      mockGetAssessmentSubmission.mockResolvedValue(assessmentSubmissions[2]);
      mockFindProgramAssessment.mockResolvedValue(programAssessments[0]);
      mockGetPrincipalProgramRole.mockResolvedValue('Participant');
      mockGetCurriculumAssessment.mockResolvedValue(curriculumAssessments[1]);

      mockPrincipalId(participantPrincipalId);

      appAgent
        .get(`/submissions/${assessmentSubmissions[2].id}`)
        .expect(
          200,
          itemEnvelope(participantInProgressAssessmentSubmission),
          err => {
            expect(mockGetAssessmentSubmission).toHaveBeenCalledWith(
              assessmentSubmissions[2].id,
              true
            );

            expect(mockFindProgramAssessment).toHaveBeenCalledWith(
              programAssessments[0].id
            );

            expect(mockGetPrincipalProgramRole).toHaveBeenCalledWith(
              participantPrincipalId,
              programAssessments[0].program_id
            );

            expect(mockGetCurriculumAssessment).toHaveBeenCalledWith(
              programAssessments[0].assessment_id,
              true,
              false
            );

            done(err);
          }
        );
    });

    it('should show a participant their submission information for an ungraded submitted assessment without including the correct answers', done => {
      const participantSubmittedAssessmentSubmission: SavedAssessment = {
        curriculum_assessment: curriculumAssessments[1],
        program_assessment: programAssessments[0],
        principal_program_role: 'Participant',
        submission: assessmentSubmissions[9],
      };

      mockGetAssessmentSubmission.mockResolvedValue(assessmentSubmissions[9]);
      mockFindProgramAssessment.mockResolvedValue(programAssessments[0]);
      mockGetPrincipalProgramRole.mockResolvedValue('Participant');
      mockGetCurriculumAssessment.mockResolvedValue(curriculumAssessments[1]);

      mockPrincipalId(participantPrincipalId);

      appAgent
        .get(`/submissions/${assessmentSubmissions[9].id}`)
        .expect(
          200,
          itemEnvelope(participantSubmittedAssessmentSubmission),
          err => {
            expect(mockGetAssessmentSubmission).toHaveBeenCalledWith(
              assessmentSubmissions[9].id,
              true
            );

            expect(mockFindProgramAssessment).toHaveBeenCalledWith(
              programAssessments[0].id
            );

            expect(mockGetPrincipalProgramRole).toHaveBeenCalledWith(
              participantPrincipalId,
              programAssessments[0].program_id
            );

            expect(mockGetCurriculumAssessment).toHaveBeenCalledWith(
              programAssessments[0].assessment_id,
              true,
              false
            );

            done(err);
          }
        );
    });

    it('should show a participant their submission information for a graded submitted assessment including the correct answers', done => {
      const participantGradedAssessmentSubmission: SavedAssessment = {
        curriculum_assessment: curriculumAssessments[3],
        program_assessment: programAssessments[0],
        principal_program_role: 'Participant',
        submission: assessmentSubmissions[13],
      };

      mockGetAssessmentSubmission.mockResolvedValue(assessmentSubmissions[13]);
      mockFindProgramAssessment.mockResolvedValue(programAssessments[0]);
      mockGetPrincipalProgramRole.mockResolvedValue('Participant');
      mockGetCurriculumAssessment.mockResolvedValue(curriculumAssessments[3]);

      mockPrincipalId(participantPrincipalId);

      appAgent
        .get(`/submissions/${assessmentSubmissions[13].id}`)
        .expect(
          200,
          itemEnvelope(participantGradedAssessmentSubmission),
          err => {
            expect(mockGetAssessmentSubmission).toHaveBeenCalledWith(
              assessmentSubmissions[13].id,
              true
            );

            expect(mockFindProgramAssessment).toHaveBeenCalledWith(
              programAssessments[0].id
            );

            expect(mockGetPrincipalProgramRole).toHaveBeenCalledWith(
              participantPrincipalId,
              programAssessments[0].program_id
            );

            expect(mockGetCurriculumAssessment).toHaveBeenCalledWith(
              programAssessments[0].assessment_id,
              true,
              true
            );

            done(err);
          }
        );
    });

    it('should respond with a BadRequestError if given an invalid submission ID', done => {
      const submissionId = 'test';

      appAgent
        .get(`/submissions/${submissionId}`)
        .expect(
          400,
          errorEnvelope(
            `"${Number(submissionId)}" is not a valid submission ID.`
          ),
          done
        );
    });

    it('should respond with a NotFoundError if the submission id was not found in the database ', done => {
      const submissionId = 8;
      mockGetAssessmentSubmission.mockResolvedValue(null);

      mockPrincipalId(participantPrincipalId);

      appAgent
        .get(`/submissions/${submissionId}`)
        .expect(
          404,
          errorEnvelope(`Could not find submission with ID ${submissionId}.`),
          err => {
            expect(mockGetAssessmentSubmission).toHaveBeenCalledWith(
              submissionId,
              true
            );

            done(err);
          }
        );
    });

    it('should respond with an Unauthorized Error if the logged-in principal id is not the same as the principal id of the submission id and is not the principal id of the program facilitator', done => {
      mockGetAssessmentSubmission.mockResolvedValue(assessmentSubmissions[9]);
      mockFindProgramAssessment.mockResolvedValue(programAssessments[0]);
      mockGetPrincipalProgramRole.mockResolvedValue('Participant');

      mockPrincipalId(otherParticipantPrincipalId);

      appAgent
        .get(`/submissions/${assessmentSubmissions[9].id}`)
        .expect(
          401,
          errorEnvelope(
            `Could not access submission with ID ${assessmentSubmissions[9].id}.`
          ),
          err => {
            expect(mockGetAssessmentSubmission).toHaveBeenCalledWith(
              assessmentSubmissions[9].id,
              true
            );

            expect(mockFindProgramAssessment).toHaveBeenCalledWith(
              programAssessments[0].id
            );

            expect(mockGetPrincipalProgramRole).toHaveBeenCalledWith(
              otherParticipantPrincipalId,
              programAssessments[0].program_id
            );

            done(err);
          }
        );
    });

    it('should respond with an Unauthorized Error if logged-in principal id is not enrolled in the program', done => {
      const programId = 12;
      mockGetAssessmentSubmission.mockResolvedValue(assessmentSubmissions[9]);
      mockFindProgramAssessment.mockResolvedValue(programAssessments[0]);
      mockGetPrincipalProgramRole.mockResolvedValue(null);

      mockPrincipalId(participantPrincipalId);

      appAgent
        .get(`/submissions/${assessmentSubmissions[9].id}`)
        .expect(
          401,
          errorEnvelope(
            `Could not access submission with ID ${assessmentSubmissions[9].id}.`
          ),
          err => {
            expect(mockGetAssessmentSubmission).toHaveBeenCalledWith(
              assessmentSubmissions[9].id,
              true
            );
            expect(mockFindProgramAssessment).toHaveBeenCalledWith(
              programAssessments[0].id
            );

            expect(mockGetPrincipalProgramRole).toHaveBeenCalledWith(
              participantPrincipalId,
              programId
            );
            done(err);
          }
        );
    });

    it('should respond with an internal server error if a database error occurs', done => {
      const submissionId = 10;
      mockGetAssessmentSubmission.mockRejectedValue(new Error());
      appAgent.get(`/submissions/${submissionId}`).expect(500, done);
    });
  });

  describe('PUT /submissions/:submissionId', () => {
    it('should update submission if the logged-in principal ID is the program facilitator', done => {
      mockGetAssessmentSubmission.mockResolvedValue(assessmentSubmissions[9]);
      mockFindProgramAssessment.mockResolvedValue(programAssessments[0]);
      mockGetPrincipalProgramRole.mockResolvedValue('Facilitator');
      mockUpdateAssessmentSubmission.mockResolvedValue(
        assessmentSubmissions[17]
      );

      mockPrincipalId(facilitatorPrincipalId);

      appAgent
        .put(`/submissions/${assessmentSubmissions[9].id}`)
        .send(assessmentSubmissions[17])
        .expect(200, itemEnvelope(assessmentSubmissions[17]), err => {
          expect(mockGetAssessmentSubmission).toHaveBeenCalledWith(
            assessmentSubmissions[9].id,
            true
          );

          expect(mockFindProgramAssessment).toHaveBeenCalledWith(
            assessmentSubmissions[17].assessment_id
          );

          expect(mockGetPrincipalProgramRole).toHaveBeenCalledWith(
            facilitatorPrincipalId,
            programAssessments[0].program_id
          );

          expect(mockUpdateAssessmentSubmission).toHaveBeenCalledWith(
            assessmentSubmissions[17],
            true
          );

          done(err);
        });
    });

    it('should update submission if the logged-in principal ID is the program participant', done => {
      mockGetAssessmentSubmission.mockResolvedValue(assessmentSubmissions[2]);
      mockFindProgramAssessment.mockResolvedValue(programAssessments[0]);
      mockGetPrincipalProgramRole.mockResolvedValue('Participant');
      mockUpdateAssessmentSubmission.mockResolvedValue(
        assessmentSubmissions[2]
      );

      mockPrincipalId(participantPrincipalId);

      appAgent
        .put(`/submissions/${assessmentSubmissions[2].id}`)
        .send(assessmentSubmissions[2])
        .expect(200, itemEnvelope(assessmentSubmissions[2]), err => {
          expect(mockGetAssessmentSubmission).toHaveBeenCalledWith(
            assessmentSubmissions[2].id,
            true
          );

          expect(mockFindProgramAssessment).toHaveBeenCalledWith(
            assessmentSubmissions[2].assessment_id
          );

          expect(mockGetPrincipalProgramRole).toHaveBeenCalledWith(
            participantPrincipalId,
            programAssessments[0].program_id
          );

          expect(mockUpdateAssessmentSubmission).toHaveBeenCalledWith(
            assessmentSubmissions[2],
            false
          );

          done(err);
        });
    });

    it('should do nothing if the logged-in principal ID is the program participant and the assessment was already submitted', done => {
      mockGetAssessmentSubmission.mockResolvedValue(assessmentSubmissions[9]);
      mockFindProgramAssessment.mockResolvedValue(programAssessments[0]);
      mockGetPrincipalProgramRole.mockResolvedValue('Participant');

      mockPrincipalId(participantPrincipalId);

      appAgent
        .put(`/submissions/${assessmentSubmissions[9].id}`)
        .send(assessmentSubmissions[9])
        .expect(200, itemEnvelope(assessmentSubmissions[9]), err => {
          expect(mockGetAssessmentSubmission).toHaveBeenCalledWith(
            assessmentSubmissions[9].id,
            true
          );

          expect(mockFindProgramAssessment).toHaveBeenCalledWith(
            assessmentSubmissions[9].assessment_id
          );

          expect(mockGetPrincipalProgramRole).toHaveBeenCalledWith(
            participantPrincipalId,
            programAssessments[0].program_id
          );

          expect(mockGetAssessmentSubmission).toHaveBeenCalledWith(
            assessmentSubmissions[9].id,
            true,
            false
          );

          done(err);
        });
    });

    it('should respond with a BadRequestError if given an invalid submission ID', done => {
      const submissionId = 'test';

      appAgent
        .put(`/submissions/${submissionId}`)
        .send(assessmentResponsesRows[7])
        .expect(
          400,
          errorEnvelope(
            `"${Number(submissionId)}" is not a valid submission ID.`
          ),
          done
        );
    });

    it('should respond with a ValidationError if given an invalid AssessmentSubmission', done => {
      mockPrincipalId(participantPrincipalId);

      appAgent
        .put(`/submissions/${assessmentSubmissions[9].id}`)
        .send({ test: 'Hello' })
        .expect(
          422,
          errorEnvelope(`Was not given a valid assessment submission.`),
          done
        );
    });

    it('should respond with a NotFoundError if the submission id was not found in the database', done => {
      mockGetAssessmentSubmission.mockResolvedValue(null);

      mockPrincipalId(participantPrincipalId);

      appAgent
        .put(`/submissions/${assessmentSubmissionId}`)
        .send(assessmentSubmissions[13])
        .expect(
          404,
          errorEnvelope(
            `Could not find submission with ID ${assessmentSubmissionId}.`
          ),
          err => {
            expect(mockGetAssessmentSubmission).toHaveBeenCalledWith(
              assessmentSubmissionId,
              true
            );

            done(err);
          }
        );
    });

    it('should respond with an Unauthorized Error if user is not a member of the program of the submission', done => {
      mockGetAssessmentSubmission.mockResolvedValue(assessmentSubmissions[9]);
      mockFindProgramAssessment.mockResolvedValue(programAssessments[0]);
      mockGetPrincipalProgramRole.mockResolvedValue(null);

      mockPrincipalId(participantPrincipalId);

      appAgent
        .put(`/submissions/${assessmentSubmissions[9].id}`)
        .send(assessmentSubmissions[13])
        .expect(
          401,
          errorEnvelope(
            `Could not access the assessment and submssion without enrollment in the program or being a facilitator.`
          ),
          err => {
            expect(mockGetAssessmentSubmission).toHaveBeenCalledWith(
              assessmentSubmissions[9].id,
              true
            );
            expect(mockFindProgramAssessment).toHaveBeenCalledWith(
              programAssessments[0].id
            );

            expect(mockGetPrincipalProgramRole).toHaveBeenCalledWith(
              participantPrincipalId,
              programAssessments[0].program_id
            );
            done(err);
          }
        );
    });

    it('should respond with an Unauthorized Error if user is participant but not the owner of the submission', done => {
      mockGetAssessmentSubmission.mockResolvedValue(assessmentSubmissions[9]);
      mockFindProgramAssessment.mockResolvedValue(programAssessments[0]);
      mockGetPrincipalProgramRole.mockResolvedValue('Participant');

      mockPrincipalId(otherParticipantPrincipalId);

      appAgent
        .put(`/submissions/${assessmentSubmissions[9].id}`)
        .send(assessmentSubmissions[13])
        .expect(
          401,
          errorEnvelope(
            `You may not update an assessment that is not your own.`
          ),
          err => {
            expect(mockGetAssessmentSubmission).toHaveBeenCalledWith(
              assessmentSubmissions[9].id,
              true
            );
            expect(mockFindProgramAssessment).toHaveBeenCalledWith(
              programAssessments[0].id
            );

            expect(mockGetPrincipalProgramRole).toHaveBeenCalledWith(
              otherParticipantPrincipalId,
              programAssessments[0].program_id
            );
            done(err);
          }
        );
    });

    it('should respond with a BadRequestError if submssion id from param is not the same from request body.', done => {
      mockPrincipalId(participantPrincipalId);

      appAgent
        .put(`/submissions/${assessmentSubmissionId}`)
        .send(assessmentSubmissions[19])
        .expect(
          400,
          errorEnvelope(
            `The submission id in the parameter(${assessmentSubmissionId}) is not the same id as in the request body (${assessmentSubmissions[19].id}).`
          ),
          err => {
            done(err);
          }
        );
    });

    it('should respond with an internal server error if a database error occurs', done => {
      mockGetAssessmentSubmission.mockRejectedValue(new Error());
      appAgent
        .put(`/submissions/${assessmentSubmissionId}`)
        .send(assessmentSubmissions[13])
        .expect(500, done);
    });
  });
});
