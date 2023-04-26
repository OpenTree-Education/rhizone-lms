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

const facilitatorProgramIdsThatMatchCurriculum = [programId, 20, 30];
const facilitatorProgramIdsNotMatchingCurriculum = [40, 50];

const programParticipantRolesRows = [
  {
    id: 1,
    title: 'Facilitator',
  },
  {
    id: 2,
    title: 'Participant',
  },
];

const matchingCurriculumAssessmentRow = {
  id: curriculumAssessmentId,
  title: 'Assignment 1: React',
  description: 'Your assignment for week 1 learning.',
  max_score: 10,
  max_num_submissions: 1,
  time_limit: 120,
  curriculum_id: curriculumId,
  activity_id: activityId,
  principal_id: administratorPrincipalId,
};

const matchingAssessmentQuestionsSCRow = {
  id: singleChoiceQuestionId,
  assessment_id: curriculumAssessmentId,
  title: 'What is React?',
  description: null as string,
  question_type: 'single choice',
  correct_answer_id: singleChoiceAnswerId,
  max_score: 1,
  sort_order: 1,
};

const matchingAssessmentQuestionsFRRow = {
  id: freeResponseQuestionId,
  assessment_id: curriculumAssessmentId,
  title:
    'What is the correct HTML syntax for a paragraph with the text "Hello, World!"?',
  description: null as string,
  question_type: 'free response',
  correct_answer_id: freeResponseCorrectAnswerId,
  max_score: 1,
  sort_order: 1,
};

const matchingAssessmentAnswersSCRow = {
  id: singleChoiceAnswerId,
  question_id: singleChoiceQuestionId,
  title: 'A relational database management system',
  description: null as string,
  sort_order: 1,
  correct_answer: true,
};

const matchingAssessmentAnswersFRRow = {
  id: freeResponseCorrectAnswerId,
  question_id: freeResponseQuestionId,
  title: '<p>Hello, World!</p>',
  description: null as string,
  sort_order: 1,
  correct_answer: true,
};

const matchingProgramRow = {
  id: programId,
  title: 'Cohort 4',
  start_date: '2022-10-24',
  end_date: '2022-12-16',
  time_zone: 'America/Vancouver',
  curriculum_id: curriculumId,
};

const matchingProgramAssessmentsRow = {
  id: programAssessmentId,
  program_id: programId,
  assessment_id: curriculumAssessmentId,
  available_after: '2023-02-06 00:00:00',
  due_date: '2050-06-24 00:00:00',
};

const matchingProgramAssessmentPastDueRow = {
  ...matchingProgramAssessmentsRow,
  due_date: '2023-02-10 00:00:00',
};

const matchingProgramAssessmentNotAvailableRow = {
  ...matchingProgramAssessmentsRow,
  available_after: '2050-06-24 00:00:00',
  due_date: '2050-06-23 00:00:00',
};

const matchingAssessmentSubmissionOpenedRow = {
  id: assessmentSubmissionId,
  assessment_id: programAssessmentId,
  principal_id: participantPrincipalId,
  assessment_submission_state: 'Opened',
  opened_at: '2023-02-09 12:00:00',
  submitted_at: null as string,
  updated_at: '2023-02-09 12:00:00',
  score: null as number,
};

const matchingAssessmentSubmissionInProgressRow = {
  ...matchingAssessmentSubmissionOpenedRow,
  assessment_submission_state: 'In Progress',
};

const matchingAssessmentSubmissionExpiredRow = {
  ...matchingAssessmentSubmissionOpenedRow,
  assessment_submission_state: 'Expired',
  updated_at: '2023-02-09 14:00:00',
};

const matchingAssessmentSubmissionsSubmittedRow = {
  ...matchingAssessmentSubmissionOpenedRow,
  assessment_submission_state: 'Submitted',
  submitted_at: '2023-02-09 13:23:45',
  updated_at: '2023-02-09 13:23:45',
};

