import {
  CurriculumAssessment,
  ProgramAssessment,
  ParticipantAssessmentSubmissionsSummary,
  FacilitatorAssessmentSubmissionsSummary,
  AssessmentSubmission,
  Question,
  AssessmentDetails,
  AssessmentWithSubmissions,
  SavedAssessment,
  AssessmentResponse,
  Answer,
} from '../models';

// Example Data: Principal IDs

export const administratorPrincipalId = 3;
export const participantPrincipalId = 30;
export const unenrolledPrincipalId = 31;
export const otherParticipantPrincipalId = 32;
export const facilitatorPrincipalId = 300;

// Example Data: Other IDs

export const curriculumId = 4;
export const curriculumAssessmentId = 8;
export const sentCurriculumAssessmentId = 9;
export const programId = 12;
export const programAssessmentId = 16;
export const sentProgramAssessmentId = 17;
export const activityId = 20;
export const sentCAActivityId = 200;
export const singleChoiceQuestionId = 24;
export const freeResponseQuestionId = 24;
export const singleChoiceAnswerId = 28;
export const freeResponseCorrectAnswerId = 29;
export const assessmentSubmissionId = 32;
export const assessmentSubmissionWrongId = 33;
export const assessmentSubmissionByOtherParticipantId = 36;
export const assessmentSubmissionResponseSCId = 320;
export const assessmentSubmissionResponseFRId = 321;

export const facilitatorProgramIdsThatMatchCurriculum: number[] = [
  programId,
  20,
  30,
];
export const facilitatorProgramIdsNotMatchingCurriculum: number[] = [40, 50];

// Example Data: Database Table Rows

export const matchingProgramParticipantRoleParticipantRow = {
  title: 'Participant',
};
export const matchingProgramParticipantRoleFacilitatorRow = {
  title: 'Facilitator',
};

