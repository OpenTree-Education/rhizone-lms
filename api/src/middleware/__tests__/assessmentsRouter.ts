import {
  collectionEnvelope,
  errorEnvelope,
  itemEnvelope,
} from '../responseEnvelope';
import { createAppAgentForRouter, mockPrincipalId } from '../routerTestUtils';

import {
  Answer,
  AssessmentDetails,
  AssessmentResponse,
  AssessmentSubmission,
  AssessmentWithSubmissions,
  AssessmentWithSummary,
  CurriculumAssessment,
  FacilitatorAssessmentSubmissionsSummary,
  ParticipantAssessmentSubmissionsSummary,
  ProgramAssessment,
  Question,
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
          curriculum_assessment: exampleCurriculumAssessment,
          program_assessment: exampleProgramAssessment,
          participant_submissions_summary:
            exampleParticipantAssessmentSubmissionsSummary,
          principal_program_role: 'Participant',
        },
      ];
      mockListPrincipalEnrolledProgramIds.mockResolvedValue([
        exampleProgramAssessment.program_id,
      ]);
      mockGetPrincipalProgramRole.mockResolvedValue('Participant');
      mockListProgramAssessments.mockResolvedValue([exampleProgramAssessment]);
      mockGetCurriculumAssessment.mockResolvedValue(
        exampleCurriculumAssessment
      );
      mockConstructParticipantAssessmentSummary.mockResolvedValue(
        exampleParticipantAssessmentSubmissionsSummary
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
              exampleProgramAssessment.program_id
            );
            expect(mockListProgramAssessments).toHaveBeenCalledWith(
              exampleProgramAssessment.program_id
            );
            expect(mockGetCurriculumAssessment).toHaveBeenCalledWith(
              exampleProgramAssessment.assessment_id,
              false,
              false
            );
            expect(
              mockConstructParticipantAssessmentSummary
            ).toHaveBeenCalledWith(
              participantPrincipalId,
              exampleProgramAssessment
            );
            done(err);
          }
        );
    });

    it('should respond with a list of all assessments (without questions) for facilitator of one program', done => {
      const facilitatorAssessmentListResponse: AssessmentWithSummary[] = [
        {
          curriculum_assessment: exampleCurriculumAssessment,
          program_assessment: exampleProgramAssessment,
          facilitator_submissions_summary:
            exampleFacilitatorAssessmentSubmissionsSummary,
          principal_program_role: 'Facilitator',
        },
      ];
      mockListPrincipalEnrolledProgramIds.mockResolvedValue([
        exampleProgramAssessment.program_id,
      ]);
      mockGetPrincipalProgramRole.mockResolvedValue('Facilitator');
      mockListProgramAssessments.mockResolvedValue([exampleProgramAssessment]);
      mockGetCurriculumAssessment.mockResolvedValue(
        exampleCurriculumAssessment
      );
      mockConstructFacilitatorAssessmentSummary.mockResolvedValue(
        exampleFacilitatorAssessmentSubmissionsSummary
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
              exampleProgramAssessment.program_id
            );
            expect(mockListProgramAssessments).toBeCalledWith(
              exampleProgramAssessment.program_id
            );
            expect(mockGetCurriculumAssessment).toHaveBeenCalledWith(
              exampleProgramAssessment.assessment_id,
              false,
              false
            );
            expect(
              mockConstructFacilitatorAssessmentSummary
            ).toHaveBeenCalledWith(exampleProgramAssessment);
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
      mockGetCurriculumAssessment.mockResolvedValue(
        exampleCurriculumAssessmentWithSCCorrectAnswers
      );
      mockFacilitatorProgramIdsMatchingCurriculum.mockResolvedValue([
        exampleProgramAssessment.program_id,
      ]);

      mockPrincipalId(facilitatorPrincipalId);

      appAgent
        .get(
          `/curriculum/${exampleCurriculumAssessmentWithSCCorrectAnswers.id}`
        )
        .expect(
          200,
          itemEnvelope(exampleCurriculumAssessmentWithSCCorrectAnswers),
          err => {
            expect(mockGetCurriculumAssessment).toHaveBeenCalledWith(
              exampleCurriculumAssessmentWithSCCorrectAnswers.id,
              true,
              true
            );
            expect(
              mockFacilitatorProgramIdsMatchingCurriculum
            ).toHaveBeenCalledWith(
              facilitatorPrincipalId,
              exampleCurriculumAssessmentWithSCCorrectAnswers.curriculum_id
            );

            done(err);
          }
        );
    });

    it('should respond with an UnauthorizedError if the logged-in principal ID is not the program facilitator', done => {
      mockGetCurriculumAssessment.mockResolvedValue(
        exampleCurriculumAssessmentWithSCCorrectAnswers
      );
      mockFacilitatorProgramIdsMatchingCurriculum.mockResolvedValue([]);

      mockPrincipalId(participantPrincipalId);

      appAgent
        .get(
          `/curriculum/${exampleCurriculumAssessmentWithSCCorrectAnswers.id}`
        )
        .expect(
          401,
          errorEnvelope(
            `Not allowed to access curriculum assessment with ID ${exampleCurriculumAssessmentWithSCCorrectAnswers.id}.`
          ),
          err => {
            expect(mockGetCurriculumAssessment).toHaveBeenCalledWith(
              exampleCurriculumAssessmentWithSCCorrectAnswers.id,
              true,
              true
            );
            expect(
              mockFacilitatorProgramIdsMatchingCurriculum
            ).toHaveBeenCalledWith(
              participantPrincipalId,
              exampleCurriculumAssessmentWithSCCorrectAnswers.curriculum_id
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
        .get(
          `/curriculum/${exampleCurriculumAssessmentWithSCCorrectAnswers.id}`
        )
        .expect(
          404,
          errorEnvelope(
            `Could not find curriculum assessment with ID ${exampleCurriculumAssessmentWithSCCorrectAnswers.id}.`
          ),
          err => {
            expect(mockGetCurriculumAssessment).toHaveBeenCalledWith(
              exampleCurriculumAssessmentWithSCCorrectAnswers.id,
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
        sentNewCurriculumAssessmentPostInsert
      );
      mockPrincipalId(facilitatorPrincipalId);

      appAgent
        .post(`/curriculum`)
        .send(sentNewCurriculumAssessment)
        .expect(201, err => {
          expect(
            mockFacilitatorProgramIdsMatchingCurriculum
          ).toHaveBeenCalledWith(
            facilitatorPrincipalId,
            sentNewCurriculumAssessment.curriculum_id
          );
          expect(mockCreateCurriculumAssessment).toHaveBeenCalledWith(
            sentNewCurriculumAssessment
          );

          done(err);
        });
    });

    it('should respond with an Unauthorized Error if the logged-in principal id is not the facilitator', done => {
      mockFacilitatorProgramIdsMatchingCurriculum.mockResolvedValue([]);
      mockPrincipalId(participantPrincipalId);

      appAgent
        .post(`/curriculum`)
        .send(sentNewCurriculumAssessment)
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
              sentNewCurriculumAssessment.curriculum_id
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
      mockGetCurriculumAssessment.mockResolvedValue(
        exampleCurriculumAssessmentWithSCCorrectAnswers
      );
      mockFacilitatorProgramIdsMatchingCurriculum.mockResolvedValue(
        facilitatorProgramIdsThatMatchCurriculum
      );
      mockUpdateCurriculumAssessment.mockResolvedValue(
        sentUpdatedCurriculumAssessment
      );

      mockPrincipalId(facilitatorPrincipalId);

      appAgent
        .put(`/curriculum/${exampleCurriculumAssessment.id}`)
        .send(sentUpdatedCurriculumAssessment)
        .expect(201, itemEnvelope(sentUpdatedCurriculumAssessment), err => {
          expect(mockGetCurriculumAssessment).toHaveBeenCalledWith(
            exampleCurriculumAssessment.id
          );
          expect(
            mockFacilitatorProgramIdsMatchingCurriculum
          ).toHaveBeenCalledWith(facilitatorPrincipalId, curriculumId);
          expect(mockUpdateCurriculumAssessment).toHaveBeenCalledWith(
            sentUpdatedCurriculumAssessment
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
        .put(`/curriculum/${exampleCurriculumAssessment.id}`)
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
        .put(`/curriculum/${exampleCurriculumAssessment.id}`)
        .send(sentUpdatedCurriculumAssessment)
        .expect(
          404,
          errorEnvelope(
            `Could not find curriculum assessment with ID ${exampleCurriculumAssessment.id}.`
          ),
          err => {
            expect(mockGetCurriculumAssessment).toHaveBeenCalledWith(
              exampleCurriculumAssessment.id
            );

            done(err);
          }
        );
    });

    it('should respond with an Unauthorized Error if the the facilitator is not taking the program with the curriculum', done => {
      mockGetCurriculumAssessment.mockResolvedValue(
        exampleCurriculumAssessment
      );
      mockFacilitatorProgramIdsMatchingCurriculum.mockResolvedValue([]);

      mockPrincipalId(participantPrincipalId);

      appAgent
        .put(`/curriculum/${exampleCurriculumAssessment.id}`)
        .send(sentUpdatedCurriculumAssessment)
        .expect(
          401,
          errorEnvelope(
            `Not allowed to make modifications to curriculum assessment with ID ${exampleCurriculumAssessment.id}.`
          ),
          err => {
            expect(mockGetCurriculumAssessment).toHaveBeenCalledWith(
              exampleCurriculumAssessment.id
            );

            expect(
              mockFacilitatorProgramIdsMatchingCurriculum
            ).toHaveBeenCalledWith(participantPrincipalId, curriculumId);

            done(err);
          }
        );
    });

    it('should respond with InternalServerError if curriculum assessment with given ID could not be updated', done => {
      mockGetCurriculumAssessment.mockResolvedValue(
        exampleCurriculumAssessmentWithSCCorrectAnswers
      );
      mockFacilitatorProgramIdsMatchingCurriculum.mockResolvedValue(
        facilitatorProgramIdsThatMatchCurriculum
      );
      mockUpdateCurriculumAssessment.mockResolvedValue(null);

      mockPrincipalId(facilitatorPrincipalId);

      appAgent
        .put(`/curriculum/${exampleCurriculumAssessment.id}`)
        .send(sentUpdatedCurriculumAssessment)

        .expect(
          500,
          errorEnvelope(
            `Could not update curriculum assessment with ID ${exampleCurriculumAssessment.id}.`
          ),
          err => {
            expect(mockGetCurriculumAssessment).toHaveBeenCalledWith(
              exampleCurriculumAssessment.id
            );
            expect(
              mockFacilitatorProgramIdsMatchingCurriculum
            ).toHaveBeenCalledWith(facilitatorPrincipalId, curriculumId);
            expect(mockUpdateCurriculumAssessment).toHaveBeenCalledWith(
              sentUpdatedCurriculumAssessment
            );
            done(err);
          }
        );
    });
  });

  describe('DELETE /curriculum/:curriculumAssessmentId', () => {
    it('should delete a curriculumAssessment if principal ID is a program facilitator of that curriculum', done => {
      mockGetCurriculumAssessment.mockResolvedValue(
        exampleCurriculumAssessment
      );

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
            exampleCurriculumAssessment.id
          );

          done(err);
        });
    });

    it('should respond with an Unauthorized Error if the the facilitator is not taking the program with the curriculum', done => {
      mockGetCurriculumAssessment.mockResolvedValue(
        exampleCurriculumAssessment
      );
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
      mockGetCurriculumAssessment.mockResolvedValue(
        exampleCurriculumAssessment
      );
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
              exampleCurriculumAssessment.id
            );

            done(err);
          }
        );
    });
  });

  describe('GET /program/:programAssessmentId', () => {
    it('should get a program assessment if the logged-in principal ID is the program facilitator', done => {
      mockFindProgramAssessment.mockResolvedValue(exampleProgramAssessment);
      mockGetPrincipalProgramRole.mockResolvedValue('Facilitator');
      mockGetCurriculumAssessment.mockResolvedValue(
        exampleCurriculumAssessmentWithSCCorrectAnswers
      );

      mockPrincipalId(facilitatorPrincipalId);

      appAgent
        .get(`/program/${exampleProgramAssessment.id}`)
        .expect(
          200,
          itemEnvelope(exampleAssessmentWithSCCorrectAnswersDetails),
          err => {
            expect(mockFindProgramAssessment).toHaveBeenCalledWith(
              exampleProgramAssessment.id
            );

            expect(mockGetPrincipalProgramRole).toHaveBeenCalledWith(
              facilitatorPrincipalId,
              exampleProgramAssessment.program_id
            );
            expect(mockGetCurriculumAssessment).toHaveBeenCalledWith(
              exampleProgramAssessment.assessment_id,
              true,
              true
            );

            done(err);
          }
        );
    });

    it('should respond with an Unauthorized Error if the logged-in principal id is not the facilitator', done => {
      mockFindProgramAssessment.mockResolvedValue(exampleProgramAssessment);
      mockGetPrincipalProgramRole.mockResolvedValue(null);

      mockPrincipalId(otherParticipantPrincipalId);

      appAgent
        .get(`/program/${exampleProgramAssessment.id}`)
        .expect(
          401,
          errorEnvelope(
            `Could not access assessment with Program Assessment ID ${exampleProgramAssessment.id}.`
          ),
          err => {
            expect(mockFindProgramAssessment).toHaveBeenCalledWith(
              exampleProgramAssessment.id
            );

            expect(mockGetPrincipalProgramRole).toHaveBeenCalledWith(
              otherParticipantPrincipalId,
              exampleProgramAssessment.program_id
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
      mockCreateProgramAssessment.mockResolvedValue(
        updatedProgramAssessmentsRow
      );

      mockPrincipalId(facilitatorPrincipalId);

      appAgent
        .post(`/program`)
        .send(matchingProgramAssessmentsRow)
        .expect(201, err => {
          expect(mockGetPrincipalProgramRole).toHaveBeenCalledWith(
            facilitatorPrincipalId,
            matchingProgramAssessmentsRow.program_id
          );

          expect(mockCreateProgramAssessment).toHaveBeenCalledWith(
            matchingProgramAssessmentsRow
          );

          done(err);
        });
    });

    it('should respond with an Unauthorized Error if the logged-in principal id is not the facilitator', done => {
      mockGetPrincipalProgramRole.mockResolvedValue('Participant');

      mockPrincipalId(participantPrincipalId);

      appAgent
        .post(`/program`)
        .send(matchingProgramAssessmentsRow)
        .expect(
          401,
          errorEnvelope(
            `User is not allowed to create new program assessments for this program.`
          ),
          err => {
            expect(mockGetPrincipalProgramRole).toHaveBeenCalledWith(
              participantPrincipalId,
              matchingProgramAssessmentsRow.program_id
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
      mockFindProgramAssessment.mockResolvedValue(exampleProgramAssessment);
      mockGetPrincipalProgramRole.mockResolvedValue('Facilitator');
      mockUpdateProgramAssessment.mockResolvedValue(
        updatedProgramAssessmentsRow
      );

      mockPrincipalId(facilitatorPrincipalId);

      appAgent
        .put(`/program/${exampleProgramAssessment.id}`)
        .send(updatedProgramAssessmentsRow)
        .expect(201, itemEnvelope(updatedProgramAssessmentsRow), err => {
          expect(mockFindProgramAssessment).toHaveBeenCalledWith(
            exampleProgramAssessment.id
          );

          expect(mockGetPrincipalProgramRole).toHaveBeenCalledWith(
            facilitatorPrincipalId,
            exampleProgramAssessment.program_id
          );

          expect(mockUpdateProgramAssessment).toHaveBeenCalledWith(
            updatedProgramAssessmentsRow
          );

          done(err);
        });
    });

    it('should respond with an Unauthorized Error if the logged-in principal id is not the facilitator', done => {
      mockFindProgramAssessment.mockResolvedValue(exampleProgramAssessment);
      mockGetPrincipalProgramRole.mockResolvedValue(null);

      mockPrincipalId(otherParticipantPrincipalId);

      appAgent
        .put(`/program/${exampleProgramAssessment.id}`)
        .send(updatedProgramAssessmentsRow)
        .expect(
          401,
          errorEnvelope(
            `Could not access program Assessment with ID ${exampleProgramAssessment.id}.`
          ),
          err => {
            expect(mockFindProgramAssessment).toHaveBeenCalledWith(
              exampleProgramAssessment.id
            );

            expect(mockGetPrincipalProgramRole).toHaveBeenCalledWith(
              otherParticipantPrincipalId,
              exampleProgramAssessment.program_id
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
        .send(exampleProgramAssessment)
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

      mockFindProgramAssessment.mockResolvedValue(exampleProgramAssessment);
      mockGetPrincipalProgramRole.mockResolvedValue('Facilitator');

      mockPrincipalId(facilitatorPrincipalId);

      appAgent
        .put(`/program/${exampleProgramAssessment.id}`)
        .send(exampleAssessmentFormUser)
        .expect(
          400,
          errorEnvelope(`Was not given a valid program assessment.`),
          err => {
            expect(mockFindProgramAssessment).toHaveBeenCalledWith(
              exampleProgramAssessment.id
            );

            expect(mockGetPrincipalProgramRole).toHaveBeenCalledWith(
              facilitatorPrincipalId,
              exampleProgramAssessment.program_id
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
        .send(updatedProgramAssessmentsRow)
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
      mockFindProgramAssessment.mockResolvedValue(exampleProgramAssessment);
      mockGetPrincipalProgramRole.mockResolvedValue('Facilitator');
      mockDeleteProgramAssessment.mockResolvedValue(null);

      mockPrincipalId(facilitatorPrincipalId);
      appAgent
        .delete(`/program/${exampleProgramAssessment.id}`)
        .expect(204, {}, err => {
          expect(mockFindProgramAssessment).toHaveBeenCalledWith(
            exampleProgramAssessment.id
          );
          expect(mockGetPrincipalProgramRole).toHaveBeenCalledWith(
            facilitatorPrincipalId,
            exampleProgramAssessment.program_id
          );
          expect(mockDeleteProgramAssessment).toHaveBeenCalledWith(
            exampleProgramAssessment.id
          );
          done(err);
        });
    });

    it('should return an error if logged-in user is not a facilitator of that program', done => {
      mockFindProgramAssessment.mockResolvedValue(exampleProgramAssessment);
      mockGetPrincipalProgramRole.mockResolvedValue('Participant');

      mockPrincipalId(participantPrincipalId);
      appAgent
        .delete(`/program/${exampleProgramAssessment.id}`)
        .expect(
          401,
          errorEnvelope(
            `Not allowed to access program assessment with ID ${exampleProgramAssessment.id}.`
          ),
          err => {
            expect(mockFindProgramAssessment).toHaveBeenCalledWith(
              exampleProgramAssessment.id
            );
            expect(mockGetPrincipalProgramRole).toHaveBeenCalledWith(
              participantPrincipalId,
              exampleProgramAssessment.program_id
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
        .delete(`/program/${exampleProgramAssessment.id}`)
        .expect(
          404,
          errorEnvelope(
            `Could not find program assessment with ID ${exampleProgramAssessment.id}.`
          ),
          err => {
            expect(mockFindProgramAssessment).toHaveBeenCalledWith(
              exampleProgramAssessment.id
            );
            done(err);
          }
        );
    });
    it('should respond with a ConflictError if trying to delete program assessment that has participant submissions. ', done => {
      mockFindProgramAssessment.mockResolvedValue(exampleProgramAssessment);
      mockGetPrincipalProgramRole.mockResolvedValue('Facilitator');
      mockDeleteProgramAssessment.mockRejectedValue(new Error());
      mockPrincipalId(facilitatorPrincipalId);
      appAgent
        .delete(`/program/${exampleProgramAssessment.id}`)
        .expect(
          409,
          errorEnvelope(
            `Cannot delete a program assessment that has participant submissions.`
          ),
          err => {
            expect(mockFindProgramAssessment).toHaveBeenCalledWith(
              exampleProgramAssessment.id
            );
            expect(mockGetPrincipalProgramRole).toHaveBeenCalledWith(
              facilitatorPrincipalId,
              exampleProgramAssessment.program_id
            );
            expect(mockDeleteProgramAssessment).toHaveBeenCalledWith(
              exampleProgramAssessment.id
            );

            done(err);
          }
        );
    });
  });

  describe('GET /program/:programAssessmentId/submissions', () => {
    it('should show a facilitator an AssessmentWithSubmissions with all participant submissions', done => {
      mockFindProgramAssessment.mockResolvedValue(exampleProgramAssessment);
      mockGetPrincipalProgramRole.mockResolvedValue('Facilitator');
      mockListAllProgramAssessmentSubmissions.mockResolvedValue([
        exampleAssessmentSubmissionInProgress,
        exampleOtherAssessmentSubmissionSubmitted,
      ]);
      mockGetCurriculumAssessment.mockResolvedValue(
        exampleCurriculumAssessment
      );

      mockPrincipalId(facilitatorPrincipalId);

      appAgent
        .get(`/program/${exampleProgramAssessment.id}/submissions`)
        .expect(
          200,
          itemEnvelope(exampleFacilitatorAssessmentWithSubmissions),
          err => {
            expect(mockFindProgramAssessment).toHaveBeenCalledWith(
              exampleProgramAssessment.id
            );

            expect(mockGetPrincipalProgramRole).toHaveBeenCalledWith(
              facilitatorPrincipalId,
              exampleProgramAssessment.program_id
            );

            expect(
              mockListAllProgramAssessmentSubmissions
            ).toHaveBeenCalledWith(exampleProgramAssessment.id);

            expect(mockGetCurriculumAssessment).toHaveBeenCalledWith(
              exampleProgramAssessment.assessment_id,
              false,
              false
            );

            done(err);
          }
        );
    });

    it('should show a participant an AssessmentWithSubmissions with their submissions', done => {
      mockFindProgramAssessment.mockResolvedValue(exampleProgramAssessment);
      mockGetPrincipalProgramRole.mockResolvedValue('Participant');
      mockListParticipantProgramAssessmentSubmissions.mockResolvedValue([
        exampleAssessmentSubmissionInProgress,
      ]);
      mockGetCurriculumAssessment.mockResolvedValue(
        exampleCurriculumAssessment
      );

      mockPrincipalId(participantPrincipalId);
      appAgent
        .get(`/program/${exampleProgramAssessment.id}/submissions`)
        .expect(
          200,
          itemEnvelope(exampleParticipantAssessmentWithSubmissions),
          err => {
            expect(mockFindProgramAssessment).toHaveBeenCalledWith(
              exampleProgramAssessment.id
            );

            expect(mockGetPrincipalProgramRole).toHaveBeenCalledWith(
              participantPrincipalId,
              exampleProgramAssessment.program_id
            );

            expect(
              mockListParticipantProgramAssessmentSubmissions
            ).toHaveBeenCalledWith(
              participantPrincipalId,
              exampleProgramAssessment.id
            );

            expect(mockGetCurriculumAssessment).toHaveBeenCalledWith(
              exampleProgramAssessment.assessment_id,
              false,
              false
            );

            done(err);
          }
        );
    });

    it('should give an UnauthorizedError to anyone not enrolled in the course', done => {
      mockFindProgramAssessment.mockResolvedValue(exampleProgramAssessment);
      mockGetPrincipalProgramRole.mockResolvedValue(null);

      mockPrincipalId(unenrolledPrincipalId);
      appAgent
        .get(`/program/${exampleProgramAssessment.id}/submissions`)
        .expect(
          401,
          errorEnvelope(
            `Could not access program assessment with ID ${exampleProgramAssessment.id} without enrollment.`
          ),
          err => {
            expect(mockFindProgramAssessment).toHaveBeenCalledWith(
              exampleProgramAssessment.id
            );

            expect(mockGetPrincipalProgramRole).toHaveBeenCalledWith(
              unenrolledPrincipalId,
              exampleProgramAssessment.program_id
            );

            done(err);
          }
        );
    });

    it('should give a NotFoundError for a programAssessmentId not found in the database', done => {
      mockFindProgramAssessment.mockResolvedValue(null);

      mockPrincipalId(participantPrincipalId);
      appAgent
        .get(`/program/${exampleProgramAssessment.id}/submissions`)
        .expect(
          404,
          errorEnvelope(
            `Could not find program assessment with ID ${exampleProgramAssessment.id}`
          ),
          err => {
            expect(mockFindProgramAssessment).toHaveBeenCalledWith(
              exampleProgramAssessment.id
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
        .get(`/program/${exampleProgramAssessment.id}/submissions/new`)
        .expect(
          404,
          errorEnvelope(
            `Could not find program assessment with ID ${exampleProgramAssessment.id}.`
          ),
          err => {
            expect(mockFindProgramAssessment).toHaveBeenCalledWith(
              exampleProgramAssessment.id
            );
            done(err);
          }
        );
    });

    it('should return an error when attempting to create a submission for a program assessment that is not yet available', done => {
      mockFindProgramAssessment.mockResolvedValue(
        exampleProgramAssessmentNotAvailable
      );

      mockPrincipalId(participantPrincipalId);

      appAgent
        .get(
          `/program/${exampleProgramAssessmentNotAvailable.id}/submissions/new`
        )
        .expect(
          403,
          errorEnvelope(
            `Could not create a new submission of an assessment that's not yet available.`
          ),
          err => {
            expect(mockFindProgramAssessment).toHaveBeenCalledWith(
              exampleProgramAssessmentNotAvailable.id
            );
            done(err);
          }
        );
    });

    it('should return an error when attempting to create a submission when the program assessment due date has passed', done => {
      mockFindProgramAssessment.mockResolvedValue(
        exampleProgramAssessmentPastDue
      );

      mockPrincipalId(participantPrincipalId);

      appAgent
        .get(`/program/${exampleProgramAssessmentPastDue.id}/submissions/new`)
        .expect(
          403,
          errorEnvelope(
            `Could not create a new submission of an assessment after its due date.`
          ),
          err => {
            expect(mockFindProgramAssessment).toHaveBeenCalledWith(
              exampleProgramAssessmentPastDue.id
            );
            done(err);
          }
        );
    });

    it('should return an error if logged-in user is not enrolled in the program', done => {
      mockFindProgramAssessment.mockResolvedValue(exampleProgramAssessment);
      mockGetPrincipalProgramRole.mockResolvedValue(null);

      mockPrincipalId(unenrolledPrincipalId);

      appAgent
        .get(`/program/${exampleProgramAssessment.id}/submissions/new`)
        .expect(
          401,
          errorEnvelope(
            `Could not access program assessment with ID ${exampleProgramAssessment.id}) without enrollment.`
          ),
          err => {
            expect(mockFindProgramAssessment).toHaveBeenCalledWith(
              exampleProgramAssessment.id
            );

            expect(mockGetPrincipalProgramRole).toHaveBeenCalledWith(
              unenrolledPrincipalId,
              exampleProgramAssessment.program_id
            );

            done(err);
          }
        );
    });

    it('should return an error if logged-in user is a facilitator', done => {
      mockFindProgramAssessment.mockResolvedValue(exampleProgramAssessment);
      mockGetPrincipalProgramRole.mockResolvedValue('Facilitator');

      mockPrincipalId(facilitatorPrincipalId);

      appAgent
        .get(`/program/${exampleProgramAssessment.id}/submissions/new`)
        .expect(
          401,
          errorEnvelope(
            `Facilitators are not allowed to create program assessment submissions.`
          ),
          err => {
            expect(mockFindProgramAssessment).toHaveBeenCalledWith(
              exampleProgramAssessment.id
            );

            expect(mockGetPrincipalProgramRole).toHaveBeenCalledWith(
              facilitatorPrincipalId,
              exampleProgramAssessment.program_id
            );

            done(err);
          }
        );
    });

    it('should return an error if no possible submissions remain for this participant and this assessment', done => {
      mockFindProgramAssessment.mockResolvedValue(exampleProgramAssessment);
      mockGetPrincipalProgramRole.mockResolvedValue('Participant');
      mockGetCurriculumAssessment.mockResolvedValue(
        exampleCurriculumAssessmentWithSCQuestions
      );
      mockListParticipantProgramAssessmentSubmissions.mockResolvedValue([
        exampleOtherAssessmentSubmissionSubmitted,
      ]);

      mockPrincipalId(otherParticipantPrincipalId);

      appAgent
        .get(`/program/${exampleProgramAssessment.id}/submissions/new`)
        .expect(
          403,
          errorEnvelope(
            `Could not create a new submission as you have reached the maximum number of submissions for this assessment.`
          ),
          err => {
            expect(mockFindProgramAssessment).toHaveBeenCalledWith(
              exampleProgramAssessment.id
            );

            expect(mockGetPrincipalProgramRole).toHaveBeenCalledWith(
              otherParticipantPrincipalId,
              exampleProgramAssessment.program_id
            );

            expect(mockGetCurriculumAssessment).toHaveBeenCalledWith(
              exampleProgramAssessment.assessment_id,
              true,
              false
            );

            expect(
              mockListParticipantProgramAssessmentSubmissions
            ).toHaveBeenCalledWith(
              otherParticipantPrincipalId,
              exampleProgramAssessment.id
            );

            done(err);
          }
        );
    });

    it('should return the existing submission if one is currently opened or in progress', done => {
      mockFindProgramAssessment.mockResolvedValue(exampleProgramAssessment);
      mockGetPrincipalProgramRole.mockResolvedValue('Participant');
      mockGetCurriculumAssessment.mockResolvedValue(
        exampleCurriculumAssessmentWithSCQuestions
      );
      mockListParticipantProgramAssessmentSubmissions.mockResolvedValue([
        exampleAssessmentSubmissionOpened,
      ]);
      mockGetAssessmentSubmission.mockResolvedValue(
        exampleAssessmentSubmissionOpened
      );

      mockPrincipalId(participantPrincipalId);

      appAgent
        .get(`/program/${exampleProgramAssessment.id}/submissions/new`)
        .expect(
          200,
          itemEnvelope(exampleParticipantOpenedSavedAssessment),
          err => {
            expect(mockFindProgramAssessment).toHaveBeenCalledWith(
              exampleProgramAssessment.id
            );

            expect(mockGetPrincipalProgramRole).toHaveBeenCalledWith(
              participantPrincipalId,
              exampleProgramAssessment.program_id
            );

            expect(mockGetCurriculumAssessment).toHaveBeenCalledWith(
              exampleProgramAssessment.assessment_id,
              true,
              false
            );

            expect(
              mockListParticipantProgramAssessmentSubmissions
            ).toHaveBeenCalledWith(
              participantPrincipalId,
              exampleProgramAssessment.id
            );

            expect(mockGetAssessmentSubmission).toHaveBeenCalledWith(
              exampleAssessmentSubmissionInProgress.id,
              true,
              false
            );

            done(err);
          }
        );
    });

    it('should return a participant a new submission without including the correct answers', done => {
      mockFindProgramAssessment.mockResolvedValue(exampleProgramAssessment);
      mockGetPrincipalProgramRole.mockResolvedValue('Participant');
      mockGetCurriculumAssessment.mockResolvedValue(
        exampleCurriculumAssessmentWithSCQuestions
      );
      mockListParticipantProgramAssessmentSubmissions.mockResolvedValue(null);
      mockCreateAssessmentSubmission.mockResolvedValue(
        exampleAssessmentSubmissionOpened
      );

      mockPrincipalId(participantPrincipalId);

      appAgent
        .get(`/program/${exampleProgramAssessment.id}/submissions/new`)
        .expect(
          200,
          itemEnvelope(exampleParticipantOpenedSavedAssessment),
          err => {
            expect(mockFindProgramAssessment).toHaveBeenCalledWith(
              exampleProgramAssessment.id
            );

            expect(mockGetPrincipalProgramRole).toHaveBeenCalledWith(
              participantPrincipalId,
              exampleProgramAssessment.program_id
            );

            expect(mockGetCurriculumAssessment).toHaveBeenCalledWith(
              exampleProgramAssessment.assessment_id,
              true,
              false
            );

            expect(
              mockListParticipantProgramAssessmentSubmissions
            ).toHaveBeenCalledWith(
              participantPrincipalId,
              exampleProgramAssessment.id
            );

            expect(mockCreateAssessmentSubmission).toHaveBeenCalledWith(
              participantPrincipalId,
              exampleProgramAssessment.id,
              exampleProgramAssessment.assessment_id
            );

            done(err);
          }
        );
    });

    it('should return a participant a new submission without including the correct answers', done => {
      mockFindProgramAssessment.mockResolvedValue(exampleProgramAssessment);
      mockGetPrincipalProgramRole.mockResolvedValue('Participant');
      mockGetCurriculumAssessment.mockResolvedValue(
        exampleCurriculumAssessmentWithSCQuestions
      );
      mockListParticipantProgramAssessmentSubmissions.mockResolvedValue(null);
      mockCreateAssessmentSubmission.mockResolvedValue(
        exampleAssessmentSubmissionOpened
      );

      mockPrincipalId(participantPrincipalId);

      appAgent
        .get(`/program/${exampleProgramAssessment.id}/submissions/new`)
        .expect(
          200,
          itemEnvelope(exampleParticipantOpenedSavedAssessment),
          err => {
            expect(mockFindProgramAssessment).toHaveBeenCalledWith(
              exampleProgramAssessment.id
            );

            expect(mockGetPrincipalProgramRole).toHaveBeenCalledWith(
              participantPrincipalId,
              exampleProgramAssessment.program_id
            );

            expect(mockGetCurriculumAssessment).toHaveBeenCalledWith(
              exampleProgramAssessment.assessment_id,
              true,
              false
            );

            expect(
              mockListParticipantProgramAssessmentSubmissions
            ).toHaveBeenCalledWith(
              participantPrincipalId,
              exampleProgramAssessment.id
            );

            expect(mockCreateAssessmentSubmission).toHaveBeenCalledWith(
              participantPrincipalId,
              exampleProgramAssessment.id,
              exampleProgramAssessment.assessment_id
            );

            done(err);
          }
        );
    });

    it('should return a participant a new submission without including the correct answers, even if a prior submitted submission exists', done => {
      mockFindProgramAssessment.mockResolvedValue(exampleProgramAssessment);
      mockGetPrincipalProgramRole.mockResolvedValue('Participant');
      mockGetCurriculumAssessment.mockResolvedValue(
        exampleCurriculumAssessmentMultipleSubmissionsWithQuestions
      );
      mockListParticipantProgramAssessmentSubmissions.mockResolvedValue([
        exampleAssessmentSubmissionSubmitted,
      ]);
      mockCreateAssessmentSubmission.mockResolvedValue(
        exampleAssessmentSubmissionOpened
      );

      mockPrincipalId(participantPrincipalId);

      appAgent
        .get(`/program/${exampleProgramAssessment.id}/submissions/new`)
        .expect(
          200,
          itemEnvelope(
            exampleParticipantOpenedSavedMultipleSubmissionsAssessment
          ),
          err => {
            expect(mockFindProgramAssessment).toHaveBeenCalledWith(
              exampleProgramAssessment.id
            );

            expect(mockGetPrincipalProgramRole).toHaveBeenCalledWith(
              participantPrincipalId,
              exampleProgramAssessment.program_id
            );

            expect(mockGetCurriculumAssessment).toHaveBeenCalledWith(
              exampleProgramAssessment.assessment_id,
              true,
              false
            );

            expect(
              mockListParticipantProgramAssessmentSubmissions
            ).toHaveBeenCalledWith(
              participantPrincipalId,
              exampleProgramAssessment.id
            );

            expect(mockCreateAssessmentSubmission).toHaveBeenCalledWith(
              participantPrincipalId,
              exampleProgramAssessment.id,
              exampleProgramAssessment.assessment_id
            );

            done(err);
          }
        );
    });
  });

  describe('GET /submissions/:submissionId', () => {
    it("should show a facilitator the full submission information for a participant's ungraded submitted assessment, including the correct answers", done => {
      const facilitatorFullResponse: SavedAssessment = {
        curriculum_assessment: exampleCurriculumAssessmentWithSCCorrectAnswers,
        program_assessment: exampleProgramAssessment,
        principal_program_role: 'Facilitator',
        submission: exampleAssessmentSubmissionSubmitted,
      };

      mockGetAssessmentSubmission.mockResolvedValue(
        exampleAssessmentSubmissionSubmitted
      );
      mockFindProgramAssessment.mockResolvedValue(exampleProgramAssessment);
      mockGetPrincipalProgramRole.mockResolvedValue('Facilitator');
      mockGetCurriculumAssessment.mockResolvedValue(
        exampleCurriculumAssessmentWithSCCorrectAnswers
      );

      mockPrincipalId(facilitatorPrincipalId);

      appAgent
        .get(`/submissions/${exampleAssessmentSubmissionSubmitted.id}`)
        .expect(200, itemEnvelope(facilitatorFullResponse), err => {
          expect(mockGetAssessmentSubmission).toHaveBeenCalledWith(
            exampleAssessmentSubmissionSubmitted.id,
            true
          );

          expect(mockFindProgramAssessment).toHaveBeenCalledWith(
            exampleProgramAssessment.id
          );

          expect(mockGetPrincipalProgramRole).toHaveBeenCalledWith(
            facilitatorPrincipalId,
            exampleProgramAssessment.program_id
          );

          expect(mockGetCurriculumAssessment).toHaveBeenCalledWith(
            exampleProgramAssessment.assessment_id,
            true,
            true
          );

          done(err);
        });
    });

    it('should show a participant their submission information for an in-progress assessment without including the correct answers', done => {
      const participantInProgressAssessmentSubmission: SavedAssessment = {
        curriculum_assessment: exampleCurriculumAssessmentWithSCQuestions,
        program_assessment: exampleProgramAssessment,
        principal_program_role: 'Participant',
        submission: exampleAssessmentSubmissionInProgress,
      };

      mockGetAssessmentSubmission.mockResolvedValue(
        exampleAssessmentSubmissionInProgress
      );
      mockFindProgramAssessment.mockResolvedValue(exampleProgramAssessment);
      mockGetPrincipalProgramRole.mockResolvedValue('Participant');
      mockGetCurriculumAssessment.mockResolvedValue(
        exampleCurriculumAssessmentWithSCQuestions
      );

      mockPrincipalId(participantPrincipalId);

      appAgent
        .get(`/submissions/${exampleAssessmentSubmissionInProgress.id}`)
        .expect(
          200,
          itemEnvelope(participantInProgressAssessmentSubmission),
          err => {
            expect(mockGetAssessmentSubmission).toHaveBeenCalledWith(
              exampleAssessmentSubmissionInProgress.id,
              true
            );

            expect(mockFindProgramAssessment).toHaveBeenCalledWith(
              exampleProgramAssessment.id
            );

            expect(mockGetPrincipalProgramRole).toHaveBeenCalledWith(
              participantPrincipalId,
              exampleProgramAssessment.program_id
            );

            expect(mockGetCurriculumAssessment).toHaveBeenCalledWith(
              exampleProgramAssessment.assessment_id,
              true,
              false
            );

            done(err);
          }
        );
    });

    it('should show a participant their submission information for an ungraded submitted assessment without including the correct answers', done => {
      const participantSubmittedAssessmentSubmission: SavedAssessment = {
        curriculum_assessment: exampleCurriculumAssessmentWithSCQuestions,
        program_assessment: exampleProgramAssessment,
        principal_program_role: 'Participant',
        submission: exampleAssessmentSubmissionSubmitted,
      };

      mockGetAssessmentSubmission.mockResolvedValue(
        exampleAssessmentSubmissionSubmitted
      );
      mockFindProgramAssessment.mockResolvedValue(exampleProgramAssessment);
      mockGetPrincipalProgramRole.mockResolvedValue('Participant');
      mockGetCurriculumAssessment.mockResolvedValue(
        exampleCurriculumAssessmentWithSCQuestions
      );

      mockPrincipalId(participantPrincipalId);

      appAgent
        .get(`/submissions/${exampleAssessmentSubmissionSubmitted.id}`)
        .expect(
          200,
          itemEnvelope(participantSubmittedAssessmentSubmission),
          err => {
            expect(mockGetAssessmentSubmission).toHaveBeenCalledWith(
              exampleAssessmentSubmissionSubmitted.id,
              true
            );

            expect(mockFindProgramAssessment).toHaveBeenCalledWith(
              exampleProgramAssessment.id
            );

            expect(mockGetPrincipalProgramRole).toHaveBeenCalledWith(
              participantPrincipalId,
              exampleProgramAssessment.program_id
            );

            expect(mockGetCurriculumAssessment).toHaveBeenCalledWith(
              exampleProgramAssessment.assessment_id,
              true,
              false
            );

            done(err);
          }
        );
    });

    it('should show a participant their submission information for a graded submitted assessment including the correct answers', done => {
      const participantGradedAssessmentSubmission: SavedAssessment = {
        curriculum_assessment: exampleCurriculumAssessmentWithSCCorrectAnswers,
        program_assessment: exampleProgramAssessment,
        principal_program_role: 'Participant',
        submission: exampleAssessmentSubmissionGraded,
      };

      mockGetAssessmentSubmission.mockResolvedValue(
        exampleAssessmentSubmissionGraded
      );
      mockFindProgramAssessment.mockResolvedValue(exampleProgramAssessment);
      mockGetPrincipalProgramRole.mockResolvedValue('Participant');
      mockGetCurriculumAssessment.mockResolvedValue(
        exampleCurriculumAssessmentWithSCCorrectAnswers
      );

      mockPrincipalId(participantPrincipalId);

      appAgent
        .get(`/submissions/${exampleAssessmentSubmissionGraded.id}`)
        .expect(
          200,
          itemEnvelope(participantGradedAssessmentSubmission),
          err => {
            expect(mockGetAssessmentSubmission).toHaveBeenCalledWith(
              exampleAssessmentSubmissionGraded.id,
              true
            );

            expect(mockFindProgramAssessment).toHaveBeenCalledWith(
              exampleProgramAssessment.id
            );

            expect(mockGetPrincipalProgramRole).toHaveBeenCalledWith(
              participantPrincipalId,
              exampleProgramAssessment.program_id
            );

            expect(mockGetCurriculumAssessment).toHaveBeenCalledWith(
              exampleProgramAssessment.assessment_id,
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
      mockGetAssessmentSubmission.mockResolvedValue(
        exampleAssessmentSubmissionSubmitted
      );
      mockFindProgramAssessment.mockResolvedValue(exampleProgramAssessment);
      mockGetPrincipalProgramRole.mockResolvedValue('Participant');

      mockPrincipalId(otherParticipantPrincipalId);

      appAgent
        .get(`/submissions/${exampleAssessmentSubmissionSubmitted.id}`)
        .expect(
          401,
          errorEnvelope(
            `Could not access submission with ID ${exampleAssessmentSubmissionSubmitted.id}.`
          ),
          err => {
            expect(mockGetAssessmentSubmission).toHaveBeenCalledWith(
              exampleAssessmentSubmissionSubmitted.id,
              true
            );

            expect(mockFindProgramAssessment).toHaveBeenCalledWith(
              exampleProgramAssessment.id
            );

            expect(mockGetPrincipalProgramRole).toHaveBeenCalledWith(
              otherParticipantPrincipalId,
              exampleProgramAssessment.program_id
            );

            done(err);
          }
        );
    });

    it('should respond with an Unauthorized Error if logged-in principal id is not enrolled in the program', done => {
      const programId = 12;
      mockGetAssessmentSubmission.mockResolvedValue(
        exampleAssessmentSubmissionSubmitted
      );
      mockFindProgramAssessment.mockResolvedValue(exampleProgramAssessment);
      mockGetPrincipalProgramRole.mockResolvedValue(null);

      mockPrincipalId(participantPrincipalId);

      appAgent
        .get(`/submissions/${exampleAssessmentSubmissionSubmitted.id}`)
        .expect(
          401,
          errorEnvelope(
            `Could not access submission with ID ${exampleAssessmentSubmissionSubmitted.id}.`
          ),
          err => {
            expect(mockGetAssessmentSubmission).toHaveBeenCalledWith(
              exampleAssessmentSubmissionSubmitted.id,
              true
            );
            expect(mockFindProgramAssessment).toHaveBeenCalledWith(
              exampleProgramAssessment.id
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
      mockGetAssessmentSubmission.mockResolvedValue(
        exampleAssessmentSubmissionSubmitted
      );
      mockFindProgramAssessment.mockResolvedValue(exampleProgramAssessment);
      mockGetPrincipalProgramRole.mockResolvedValue('Facilitator');
      mockUpdateAssessmentSubmission.mockResolvedValue(
        sentUpdatedAssessmentSubmissionChangedResponse
      );

      mockPrincipalId(facilitatorPrincipalId);

      appAgent
        .put(`/submissions/${exampleAssessmentSubmissionSubmitted.id}`)
        .send(sentUpdatedAssessmentSubmissionChangedResponse)
        .expect(
          201,
          itemEnvelope(sentUpdatedAssessmentSubmissionChangedResponse),
          err => {
            expect(mockGetAssessmentSubmission).toHaveBeenCalledWith(
              exampleAssessmentSubmissionSubmitted.id,
              true
            );

            expect(mockFindProgramAssessment).toHaveBeenCalledWith(
              sentUpdatedAssessmentSubmissionChangedResponse.assessment_id
            );

            expect(mockGetPrincipalProgramRole).toHaveBeenCalledWith(
              facilitatorPrincipalId,
              exampleProgramAssessment.program_id
            );

            expect(mockUpdateAssessmentSubmission).toHaveBeenCalledWith(
              sentUpdatedAssessmentSubmissionChangedResponse,
              true
            );

            done(err);
          }
        );
    });

    it('should update submission if the logged-in principal ID is the program participant', done => {
      mockGetAssessmentSubmission.mockResolvedValue(
        exampleAssessmentSubmissionInProgress
      );
      mockFindProgramAssessment.mockResolvedValue(exampleProgramAssessment);
      mockGetPrincipalProgramRole.mockResolvedValue('Participant');
      mockUpdateAssessmentSubmission.mockResolvedValue(
        exampleAssessmentSubmissionInProgress
      );

      mockPrincipalId(participantPrincipalId);

      appAgent
        .put(`/submissions/${exampleAssessmentSubmissionInProgress.id}`)
        .send(exampleAssessmentSubmissionInProgress)
        .expect(
          201,
          itemEnvelope(exampleAssessmentSubmissionInProgress),
          err => {
            expect(mockGetAssessmentSubmission).toHaveBeenCalledWith(
              exampleAssessmentSubmissionInProgress.id,
              true
            );

            expect(mockFindProgramAssessment).toHaveBeenCalledWith(
              exampleAssessmentSubmissionInProgress.assessment_id
            );

            expect(mockGetPrincipalProgramRole).toHaveBeenCalledWith(
              participantPrincipalId,
              exampleProgramAssessment.program_id
            );

            expect(mockUpdateAssessmentSubmission).toHaveBeenCalledWith(
              exampleAssessmentSubmissionInProgress,
              false
            );

            done(err);
          }
        );
    });

    it('should do nothing if the logged-in principal ID is the program participant and the assessment was already submitted', done => {
      mockGetAssessmentSubmission.mockResolvedValue(
        exampleAssessmentSubmissionSubmitted
      );
      mockFindProgramAssessment.mockResolvedValue(exampleProgramAssessment);
      mockGetPrincipalProgramRole.mockResolvedValue('Participant');

      mockPrincipalId(participantPrincipalId);

      appAgent
        .put(`/submissions/${exampleAssessmentSubmissionSubmitted.id}`)
        .send(exampleAssessmentSubmissionSubmitted)
        .expect(
          201,
          itemEnvelope(exampleAssessmentSubmissionSubmitted),
          err => {
            expect(mockGetAssessmentSubmission).toHaveBeenCalledWith(
              exampleAssessmentSubmissionSubmitted.id,
              true
            );

            expect(mockFindProgramAssessment).toHaveBeenCalledWith(
              exampleAssessmentSubmissionSubmitted.assessment_id
            );

            expect(mockGetPrincipalProgramRole).toHaveBeenCalledWith(
              participantPrincipalId,
              exampleProgramAssessment.program_id
            );

            expect(mockGetAssessmentSubmission).toHaveBeenCalledWith(
              exampleAssessmentSubmissionSubmitted.id,
              true,
              false
            );

            done(err);
          }
        );
    });

    it('should respond with a BadRequestError if given an invalid submission ID', done => {
      const submissionId = 'test';

      appAgent
        .put(`/submissions/${submissionId}`)
        .send(updatedAssessmentResponsesSCGradedRow)
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
        .put(`/submissions/${exampleAssessmentSubmissionSubmitted.id}`)
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
        .send(exampleAssessmentSubmissionGraded)
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
      mockGetAssessmentSubmission.mockResolvedValue(
        exampleAssessmentSubmissionSubmitted
      );
      mockFindProgramAssessment.mockResolvedValue(exampleProgramAssessment);
      mockGetPrincipalProgramRole.mockResolvedValue(null);

      mockPrincipalId(participantPrincipalId);

      appAgent
        .put(`/submissions/${exampleAssessmentSubmissionSubmitted.id}`)
        .send(exampleAssessmentSubmissionGraded)
        .expect(
          401,
          errorEnvelope(
            `Could not access the assessment and submssion without enrollment in the program or being a facilitator.`
          ),
          err => {
            expect(mockGetAssessmentSubmission).toHaveBeenCalledWith(
              exampleAssessmentSubmissionSubmitted.id,
              true
            );
            expect(mockFindProgramAssessment).toHaveBeenCalledWith(
              exampleProgramAssessment.id
            );

            expect(mockGetPrincipalProgramRole).toHaveBeenCalledWith(
              participantPrincipalId,
              exampleProgramAssessment.program_id
            );
            done(err);
          }
        );
    });

    it('should respond with an Unauthorized Error if user is participant but not the owner of the submission', done => {
      mockGetAssessmentSubmission.mockResolvedValue(
        exampleAssessmentSubmissionSubmitted
      );
      mockFindProgramAssessment.mockResolvedValue(exampleProgramAssessment);
      mockGetPrincipalProgramRole.mockResolvedValue('Participant');

      mockPrincipalId(otherParticipantPrincipalId);

      appAgent
        .put(`/submissions/${exampleAssessmentSubmissionSubmitted.id}`)
        .send(exampleAssessmentSubmissionGraded)
        .expect(
          401,
          errorEnvelope(
            `You may not update an assessment that is not your own.`
          ),
          err => {
            expect(mockGetAssessmentSubmission).toHaveBeenCalledWith(
              exampleAssessmentSubmissionSubmitted.id,
              true
            );
            expect(mockFindProgramAssessment).toHaveBeenCalledWith(
              exampleProgramAssessment.id
            );

            expect(mockGetPrincipalProgramRole).toHaveBeenCalledWith(
              otherParticipantPrincipalId,
              exampleProgramAssessment.program_id
            );
            done(err);
          }
        );
    });

    it('should respond with a BadRequestError if submssion id from param is not the same from request body.', done => {
      mockPrincipalId(participantPrincipalId);

      appAgent
        .put(`/submissions/${assessmentSubmissionId}`)
        .send(sentUpdatedAssessmentSubmissionChangedResponseWithWrongID)
        .expect(
          400,
          errorEnvelope(
            `The submission id in the parameter(${assessmentSubmissionId}) is not the same id as in the request body (${sentUpdatedAssessmentSubmissionChangedResponseWithWrongID.id}).`
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
        .send(exampleAssessmentSubmissionGraded)
        .expect(500, done);
    });
  });
});