const matchingOtherAssessmentSubmissionSubmittedRow = {
  id: assessmentSubmissionByOtherParticipantId,
  assessment_id: programAssessmentId,
  principal_id: otherParticipantPrincipalId,
  assessment_submission_state: 'Submitted',
  opened_at: '2023-02-09 12:01:00',
  last_modified: '2023-02-09 12:01:00',
  submitted_at: '2023-02-09 13:23:45',
  updated_at: '2023-02-09 13:23:45',
  score: null as number,
};

const matchingAssessmentSubmissionsRowGraded = {
  ...matchingAssessmentSubmissionsSubmittedRow,
  assessment_submission_state: 'Graded',
  score: 4,
};

const matchingAssessmentResponsesRowSCOpened = {
  id: assessmentSubmissionResponseSCId,
  assessment_id: programAssessmentId,
  submission_id: assessmentSubmissionId,
  question_id: singleChoiceQuestionId,
  answer_id: null as number,
  response: null as string,
  score: null as number,
  grader_response: null as string,
};

const matchingAssessmentResponsesRowSCInProgress = {
  id: assessmentSubmissionResponseSCId,
  assessment_id: programAssessmentId,
  submission_id: assessmentSubmissionId,
  question_id: singleChoiceQuestionId,
  answer_id: singleChoiceAnswerId,
  response: null as string,
  score: null as number,
  grader_response: null as string,
};

const matchingAssessmentResponsesRowSCSubmitted = {
  ...matchingAssessmentResponsesRowSCInProgress,
};

const matchingAssessmentResponsesRowSCGraded = {
  ...matchingAssessmentResponsesRowSCInProgress,
  score: 1,
  grader_response: 'Well done!',
};

const matchingAssessmentResponsesRowFROpened = {
  id: assessmentSubmissionResponseFRId,
  assessment_id: programAssessmentId,
  submission_id: assessmentSubmissionId,
  question_id: freeResponseQuestionId,
  answer_id: null as string,
  response: null as string,
};

const matchingAssessmentResponsesRowFRInProgress = {
  ...matchingAssessmentResponsesRowFROpened,
  response: '<div>Hello world!</div>',
};

const matchingAssessmentResponsesRowFRGraded = {
  ...matchingAssessmentResponsesRowFRInProgress,
  score: 0,
  grader_response: 'Very close!',
};

const exampleCurriculumAssessment: CurriculumAssessment = {
  id: curriculumAssessmentId,
  title: matchingCurriculumAssessmentRow.title,
  assessment_type: 'test',
  description: matchingCurriculumAssessmentRow.description,
  max_score: matchingCurriculumAssessmentRow.max_score,
  max_num_submissions: matchingCurriculumAssessmentRow.max_num_submissions,
  time_limit: matchingCurriculumAssessmentRow.time_limit,
  curriculum_id: curriculumId,
  activity_id: activityId,
  principal_id: administratorPrincipalId,
};

const exampleAssessmentSCAnswerWithoutCorrectAnswer: Answer = {
  id: singleChoiceAnswerId,
  question_id: singleChoiceQuestionId,
  description: matchingAssessmentAnswersSCRow.description,
  title: matchingAssessmentAnswersSCRow.title,
  sort_order: matchingAssessmentAnswersSCRow.sort_order,
};

const exampleAssessmentSCAnswerWithCorrectAnswer: Answer = {
  ...exampleAssessmentSCAnswerWithoutCorrectAnswer,
  correct_answer: matchingAssessmentAnswersSCRow.correct_answer,
};

const exampleAssessmentFRAnswerWithoutCorrectAnswer: Answer = {
  id: freeResponseCorrectAnswerId,
  question_id: freeResponseQuestionId,
  description: matchingAssessmentAnswersFRRow.description,
  title: matchingAssessmentAnswersFRRow.title,
  sort_order: matchingAssessmentAnswersFRRow.sort_order,
};