export const matchingCurriculumAssessmentRow = {
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

export const matchingAssessmentQuestionsSCRow = {
  id: singleChoiceQuestionId,
  assessment_id: curriculumAssessmentId,
  title: 'What is React?',
  question_type: 'single choice',
  correct_answer_id: singleChoiceAnswerId,
  max_score: 1,
  sort_order: 1,
};

export const matchingAssessmentQuestionsFRRow = {
  id: singleChoiceQuestionId,
  assessment_id: curriculumAssessmentId,
  title:
    'What is the correct HTML syntax for a paragraph with the text "Hello, World!"?',
  description: '',
  question_type: 'free response',
  correct_answer_id: freeResponseCorrectAnswerId,
  max_score: 1,
  sort_order: 1,
};

export const matchingAssessmentAnswersSCRow = {
  id: singleChoiceAnswerId,
  question_id: singleChoiceQuestionId,
  title: 'A relational database management system',
  description: null as string,
  sort_order: 1,
  correct_answer: true,
};

export const matchingAssessmentAnswersFRRow = {
  id: freeResponseCorrectAnswerId,
  question_id: freeResponseQuestionId,
  title: '<p>Hello, World!</p>',
  description: null as string,
  sort_order: 1,
  correct_answer: true,
};

export const matchingProgramRow = {
  id: programId,
  title: 'Cohort 4',
  start_date: '2022-10-24',
  end_date: '2022-12-16',
  time_zone: 'America/Vancouver',
  curriculum_id: curriculumId,
};

export const matchingProgramAssessmentsRow = {
  id: programAssessmentId,
  program_id: programId,
  assessment_id: curriculumAssessmentId,
  available_after: '2023-02-06 00:00:00',
  due_date: '2050-06-24 00:00:00',
};

export const matchingProgramAssessmentPastDueRow = {
  ...matchingProgramAssessmentsRow,
  due_date: '2023-02-10 00:00:00',
};

export const matchingProgramAssessmentNotAvailableRow = {
  ...matchingProgramAssessmentsRow,
  available_after: '2050-06-24 00:00:00',
  due_date: '2050-06-23 00:00:00',
};

export const matchingAssessmentSubmissionOpenedRow = {
  id: assessmentSubmissionId,
  assessment_id: programAssessmentId,
  principal_id: participantPrincipalId,
  assessment_submission_state: 'Opened',
  opened_at: '2023-02-09 12:00:00',
  submitted_at: null as string,
  updated_at: '2023-02-09 12:00:00',
  score: null as number,
};

export const matchingAssessmentSubmissionInProgressRow = {
  ...matchingAssessmentSubmissionOpenedRow,
  assessment_submission_state: 'In Progress',
};

export const matchingOtherAssessmentSubmissionSubmittedRow = {
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

export const matchingAssessmentSubmissionsRowGraded = {
  ...matchingAssessmentSubmissionOpenedRow,
  assessment_submission_state: 'Graded',
  submitted_at: '2023-02-09 13:23:45',
  updated_at: '2023-02-09 13:23:45',
  score: 4,
};

export const matchingAssessmentResponsesRowSCInProgress = {
  id: assessmentSubmissionResponseSCId,
  assessment_id: programAssessmentId,
  submission_id: assessmentSubmissionId,
  question_id: singleChoiceQuestionId,
  answer_id: singleChoiceAnswerId,
  response: null as string,
  score: null as number,
  grader_response: null as string,
};

export const matchingAssessmentResponsesRowSCGraded = {
  ...matchingAssessmentResponsesRowSCInProgress,
  score: 1,
  grader_response: 'Well done!',
};

export const matchingAssessmentResponsesRowFRInProgress = {
  id: assessmentSubmissionResponseFRId,
  assessment_id: programAssessmentId,
  submission_id: assessmentSubmissionId,
  question_id: freeResponseQuestionId,
  answer_id: null as number,
  response: '<div>Hello world!</div>',
  score: null as number,
  grader_response: null as string,
};

export const matchingAssessmentResponsesRowFRGraded = {
  ...matchingAssessmentResponsesRowFRInProgress,
  score: 0,
  grader_response: 'Very close!',
};

// Example Data: Formatted Data

export const exampleCurriculumAssessment: CurriculumAssessment = {
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

export const exampleAssessmentSCAnswerWithoutCorrectAnswer: Answer = {
  id: singleChoiceAnswerId,
  question_id: singleChoiceQuestionId,
  description: matchingAssessmentAnswersSCRow.description,
  title: matchingAssessmentAnswersSCRow.title,
  sort_order: matchingAssessmentAnswersSCRow.sort_order,
};

export const exampleAssessmentSCAnswerWithCorrectAnswer: Answer = {
  ...exampleAssessmentSCAnswerWithoutCorrectAnswer,
  correct_answer: matchingAssessmentAnswersSCRow.correct_answer,
};

export const exampleAssessmentFRAnswerWithoutCorrectAnswer: Answer = {
  id: singleChoiceAnswerId,
  question_id: singleChoiceQuestionId,
  description: matchingAssessmentAnswersSCRow.description,
  title: matchingAssessmentAnswersSCRow.title,
  sort_order: matchingAssessmentAnswersSCRow.sort_order,
};

export const exampleAssessmentFRAnswerWithCorrectAnswer: Answer = {
  ...exampleAssessmentFRAnswerWithoutCorrectAnswer,
  correct_answer: matchingAssessmentAnswersSCRow.correct_answer,
};

export const exampleAssessmentQuestionSCWithoutCorrectAnswers: Question = {
  id: singleChoiceQuestionId,
  assessment_id: curriculumAssessmentId,
  title: matchingAssessmentQuestionsSCRow.title,
  question_type: matchingAssessmentQuestionsSCRow.question_type,
  answers: [exampleAssessmentSCAnswerWithoutCorrectAnswer],
  max_score: matchingAssessmentQuestionsSCRow.max_score,
  sort_order: matchingAssessmentQuestionsSCRow.sort_order,
};

export const exampleAssessmentQuestionSCWithCorrectAnswers: Question = {
  id: singleChoiceQuestionId,
  assessment_id: curriculumAssessmentId,
  title: matchingAssessmentQuestionsSCRow.title,
  question_type: matchingAssessmentQuestionsSCRow.question_type,
  answers: [exampleAssessmentSCAnswerWithCorrectAnswer],
  correct_answer_id: singleChoiceAnswerId,
  max_score: matchingAssessmentQuestionsSCRow.max_score,
  sort_order: matchingAssessmentQuestionsSCRow.sort_order,
};

export const exampleAssessmentQuestionFRWithCorrectAnswers: Question = {
  id: singleChoiceQuestionId,
  assessment_id: curriculumAssessmentId,
  title: matchingAssessmentQuestionsFRRow.title,
  question_type: matchingAssessmentQuestionsFRRow.question_type,
  answers: [exampleAssessmentFRAnswerWithCorrectAnswer],
  correct_answer_id: freeResponseCorrectAnswerId,
  max_score: matchingAssessmentQuestionsFRRow.max_score,
  sort_order: matchingAssessmentQuestionsFRRow.sort_order,
};

export const exampleAssessmentQuestionsWithFRNewAnswers: Question[] = [
  {
    id: freeResponseQuestionId,
    assessment_id: curriculumAssessmentId,
    title: matchingAssessmentQuestionsFRRow.title,
    question_type: matchingAssessmentQuestionsFRRow.question_type,
    answers: [
      {
        question_id: singleChoiceQuestionId,
        description: matchingAssessmentAnswersSCRow.description,
        title: matchingAssessmentAnswersSCRow.title,
        sort_order: matchingAssessmentAnswersSCRow.sort_order,
        correct_answer: true,
      },
    ],
    max_score: matchingAssessmentQuestionsSCRow.max_score,
    sort_order: matchingAssessmentQuestionsSCRow.sort_order,
  },
];

export const exampleCurriculumAssessmentWithFRQuestionsNewAnswers: CurriculumAssessment =
  {
    ...exampleCurriculumAssessment,
    questions: exampleAssessmentQuestionsWithFRNewAnswers,
  };

export const exampleCurriculumAssessmentWithSCQuestions: CurriculumAssessment =
  {
    ...exampleCurriculumAssessment,
    questions: [exampleAssessmentQuestionSCWithoutCorrectAnswers],
  };

export const exampleCurriculumAssessmentMultipleSubmissionsWithQuestions: CurriculumAssessment =
  {
    ...exampleCurriculumAssessment,
    questions: [exampleAssessmentQuestionSCWithCorrectAnswers],
    max_num_submissions: 3,
  };

export const exampleCurriculumAssessmentWithSCCorrectAnswers: CurriculumAssessment =
  {
    ...exampleCurriculumAssessment,
    questions: [exampleAssessmentQuestionSCWithCorrectAnswers],
  };

export const exampleProgramAssessment: ProgramAssessment = {
  id: programAssessmentId,
  program_id: programId,
  assessment_id: curriculumAssessmentId,
  available_after: '2023-02-06T00:00:00.000-08:00',
  due_date: '2050-06-24T00:00:00.000-07:00',
};

export const exampleProgramAssessmentPastDue: ProgramAssessment = {
  id: programAssessmentId,
  program_id: programId,
  assessment_id: curriculumAssessmentId,
  available_after: '2023-02-06T00:00:00.000-08:00',
  due_date: '2023-02-10T00:00:00.000-08:00',
};

export const exampleProgramAssessmentNotAvailable: ProgramAssessment = {
  id: programAssessmentId,
  program_id: programId,
  assessment_id: curriculumAssessmentId,
  available_after: '2050-06-24T00:00:00.000-07:00',
  due_date: '2050-06-23T00:00:00.000-07:00',
};

export const exampleAssessmentWithSCCorrectAnswersDetails: AssessmentDetails = {
  curriculum_assessment: exampleCurriculumAssessmentWithSCCorrectAnswers,
  program_assessment: exampleProgramAssessment,
};

export const exampleParticipantAssessmentSubmissionsInactive: ParticipantAssessmentSubmissionsSummary =
  {
    principal_id: participantPrincipalId,
    highest_state: 'Inactive',
    total_num_submissions: 0,
  };

export const exampleParticipantAssessmentSubmissionsPastDue: ParticipantAssessmentSubmissionsSummary =
  {
    principal_id: participantPrincipalId,
    highest_state: 'Expired',
    total_num_submissions: 1,
  };

export const exampleParticipantAssessmentSubmissionsActive: ParticipantAssessmentSubmissionsSummary =
  {
    principal_id: participantPrincipalId,
    highest_state: 'Active',
    total_num_submissions: 0,
  };

export const exampleParticipantAssessmentSubmissionsSummary: ParticipantAssessmentSubmissionsSummary =
  {
    principal_id: participantPrincipalId,
    highest_state: 'Graded',
    most_recent_submitted_date: '2023-02-09T13:23:45.000Z',
    total_num_submissions: 1,
    highest_score: 4,
  };

export const exampleFacilitatorAssessmentSubmissionsSummary: FacilitatorAssessmentSubmissionsSummary =
  {
    num_participants_with_submissions: 8,
    num_program_participants: 12,
    num_ungraded_submissions: 6,
  };

export const exampleAssessmentSubmissionOpened: AssessmentSubmission = {
  id: assessmentSubmissionId,
  assessment_id: programAssessmentId,
  principal_id: participantPrincipalId,
  assessment_submission_state: 'Opened',
  opened_at: '2023-02-09T12:00:00.000Z',
  last_modified: '2023-02-09T12:00:00.000Z',
};

export const exampleAssessmentSubmissionInProgress: AssessmentSubmission = {
  ...exampleAssessmentSubmissionOpened,
  assessment_submission_state: 'In Progress',
  last_modified: '2023-02-09T12:05:00.000Z',
  responses: [
    {
      id: assessmentSubmissionResponseSCId,
      assessment_id: programAssessmentId,
      submission_id: assessmentSubmissionId,
      question_id: singleChoiceQuestionId,
      answer_id: singleChoiceAnswerId,
    },
  ],
};

export const exampleAssessmentSubmissionSubmitted: AssessmentSubmission = {
  ...exampleAssessmentSubmissionOpened,
  assessment_submission_state: 'Submitted',
  submitted_at: '2023-02-09T13:23:45.000Z',
  last_modified: '2023-02-09T13:23:45.000Z',
  responses: [
    {
      id: assessmentSubmissionResponseSCId,
      assessment_id: programAssessmentId,
      submission_id: assessmentSubmissionId,
      question_id: singleChoiceQuestionId,
      answer_id: singleChoiceAnswerId,
    },
  ],
};

export const exampleOtherAssessmentSubmissionSubmitted: AssessmentSubmission = {
  id: assessmentSubmissionByOtherParticipantId,
  assessment_id: programAssessmentId,
  principal_id: otherParticipantPrincipalId,
  assessment_submission_state: 'Submitted',
  opened_at: '2023-02-09T12:01:00.000Z',
  submitted_at: '2023-02-09T13:23:45.000Z',
  last_modified: '2023-02-09T13:23:45.000Z',
};

export const exampleAssessmentSubmissionGradedNoResponses: AssessmentSubmission =
  {
    ...exampleAssessmentSubmissionOpened,
    submitted_at: '2023-02-09T13:23:45.000Z',
    last_modified: '2023-02-09T13:23:45.000Z',
    assessment_submission_state: 'Graded',
    score: 4,
  };

export const exampleAssessmentSubmissionGraded: AssessmentSubmission = {
  ...exampleAssessmentSubmissionOpened,
  assessment_submission_state: 'Graded',
  submitted_at: '2023-02-09T13:23:45.000Z',
  last_modified: '2023-02-09T13:23:45.000Z',
  score: 4,
  responses: [
    {
      id: assessmentSubmissionResponseSCId,
      assessment_id: programAssessmentId,
      submission_id: assessmentSubmissionId,
      question_id: singleChoiceQuestionId,
      response_text: null,
      answer_id: singleChoiceAnswerId,
      score: 1,
      grader_response: 'Well done!',
    },
  ],
};

export const exampleAssessmentSubmissionGradedRemovedGrades: AssessmentSubmission =
  {
    ...exampleAssessmentSubmissionOpened,
    assessment_submission_state: 'Graded',
    submitted_at: '2023-02-09T13:23:45.000Z',
    last_modified: '2023-02-09T13:23:45.000Z',
    responses: [
      {
        id: assessmentSubmissionResponseSCId,
        assessment_id: programAssessmentId,
        submission_id: assessmentSubmissionId,
        question_id: singleChoiceQuestionId,
        response_text: null,
        answer_id: singleChoiceAnswerId,
      },
    ],
  };

export const exampleParticipantAssessmentWithSubmissions: AssessmentWithSubmissions =
  {
    curriculum_assessment: exampleCurriculumAssessment,
    program_assessment: exampleProgramAssessment,
    principal_program_role: 'Participant',
    submissions: [exampleAssessmentSubmissionInProgress],
  };

export const exampleParticipantOpenedSavedAssessment: SavedAssessment = {
  curriculum_assessment: exampleCurriculumAssessmentWithSCQuestions,
  program_assessment: exampleProgramAssessment,
  principal_program_role: 'Participant',
  submission: exampleAssessmentSubmissionOpened,
};

export const exampleParticipantOpenedSavedMultipleSubmissionsAssessment: SavedAssessment =
  {
    curriculum_assessment:
      exampleCurriculumAssessmentMultipleSubmissionsWithQuestions,
    program_assessment: exampleProgramAssessment,
    principal_program_role: 'Participant',
    submission: exampleAssessmentSubmissionOpened,
  };

export const exampleFacilitatorAssessmentWithSubmissions: AssessmentWithSubmissions =
  {
    curriculum_assessment: exampleCurriculumAssessment,
    program_assessment: exampleProgramAssessment,
    principal_program_role: 'Facilitator',
    submissions: [
      exampleAssessmentSubmissionInProgress,
      exampleOtherAssessmentSubmissionSubmitted,
    ],
  };

// Example Data: Updated Database Table Rows

export const updatedProgramAssessmentsRow = {
  ...matchingProgramAssessmentsRow,
  due_date: '2050-06-26 00:00:00',
};

export const updatedAssessmentResponsesSCGradedRow = {
  id: assessmentSubmissionResponseSCId,
  assessment_id: programAssessmentId,
  submission_id: assessmentSubmissionId,
  question_id: singleChoiceQuestionId,
  answer_id: 2,
  score: null as number,
  grader_response: 'Good Work',
};

export const updatedAssessmentResponsesFRGradedRow = {
  id: assessmentSubmissionResponseFRId,
  assessment_id: programAssessmentId,
  submission_id: assessmentSubmissionId,
  question_id: freeResponseQuestionId,
  response: 'test',
  score: 1,
  grader_response: 'Good Work',
};

export const updatedAssessmentSubmissionsRow = {
  ...matchingAssessmentSubmissionInProgressRow,
  assessment_submission_state: 'Submitted',
  submitted_at: '2023-02-09 13:23:45',
  last_modified: '2023-02-09 13:23:45',
};

export const newCurriculumAssessmentsRow = {
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

export const newProgramAssessmentsRow = {
  ...matchingProgramAssessmentsRow,
  id: programAssessmentId,
};

// Example Data: Data Sent From User: New Formatted Data

export const sentNewCurriculumAssessment: CurriculumAssessment = {
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

export const sentNewSCAssessmentAnswer: Answer = {
  description: matchingAssessmentAnswersSCRow.description,
  title: matchingAssessmentAnswersSCRow.title,
  sort_order: matchingAssessmentAnswersSCRow.sort_order,
  correct_answer: true,
};

export const sentNewSCAssessmentQuestion: Question = {
  assessment_id: curriculumAssessmentId,
  title: matchingAssessmentQuestionsSCRow.title,
  question_type: matchingAssessmentQuestionsSCRow.question_type,
  answers: [sentNewSCAssessmentAnswer],
  max_score: matchingAssessmentQuestionsSCRow.max_score,
  sort_order: matchingAssessmentQuestionsSCRow.sort_order,
};

export const sentNewFRAssessmentAnswer: Answer = {
  description: matchingAssessmentAnswersFRRow.description,
  title: matchingAssessmentAnswersFRRow.title,
  sort_order: matchingAssessmentAnswersFRRow.sort_order,
  correct_answer: true,
};

export const sentNewFRAssessmentQuestion: Question = {
  assessment_id: curriculumAssessmentId,
  title: matchingAssessmentQuestionsFRRow.title,
  description: matchingAssessmentQuestionsFRRow.description,
  question_type: matchingAssessmentQuestionsFRRow.question_type,
  answers: [sentNewFRAssessmentAnswer],
  max_score: matchingAssessmentQuestionsFRRow.max_score,
  sort_order: matchingAssessmentQuestionsFRRow.sort_order,
};

export const sentNewCurriculumAssessmentWithSCQuestion: CurriculumAssessment = {
  ...sentNewCurriculumAssessment,
  questions: [sentNewSCAssessmentQuestion],
};

export const sentNewCurriculumAssessmentWithFRQuestion: CurriculumAssessment = {
  ...sentNewCurriculumAssessment,
  questions: [sentNewSCAssessmentQuestion],
};

export const sentUpdatedCurriculumAssessment: CurriculumAssessment = {
  ...exampleCurriculumAssessment,
  time_limit: 121,
};

export const sentNewProgramAssessment: ProgramAssessment = {
  program_id: programId,
  assessment_id: curriculumAssessmentId,
  available_after: '2023-02-06 00:00:00',
  due_date: '2050-06-24 00:00:00',
};

export const sentUpdatedAssessmentSubmissionSCResponseSubmitted: AssessmentResponse =
  {
    id: assessmentSubmissionResponseSCId,
    assessment_id: programAssessmentId,
    submission_id: assessmentSubmissionId,
    question_id: singleChoiceQuestionId,
    answer_id: 1,
    score: null as number,
    grader_response: null as string,
  };

export const sentUpdatedAssessmentSubmissionSCResponseGraded: AssessmentResponse =
  {
    ...sentUpdatedAssessmentSubmissionSCResponseSubmitted,
    score: 1,
    grader_response: 'Good Work',
  };

export const sentUpdatedAssessmentSubmissionFRResponseGraded: AssessmentResponse =
  {
    id: assessmentSubmissionResponseFRId,
    assessment_id: programAssessmentId,
    submission_id: assessmentSubmissionId,
    question_id: freeResponseQuestionId,
    response_text: 'test',
    score: 1,
    grader_response: 'Good Work',
  };

export const sentUpdatedAssessmentSubmissionChangedResponse: AssessmentSubmission =
  {
    ...exampleAssessmentSubmissionOpened,
    assessment_submission_state: 'Submitted',
    submitted_at: '2023-02-09T13:23:45.000Z',
    last_modified: '2023-02-10T13:23:45.000Z',
    responses: [sentUpdatedAssessmentSubmissionSCResponseSubmitted],
  };

export const sentUpdatedAssessmentSubmissionChangedResponseWithWrongID: AssessmentSubmission =
  {
    ...exampleAssessmentSubmissionOpened,
    id: assessmentSubmissionWrongId,
    assessment_submission_state: 'Submitted',
    submitted_at: '2023-02-09T13:23:45.000Z',
    last_modified: '2023-02-10T13:23:45.000Z',
    responses: [sentUpdatedAssessmentSubmissionSCResponseSubmitted],
  };

// Example Data: Data Sent From User: Existing Formatted Data

export const sentNewCurriculumAssessmentPostInsert: CurriculumAssessment = {
  ...sentNewCurriculumAssessment,
  id: sentCurriculumAssessmentId,
};

export const sentNewCurriculumAssessmentWithSCQuestionPostInsert: CurriculumAssessment =
  {
    ...sentNewCurriculumAssessment,
    id: sentCurriculumAssessmentId,
    questions: [exampleAssessmentQuestionSCWithCorrectAnswers],
  };

export const sentNewCurriculumAssessmentWithFRQuestionPostInsert: CurriculumAssessment =
  {
    ...sentNewCurriculumAssessment,
    id: sentCurriculumAssessmentId,
    questions: [exampleAssessmentQuestionFRWithCorrectAnswers],
  };
