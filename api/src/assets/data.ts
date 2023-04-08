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

export const matchingAssessmentQuestionsRow = {
  id: singleChoiceQuestionId,
  assessment_id: curriculumAssessmentId,
  title: 'What is React?',
  description: '',
  question_type: 'single choice',
  correct_answer_id: singleChoiceAnswerId,
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

export const matchingAssessmentResponsesRowSCGraded = {
  id: assessmentSubmissionResponseSCId,
  assessment_id: programAssessmentId,
  submission_id: assessmentSubmissionId,
  question_id: singleChoiceQuestionId,
  answer_id: singleChoiceAnswerId,
  response: null as string,
  score: 1,
  grader_response: 'Well done!',
};

export const matchingAssessmentResponsesRowFRGraded = {
  id: assessmentSubmissionResponseFRId,
  assessment_id: programAssessmentId,
  submission_id: assessmentSubmissionId,
  question_id: freeResponseQuestionId,
  answer_id: null as number,
  response: '<div>Hello world!</div>',
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

export const exampleAssessmentQuestionsWithoutCorrectAnswers: Question[] = [
  {
    id: singleChoiceQuestionId,
    assessment_id: curriculumAssessmentId,
    title: matchingAssessmentQuestionsRow.title,
    question_type: matchingAssessmentQuestionsRow.question_type,
    answers: [
      {
        id: singleChoiceAnswerId,
        question_id: singleChoiceQuestionId,
        title: matchingAssessmentAnswersSCRow.title,
        sort_order: matchingAssessmentAnswersSCRow.sort_order,
      },
    ],
    max_score: matchingAssessmentQuestionsRow.max_score,
    sort_order: matchingAssessmentQuestionsRow.sort_order,
  },
];

export const exampleAssessmentQuestionsWithCorrectAnswers: Question[] = [
  {
    id: singleChoiceQuestionId,
    assessment_id: curriculumAssessmentId,
    title: matchingAssessmentQuestionsRow.title,
    question_type: matchingAssessmentQuestionsRow.question_type,
    answers: [
      {
        id: singleChoiceAnswerId,
        question_id: singleChoiceQuestionId,
        title: matchingAssessmentAnswersSCRow.title,
        sort_order: matchingAssessmentAnswersSCRow.sort_order,
        correct_answer: matchingAssessmentAnswersSCRow.correct_answer,
      },
    ],
    correct_answer_id: singleChoiceAnswerId,
    max_score: matchingAssessmentQuestionsRow.max_score,
    sort_order: matchingAssessmentQuestionsRow.sort_order,
  },
];

export const exampleCurriculumAssessmentWithQuestions: CurriculumAssessment = {
  ...exampleCurriculumAssessment,
  questions: exampleAssessmentQuestionsWithoutCorrectAnswers,
};

export const exampleCurriculumAssessmentMultipleSubmissionsWithQuestions: CurriculumAssessment =
  {
    ...exampleCurriculumAssessment,
    questions: exampleAssessmentQuestionsWithoutCorrectAnswers,
    max_num_submissions: 3,
  };

export const exampleCurriculumAssessmentWithCorrectAnswers: CurriculumAssessment =
  {
    ...exampleCurriculumAssessment,
    questions: exampleAssessmentQuestionsWithCorrectAnswers,
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

export const exampleAssessmentWithCorrectAnswersDetails: AssessmentDetails = {
  curriculum_assessment: exampleCurriculumAssessmentWithCorrectAnswers,
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
  last_modified: '2023-02-09T13:23:45.000Z',
  submitted_at: '2023-02-09T13:23:45.000Z',
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
  curriculum_assessment: exampleCurriculumAssessmentWithQuestions,
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
  due_date: '2050-06-25 00:00:00',
};
//mays
export const updatedAssessmentSubmissionRow = {
  ...exampleAssessmentSubmissionSubmitted,
  assessment_submission_state_id: 7,
  grader_response: 'comment',
  score: 9,
};
//mays
export const updatedAssessmentSubmissionRowP = {
  ...exampleAssessmentSubmissionInProgress,
  assessment_submission_state_id: 6,
};

export const newProgramAssessmentsRow = {
  ...matchingProgramAssessmentsRow,
  id: programAssessmentId,
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

// Example Data: Data Sent From User: Existing Formatted Data

export const sentNewCurriculumAssessmentPostInsert: CurriculumAssessment = {
  ...sentNewCurriculumAssessment,
  id: sentCurriculumAssessmentId,
};