const exampleAssessmentFRAnswerWithCorrectAnswer: Answer = {
  ...exampleAssessmentFRAnswerWithoutCorrectAnswer,
  id: freeResponseCorrectAnswerId,
  correct_answer: true,
};

const exampleAssessmentQuestionSCBase: Question = {
  id: singleChoiceQuestionId,
  assessment_id: curriculumAssessmentId,
  title: matchingAssessmentQuestionsSCRow.title,
  description: matchingAssessmentQuestionsSCRow.description,
  question_type: matchingAssessmentQuestionsSCRow.question_type,
  max_score: matchingAssessmentQuestionsSCRow.max_score,
  sort_order: matchingAssessmentQuestionsSCRow.sort_order,
};

const exampleAssessmentQuestionSCWithoutCorrectAnswers: Question = {
  ...exampleAssessmentQuestionSCBase,
  answers: [exampleAssessmentSCAnswerWithoutCorrectAnswer],
};

const exampleAssessmentQuestionSCWithCorrectAnswers: Question = {
  ...exampleAssessmentQuestionSCBase,
  answers: [exampleAssessmentSCAnswerWithCorrectAnswer],
  correct_answer_id: exampleAssessmentSCAnswerWithCorrectAnswer.id,
};

const exampleAssessmentQuestionFRWithCorrectAnswers: Question = {
  id: freeResponseQuestionId,
  assessment_id: curriculumAssessmentId,
  title: matchingAssessmentQuestionsFRRow.title,
  description: matchingAssessmentQuestionsFRRow.description,
  question_type: matchingAssessmentQuestionsFRRow.question_type,
  answers: [exampleAssessmentFRAnswerWithCorrectAnswer],
  correct_answer_id: freeResponseCorrectAnswerId,
  max_score: matchingAssessmentQuestionsFRRow.max_score,
  sort_order: matchingAssessmentQuestionsFRRow.sort_order,
};

const exampleCurriculumAssessmentWithSCQuestions: CurriculumAssessment = {
  ...exampleCurriculumAssessment,
  questions: [exampleAssessmentQuestionSCWithoutCorrectAnswers],
};

const exampleCurriculumAssessmentMultipleSubmissionsWithQuestions: CurriculumAssessment =
  {
    ...exampleCurriculumAssessment,
    questions: [exampleAssessmentQuestionSCWithCorrectAnswers],
    max_num_submissions: 3,
  };

const exampleCurriculumAssessmentWithSCCorrectAnswers: CurriculumAssessment = {
  ...exampleCurriculumAssessment,
  questions: [exampleAssessmentQuestionSCWithCorrectAnswers],
};

const exampleCurriculumAssessmentWithFRCorrectAnswers: CurriculumAssessment = {
  ...exampleCurriculumAssessment,
  questions: [exampleAssessmentQuestionFRWithCorrectAnswers],
};

const exampleProgramAssessment: ProgramAssessment = {
  id: programAssessmentId,
  program_id: programId,
  assessment_id: curriculumAssessmentId,
  available_after: '2023-02-06T00:00:00.000-08:00',
  due_date: '2050-06-24T00:00:00.000-07:00',
};

const exampleProgramAssessmentPastDue: ProgramAssessment = {
  id: programAssessmentId,
  program_id: programId,
  assessment_id: curriculumAssessmentId,
  available_after: '2023-02-06T00:00:00.000-08:00',
  due_date: '2023-02-10T00:00:00.000-08:00',
};

const exampleProgramAssessmentNotAvailable: ProgramAssessment = {
  id: programAssessmentId,
  program_id: programId,
  assessment_id: curriculumAssessmentId,
  available_after: '2050-06-24T00:00:00.000-07:00',
  due_date: '2050-06-23T00:00:00.000-07:00',
};

const exampleAssessmentWithSCCorrectAnswersDetails: AssessmentDetails = {
  curriculum_assessment: exampleCurriculumAssessmentWithSCCorrectAnswers,
  program_assessment: exampleProgramAssessment,
};

const exampleParticipantAssessmentSubmissionsInactive: ParticipantAssessmentSubmissionsSummary =
  {
    principal_id: participantPrincipalId,
    highest_state: 'Inactive',
    total_num_submissions: 0,
  };

const exampleParticipantAssessmentSubmissionsPastDue: ParticipantAssessmentSubmissionsSummary =
  {
    principal_id: participantPrincipalId,
    highest_state: 'Expired',
    total_num_submissions: 1,
  };

const exampleParticipantAssessmentSubmissionsActive: ParticipantAssessmentSubmissionsSummary =
  {
    principal_id: participantPrincipalId,
    highest_state: 'Active',
    total_num_submissions: 0,
  };

const exampleParticipantAssessmentSubmissionsSummary: ParticipantAssessmentSubmissionsSummary =
  {
    principal_id: participantPrincipalId,
    highest_state: 'Graded',
    most_recent_submitted_date: '2023-02-09T13:23:45.000Z',
    total_num_submissions: 1,
    highest_score: 4,
  };

const exampleFacilitatorAssessmentSubmissionsSummary: FacilitatorAssessmentSubmissionsSummary =
  {
    num_participants_with_submissions: 8,
    num_program_participants: 12,
    num_ungraded_submissions: 6,
  };

const exampleAssessmentSubmissionOpened: AssessmentSubmission = {
  id: assessmentSubmissionId,
  assessment_id: programAssessmentId,
  principal_id: participantPrincipalId,
  assessment_submission_state: 'Opened',
  opened_at: '2023-02-09T12:00:00.000Z',
  last_modified: '2023-02-09T12:00:00.000Z',
};

const exampleAssessmentResponseSCUnanswered: AssessmentResponse = {
  id: assessmentSubmissionResponseSCId,
  assessment_id: programAssessmentId,
  submission_id: assessmentSubmissionId,
  question_id: singleChoiceQuestionId,
};

const exampleAssessmentResponseSCAnswered: AssessmentResponse = {
  ...exampleAssessmentResponseSCUnanswered,
  answer_id: singleChoiceAnswerId,
};

const exampleAssessmentResponseSCGraded: AssessmentResponse = {
  ...exampleAssessmentResponseSCAnswered,
  score: 1,
  grader_response: 'Well done!',
};

const exampleAssessmentResponseFRUnanswered: AssessmentResponse = {
  id: assessmentSubmissionResponseFRId,
  assessment_id: programAssessmentId,
  submission_id: assessmentSubmissionId,
  question_id: freeResponseQuestionId,
};

const exampleAssessmentResponseFRAnswered: AssessmentResponse = {
  ...exampleAssessmentResponseFRUnanswered,
  response_text: matchingAssessmentResponsesRowFRInProgress.response,
};

const exampleAssessmentResponseFRGraded: AssessmentResponse = {
  ...exampleAssessmentResponseFRAnswered,
  score: 0,
  grader_response: 'Very close!',
};

const exampleAssessmentSubmissionOpenedWithResponse: AssessmentSubmission = {
  ...exampleAssessmentSubmissionOpened,
  responses: [exampleAssessmentResponseSCUnanswered],
};

const exampleAssessmentSubmissionInProgress: AssessmentSubmission = {
  ...exampleAssessmentSubmissionOpened,
  assessment_submission_state: 'In Progress',
  last_modified: '2023-02-09T12:05:00.000Z',
  responses: [exampleAssessmentResponseSCAnswered],
};
const exampleAssessmentSubmissionFRInProgress: AssessmentSubmission = {
  ...exampleAssessmentSubmissionOpened,
  assessment_submission_state: 'In Progress',
  last_modified: '2023-02-09T12:05:00.000Z',
  responses: [exampleAssessmentResponseFRAnswered],
};

const exampleAssessmentSubmissionInProgressSCFR: AssessmentSubmission = {
  ...exampleAssessmentSubmissionOpened,
  assessment_submission_state: 'In Progress',
  last_modified: '2023-02-09T12:05:00.000Z',
  responses: [
    exampleAssessmentResponseSCAnswered,
    exampleAssessmentResponseFRAnswered,
  ],
};

const exampleAssessmentSubmissionInProgressSCFRLateStart: AssessmentSubmission =
  {
    ...exampleAssessmentSubmissionOpened,
    assessment_submission_state: 'In Progress',
    opened_at: '2023-02-10T07:00:00.000Z',
    last_modified: '2023-02-10T07:05:00.000Z',
    responses: [
      exampleAssessmentResponseSCAnswered,
      exampleAssessmentResponseFRAnswered,
    ],
  };

const exampleAssessmentSubmissionPastDueDate: AssessmentSubmission = {
  ...exampleAssessmentSubmissionOpened,
  assessment_submission_state: 'Expired',
  opened_at: '2023-02-10T07:00:00.000Z',
  last_modified: '2023-02-17T08:00:10.000Z',
  responses: [
    exampleAssessmentResponseSCAnswered,
    exampleAssessmentResponseFRAnswered,
  ],
};

const exampleAssessmentSubmissionExpired: AssessmentSubmission = {
  ...exampleAssessmentSubmissionOpened,
  assessment_submission_state: 'Expired',
  last_modified: '2023-02-09T14:00:00.000Z',
  responses: [exampleAssessmentResponseSCAnswered],
};

const exampleAssessmentSubmissionExpiredPlusWeek: AssessmentSubmission = {
  ...exampleAssessmentSubmissionOpened,
  assessment_submission_state: 'Expired',
  last_modified: '2023-02-16T14:00:10.000Z',
  responses: [exampleAssessmentResponseSCAnswered],
};

const exampleAssessmentSubmissionSubmitted: AssessmentSubmission = {
  ...exampleAssessmentSubmissionOpened,
  assessment_submission_state: 'Submitted',
  submitted_at: '2023-02-09T13:23:45.000Z',
  last_modified: '2023-02-09T13:23:45.000Z',
  responses: [exampleAssessmentResponseSCAnswered],
};
const exampleAssessmentSubmissionFRSubmitted: AssessmentSubmission = {
  ...exampleAssessmentSubmissionOpened,
  assessment_submission_state: 'Submitted',
  submitted_at: '2023-02-09T13:23:45.000Z',
  last_modified: '2023-02-09T13:23:45.000Z',
  responses: [exampleAssessmentResponseFRAnswered],
};

const exampleOtherAssessmentSubmissionSubmitted: AssessmentSubmission = {
  id: assessmentSubmissionByOtherParticipantId,
  assessment_id: programAssessmentId,
  principal_id: otherParticipantPrincipalId,
  assessment_submission_state: 'Submitted',
  opened_at: '2023-02-09T12:01:00.000Z',
  submitted_at: '2023-02-09T13:23:45.000Z',
  last_modified: '2023-02-09T13:23:45.000Z',
};

const exampleAssessmentSubmissionGradedNoResponses: AssessmentSubmission = {
  ...exampleAssessmentSubmissionOpened,
  submitted_at: '2023-02-09T13:23:45.000Z',
  last_modified: '2023-02-09T13:23:45.000Z',
  assessment_submission_state: 'Graded',
  score: 4,
};

const exampleAssessmentSubmissionGraded: AssessmentSubmission = {
  ...exampleAssessmentSubmissionOpened,
  assessment_submission_state: 'Graded',
  submitted_at: '2023-02-09T13:23:45.000Z',
  last_modified: '2023-02-09T13:23:45.000Z',
  score: 4,
  responses: [exampleAssessmentResponseSCGraded],
};

const exampleAssessmentSubmissionGradedRemovedGrades: AssessmentSubmission = {
  ...exampleAssessmentSubmissionOpened,
  assessment_submission_state: 'Graded',
  submitted_at: '2023-02-09T13:23:45.000Z',
  last_modified: '2023-02-09T13:23:45.000Z',
  responses: [exampleAssessmentResponseSCAnswered],
};

const exampleParticipantAssessmentWithSubmissions: AssessmentWithSubmissions = {
  curriculum_assessment: exampleCurriculumAssessment,
  program_assessment: exampleProgramAssessment,
  principal_program_role: 'Participant',
  submissions: [exampleAssessmentSubmissionInProgress],
};

const exampleParticipantOpenedSavedAssessment: SavedAssessment = {
  curriculum_assessment: exampleCurriculumAssessmentWithSCQuestions,
  program_assessment: exampleProgramAssessment,
  principal_program_role: 'Participant',
  submission: exampleAssessmentSubmissionOpened,
};

const exampleParticipantOpenedSavedMultipleSubmissionsAssessment: SavedAssessment =
  {
    curriculum_assessment:
      exampleCurriculumAssessmentMultipleSubmissionsWithQuestions,
    program_assessment: exampleProgramAssessment,
    principal_program_role: 'Participant',
    submission: exampleAssessmentSubmissionOpened,
  };

const exampleFacilitatorAssessmentWithSubmissions: AssessmentWithSubmissions = {
  curriculum_assessment: exampleCurriculumAssessment,
  program_assessment: exampleProgramAssessment,
  principal_program_role: 'Facilitator',
  submissions: [
    exampleAssessmentSubmissionInProgress,
    exampleOtherAssessmentSubmissionSubmitted,
  ],
};

const updatedAssessmentAnswersSCRow = {
  id: singleChoiceAnswerId,
  question_id: singleChoiceQuestionId,
  title: 'A relational database management system',
  description: 'Also known as a DBMS.',
  sort_order: 1,
  correct_answer: true,
};

const updatedProgramAssessmentsRow = {
  ...matchingProgramAssessmentsRow,
  due_date: '2050-06-26 00:00:00',
};

const updatedAssessmentResponsesSCGradedRow = {
  id: assessmentSubmissionResponseSCId,
  assessment_id: programAssessmentId,
  submission_id: assessmentSubmissionId,
  question_id: singleChoiceQuestionId,
  answer_id: singleChoiceAnswerId,
  score: null as number,
  grader_response: 'Well done!',
};

const updatedAssessmentResponsesFRGradedRow = {
  id: assessmentSubmissionResponseFRId,
  assessment_id: programAssessmentId,
  submission_id: assessmentSubmissionId,
  question_id: freeResponseQuestionId,
  response: '<div>Hello world!</div>',
  score: 0,
  grader_response: 'Very close!',
};

const updatedAssessmentSubmissionsRow = {
  ...matchingAssessmentSubmissionInProgressRow,
  assessment_submission_state: 'Submitted',
  submitted_at: '2023-02-09 13:23:45',
  last_modified: '2023-02-09 13:23:45',
};

const newCurriculumAssessmentsRow = {
  id: sentCurriculumAssessmentId,
  title: 'New Curriculum Quiz',
  description: null as string,
  max_score: 42,
  max_num_submissions: 13,
  time_limit: 60,
  curriculum_id: curriculumId,
  activity_id: sentCAActivityId,
  principal_id: facilitatorPrincipalId,
};

const newProgramAssessmentsRow = {
  ...matchingProgramAssessmentsRow,
  id: programAssessmentId,
};

const sentNewCurriculumAssessment: CurriculumAssessment = {
  title: newCurriculumAssessmentsRow.title,
  assessment_type: 'quiz',
  description: newCurriculumAssessmentsRow.description,
  max_score: newCurriculumAssessmentsRow.max_score,
  max_num_submissions: newCurriculumAssessmentsRow.max_num_submissions,
  time_limit: newCurriculumAssessmentsRow.time_limit,
  curriculum_id: curriculumId,
  activity_id: sentCAActivityId,
  principal_id: facilitatorPrincipalId,
};

const sentNewSCAssessmentAnswer: Answer = {
  description: matchingAssessmentAnswersSCRow.description,
  title: matchingAssessmentAnswersSCRow.title,
  sort_order: matchingAssessmentAnswersSCRow.sort_order,
  correct_answer: true,
};

const sentNewSCAssessmentQuestion: Question = {
  assessment_id: curriculumAssessmentId,
  title: matchingAssessmentQuestionsSCRow.title,
  description: matchingAssessmentQuestionsSCRow.description,
  question_type: matchingAssessmentQuestionsSCRow.question_type,
  answers: [sentNewSCAssessmentAnswer],
  max_score: matchingAssessmentQuestionsSCRow.max_score,
  sort_order: matchingAssessmentQuestionsSCRow.sort_order,
};

const sentNewFRAssessmentAnswer: Answer = {
  description: matchingAssessmentAnswersFRRow.description,
  title: matchingAssessmentAnswersFRRow.title,
  sort_order: matchingAssessmentAnswersFRRow.sort_order,
  correct_answer: true,
};

const sentNewFRAssessmentQuestion: Question = {
  assessment_id: curriculumAssessmentId,
  title: matchingAssessmentQuestionsFRRow.title,
  description: matchingAssessmentQuestionsFRRow.description,
  question_type: matchingAssessmentQuestionsFRRow.question_type,
  answers: [sentNewFRAssessmentAnswer],
  max_score: matchingAssessmentQuestionsFRRow.max_score,
  sort_order: matchingAssessmentQuestionsFRRow.sort_order,
};

const sentNewCurriculumAssessmentWithSCQuestion: CurriculumAssessment = {
  ...sentNewCurriculumAssessment,
  questions: [sentNewSCAssessmentQuestion],
};

const sentNewCurriculumAssessmentWithFRQuestion: CurriculumAssessment = {
  ...sentNewCurriculumAssessment,
  questions: [sentNewFRAssessmentQuestion],
};

const sentUpdatedCurriculumAssessment: CurriculumAssessment = {
  ...exampleCurriculumAssessment,
  time_limit: 121,
};

const sentCurriculumAssessmentWithNewSCQuestion: CurriculumAssessment = {
  ...exampleCurriculumAssessment,
  questions: [sentNewSCAssessmentQuestion],
};

const sentCurriculumAssessmentWithNewSCQuestion2: CurriculumAssessment = {
  ...exampleCurriculumAssessment,
  questions: [sentNewSCAssessmentQuestion],
};

const sentAssessmentSCQuestionNewAnswer: Question = {
  ...exampleAssessmentQuestionSCBase,
  answers: [sentNewSCAssessmentAnswer],
};

const sentCurriculumAssessmentWithSCQuestionNewAnswer: CurriculumAssessment = {
  ...exampleCurriculumAssessment,
  questions: [sentAssessmentSCQuestionNewAnswer],
};

const sentNewProgramAssessment: ProgramAssessment = {
  program_id: programId,
  assessment_id: curriculumAssessmentId,
  available_after: '2023-02-06 00:00:00',
  due_date: '2050-06-24 00:00:00',
};

const sentNewSCAssessmentResponse: AssessmentResponse = {
  assessment_id: programAssessmentId,
  submission_id: assessmentSubmissionId,
  question_id: singleChoiceQuestionId,
  answer_id: singleChoiceAnswerId,
};

const sentNewFRAssessmentResponse: AssessmentResponse = {
  assessment_id: programAssessmentId,
  submission_id: assessmentSubmissionId,
  question_id: freeResponseQuestionId,
  response_text: '<div>Hello world!</div>',
};

const sentAssessmentSCAnswerWithUpdatedCorrectAnswer: Answer = {
  ...exampleAssessmentSCAnswerWithCorrectAnswer,
  description: updatedAssessmentAnswersSCRow.description,
};

const sentAssessmentQuestionSCWithUpdatedCorrectAnswer: Question = {
  ...exampleAssessmentQuestionSCWithCorrectAnswers,
  answers: [sentAssessmentSCAnswerWithUpdatedCorrectAnswer],
};

const exampleCurriculumAssessmentWithUpdatedSCCorrectAnswer: CurriculumAssessment =
  {
    ...exampleCurriculumAssessment,
    questions: [sentAssessmentQuestionSCWithUpdatedCorrectAnswer],
  };

const sentUpdatedAssessmentSubmissionSCResponseSubmitted: AssessmentResponse = {
  ...sentNewSCAssessmentResponse,
  id: assessmentSubmissionResponseSCId,
  score: null as number,
  grader_response: null as string,
};
const sentUpdatedAssessmentSubmissionFRResponseSubmitted: AssessmentResponse = {
  ...sentNewFRAssessmentResponse,
  id: assessmentSubmissionResponseFRId,
  score: null as number,
  grader_response: null as string,
};

const sentUpdatedAssessmentSubmissionSCResponseGraded: AssessmentResponse = {
  ...sentUpdatedAssessmentSubmissionSCResponseSubmitted,
  score: 1,
  grader_response: 'Well done!',
};

const sentUpdatedAssessmentSubmissionFRResponseGraded: AssessmentResponse = {
  id: assessmentSubmissionResponseFRId,
  assessment_id: programAssessmentId,
  submission_id: assessmentSubmissionId,
  question_id: freeResponseQuestionId,
  response_text: '<div>Hello world!</div>',
  score: 0,
  grader_response: 'Very close!',
};

const sentUpdatedAssessmentSubmissionWithNewSCResponse: AssessmentSubmission = {
  ...exampleAssessmentSubmissionOpened,
  last_modified: '2023-02-09T12:05:00.000Z',
  responses: [sentNewSCAssessmentResponse],
};
const sentUpdatedAssessmentSubmissionWithNewFRResponse: AssessmentSubmission = {
  ...exampleAssessmentSubmissionOpened,
  last_modified: '2023-02-09T12:05:00.000Z',
  responses: [sentNewFRAssessmentResponse],
};

const sentUpdatedAssessmentSubmissionChangedResponse: AssessmentSubmission = {
  ...exampleAssessmentSubmissionOpened,
  assessment_submission_state: 'Submitted',
  submitted_at: '2023-02-09T13:23:45.000Z',
  last_modified: '2023-02-10T13:23:45.000Z',
  responses: [sentUpdatedAssessmentSubmissionSCResponseSubmitted],
};
const sentUpdatedAssessmentSubmissionChangedFRResponse: AssessmentSubmission = {
  ...exampleAssessmentSubmissionOpened,
  assessment_submission_state: 'Submitted',
  submitted_at: '2023-02-09T13:23:45.000Z',
  last_modified: '2023-02-10T13:23:45.000Z',
  responses: [sentUpdatedAssessmentSubmissionFRResponseSubmitted],
};

const sentUpdatedAssessmentSubmissionChangedResponseWithWrongID: AssessmentSubmission =
  {
    ...exampleAssessmentSubmissionOpened,
    id: assessmentSubmissionWrongId,
    assessment_submission_state: 'Submitted',
    submitted_at: '2023-02-09T13:23:45.000Z',
    last_modified: '2023-02-10T13:23:45.000Z',
    responses: [sentUpdatedAssessmentSubmissionSCResponseSubmitted],
  };

const sentNewCurriculumAssessmentPostInsert: CurriculumAssessment = {
  ...sentNewCurriculumAssessment,
  id: sentCurriculumAssessmentId,
};

const sentNewCurriculumAssessmentWithSCQuestionPostInsert: CurriculumAssessment =
  {
    ...sentNewCurriculumAssessment,
    id: sentCurriculumAssessmentId,
    questions: [exampleAssessmentQuestionSCWithCorrectAnswers],
  };

const sentNewCurriculumAssessmentWithFRQuestionPostInsert: CurriculumAssessment =
  {
    ...sentNewCurriculumAssessment,
    id: sentCurriculumAssessmentId,
    questions: [exampleAssessmentQuestionFRWithCorrectAnswers],
  };

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
