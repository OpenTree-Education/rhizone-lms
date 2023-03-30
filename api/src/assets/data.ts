import {
  CurriculumAssessment,
  ProgramAssessment,
  ParticipantAssessmentSubmissionsSummary,
  FacilitatorAssessmentSubmissionsSummary,
  AssessmentSubmission,
  AssessmentWithSummary,
  Question,
  AssessmentDetails,
  AssessmentWithSubmissions,
  Answer,
  SavedAssessment,
} from '../models';
export const administratorPrincipalId = 3;
export const participantPrincipalId = 30;
export const unenrolledPrincipalId = 31;
export const otherParticipantPrincipalId = 32;
export const facilitatorPrincipalId = 300;

export const exampleProgramParticipantRoleParticipantRow = {
  title: 'Participant',
};
export const exampleProgramParticipantRoleFacilitatorRow = {
  title: 'Facilitator',
};

export const matchingCurriculumAssessmentRows = {
  title: 'Assignment 1: React',
  description: 'Your assignment for week 1 learning.',
  max_score: 10,
  max_num_submissions: 1,
  time_limit: 120,
  curriculum_id: 3,
  activity_id: 97,
  principal_id: administratorPrincipalId,
};
export const curriculumAssessmentId = 1;
export const unexpectedCurriculumAssessmentId = 0;

export const exampleCurriculumAssessmentWithQuestion: CurriculumAssessment = {
  id: curriculumAssessmentId,
  title: 'Assignment 1: React',
  assessment_type: 'test',
  description: 'Your assignment for week 1 learning.',
  max_score: 10,
  max_num_submissions: 1,
  time_limit: 120,
  curriculum_id: 3,
  activity_id: 97,
  principal_id: facilitatorPrincipalId,
  questions: [
    {
      id: 1,
      assessment_id: curriculumAssessmentId,
      title: 'What is React?',
      description: '',
      question_type: 'single choice',
      answers: [
        {
          id: 1,
          question_id: 1,
          title: 'A relational database management system',
          description: '',
          sort_order: 1,
          correct_answer: true,
        },
      ],
      correct_answer_id: 1,
      max_score: 1,
      sort_order: 1,
    },
  ],
};

export const exampleCurriculumAssessment: CurriculumAssessment = {
  id: 12,
  title: 'Assignment 1: React',
  assessment_type: 'test',
  description: 'Your assignment for week 1 learning.',
  max_score: 10,
  max_num_submissions: 1,
  time_limit: 120,
  curriculum_id: 3,
  activity_id: 97,
  principal_id: administratorPrincipalId,
};

export const matchingAssessmentQuestionsRow = {
  id: 1,
  assessment_id: exampleCurriculumAssessment.id,
  title: 'What is React?',
  description: '',
  question_type: 'single choice',
  correct_answer_id: 1,
  max_score: 1,
  sort_order: 1,
};

export const updatedCurriculumAssessmentsRow = {
  // add info here
};

export const matchingAssessmentAnswersRow = {
  id: 1,
  question_id: 1,
  title: 'A relational database management system',
  description: '',
  sort_order: 1,
  correct_answer: true,
};

export const exampleCurriculumAssessmentWithQuestions: CurriculumAssessment = {
  ...exampleCurriculumAssessment,
  questions: [
    {
      id: 1,
      assessment_id: exampleCurriculumAssessment.id,
      title: 'What is React?',
      question_type: 'single choice',
      answers: [
        {
          id: 1,
          question_id: 1,
          title: 'A relational database management system',
          sort_order: 1,
        },
      ],
      max_score: 1,
      sort_order: 1,
    },
  ],
};

export const exampleAssessmentQuestions: Question[] = [
  {
    ...matchingAssessmentQuestionsRow,
    answers: [{ ...matchingAssessmentAnswersRow }],
  },
];

export const exampleCurriculumAssessmentWithCorrectAnswers: CurriculumAssessment =
  {
    ...exampleCurriculumAssessment,
    questions: exampleAssessmentQuestions,
  };

export const matchingProgramRow = {
  id: 1,
  title: 'Cohort 4',
  start_date: '2022-10-24',
  end_date: '2022-12-16',
  time_zone: 'America/Vancouver',
  curriculum_id: exampleCurriculumAssessment.curriculum_id,
};

export const exampleProgramAssessmentsRow = {
  program_id: 1,
  assessment_id: 12,
  available_after: '2023-02-06 00:00:00',
  due_date: '2050-06-24 00:00:00',
};

export const updatedProgramAssessmentsRow = {
  ...exampleProgramAssessmentsRow,
  id: 15,
};

export const matchingProgramAssessmentsRow = {
  id: 15,
  program_id: 1,
  assessment_id: 12,
  available_after: '2023-02-06 00:00:00',
  due_date: '2050-06-24 00:00:00',
};

export const exampleProgramAssessment: ProgramAssessment = {
  id: 15,
  program_id: 1,
  assessment_id: 12,
  available_after: '2023-02-06T00:00:00.000-08:00',
  due_date: '2050-06-24T00:00:00.000-07:00',
};

export const exampleProgramAssessmentPastDueRow = {
  id: 15,
  program_id: 1,
  assessment_id: 12,
  available_after: '2023-02-06 00:00:00',
  due_date: '2023-02-10 00:00:00',
};

export const exampleProgramAssessmentPastDue: ProgramAssessment = {
  id: 15,
  program_id: 1,
  assessment_id: 12,
  available_after: '2023-02-06T00:00:00.000-08:00',
  due_date: '2023-02-10T00:00:00.000-08:00',
};

export const exampleProgramAssessmentNotAvailableRow = {
  id: 15,
  program_id: 1,
  assessment_id: 12,
  available_after: '2050-06-24 00:00:00',
  due_date: '2050-06-23 00:00:00',
};

export const exampleProgramAssessmentNotAvailable: ProgramAssessment = {
  id: 15,
  program_id: 1,
  assessment_id: 12,
  available_after: '2050-06-24T00:00:00.000-07:00',
  due_date: '2050-06-23T00:00:00.000-07:00',
};

export const exampleAssessmentDetails: AssessmentDetails = {
  curriculum_assessment: exampleCurriculumAssessmentWithCorrectAnswers,
  program_assessment: exampleProgramAssessment
}
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
    total_num_submissions: 0,
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

export const matchingAssessmentSubmissionOpenedRow = {
  id: 2,
  assessment_id: exampleProgramAssessment.id,
  principal_id: participantPrincipalId,
  assessment_submission_state: 'Opened',
  opened_at: '2023-02-09 12:00:00',
  submitted_at: null as string,
  score: null as number,
};

export const exampleAssessmentSubmissionOpened: AssessmentSubmission = {
  id: 2,
  assessment_id: exampleProgramAssessment.id,
  principal_id: participantPrincipalId,
  assessment_submission_state: 'Opened',
  opened_at: '2023-02-09T12:00:00.000Z',
};

export const exampleAssessmentSubmissionInProgress: AssessmentSubmission = {
  ...exampleAssessmentSubmissionOpened,
  assessment_submission_state: 'In Progress',
  responses: [
    {
      id: 1,
      assessment_id: exampleProgramAssessment.id,
      submission_id: 2,
      question_id: 1,
      answer_id: 1,
    },
  ],
};

export const exampleAssessmentSubmissionSubmitted: AssessmentSubmission = {
  ...exampleAssessmentSubmissionOpened,
  assessment_submission_state: 'Submitted',
  submitted_at: '2023-02-09T13:23:45.000Z',
  responses: [
    {
      id: 1,
      assessment_id: exampleProgramAssessment.id,
      submission_id: 2,
      question_id: 1,
      answer_id: 1,
    },
  ],
};

export const matchingOtherAssessmentSubmissionSubmittedRow = {
  id: 3,
  assessment_id: exampleProgramAssessment.id,
  principal_id: otherParticipantPrincipalId,
  assessment_submission_state: 'Submitted',
  opened_at: '2023-02-09 12:00:00',
  submitted_at: '2023-02-09 13:23:45',
  score: null as number,
};

export const exampleOtherAssessmentSubmissionSubmitted: AssessmentSubmission = {
  ...exampleAssessmentSubmissionOpened,
  assessment_submission_state: 'Submitted',
  submitted_at: '2023-02-09T13:23:45.000Z',
  principal_id: otherParticipantPrincipalId,
  id: 3,
};

export const assessmentSubmissionsRowGraded = {
  id: 2,
  assessment_id: exampleProgramAssessment.id,
  principal_id: participantPrincipalId,
  assessment_submission_state: 'Graded',
  score: 4,
  opened_at: '2023-02-09 12:00:00',
  submitted_at: '2023-02-09 13:23:45',
};

export const assessmentResponsesRowGraded = {
  id: 1,
  assessment_id: exampleProgramAssessment.id,
  submission_id: 2,
  question_id: 1,
  answer_id: 1,
  response: null as string,
  score: 1,
  grader_response: 'Well done!',
};

export const exampleAssessmentSubmissionGradedNoResponses: AssessmentSubmission =
  {
    ...exampleAssessmentSubmissionOpened,
    submitted_at: '2023-02-09T13:23:45.000Z',
    assessment_submission_state: 'Graded',
    score: 4,
  };

export const exampleAssessmentSubmissionGraded: AssessmentSubmission = {
  ...exampleAssessmentSubmissionSubmitted,
  assessment_submission_state: 'Graded',
  score: 4,
  responses: [
    {
      id: 1,
      assessment_id: exampleProgramAssessment.id,
      submission_id: 2,
      question_id: 1,
      response_text: null,
      answer_id: 1,
      score: 1,
      grader_response: 'Well done!',
    },
  ],
};

export const exampleAssessmentSubmissionGradedRemovedGrades: AssessmentSubmission =
  {
    ...exampleAssessmentSubmissionSubmitted,
    assessment_submission_state: 'Graded',
    responses: [
      {
        id: 1,
        assessment_id: exampleProgramAssessment.id,
        submission_id: 2,
        question_id: 1,
        response_text: null,
        answer_id: 1,
      },
    ],
  };

export const newCurriculumAssessment: CurriculumAssessment = {
  title: 'Test42',
  assessment_type: 'test',
  description: 'Your assignment for week 1 learning.',
  max_score: 10,
  max_num_submissions: 1,
  time_limit: 120,
  curriculum_id: 3,
  activity_id: 97,
  principal_id: 1,
  questions: [],
};

export const newCurriculumAssessmentWithSingleChoiceQuestion: CurriculumAssessment =
  {
    title: 'Test42',
    assessment_type: 'test',
    description: 'Your assignment for week 1 learning.',
    max_score: 10,
    max_num_submissions: 1,
    time_limit: 120,
    curriculum_id: 3,
    activity_id: 97,
    principal_id: 1,
    questions: [
      {
        title: 'test',
        description: 'test',
        question_type: 'single choice',
        sort_order: 1,
        max_score: 1,
        answers: [
          {
            title: 'string',
            description: 'string',
            sort_order: 1,
            correct_answer: true,
          },
        ],
      },
    ],
  };

export const newCurriculumAssessmentWithFreeResponseQuestion: CurriculumAssessment =
  {
    title: 'Test42',
    assessment_type: 'test',
    description: 'Your assignment for week 1 learning.',
    max_score: 10,
    max_num_submissions: 1,
    time_limit: 120,
    curriculum_id: 3,
    activity_id: 97,
    principal_id: 1,
    questions: [
      {
        title: 'test free response',
        description: 'test',
        question_type: 'free response',
        sort_order: 1,
        max_score: 1,
        answers: [
          {
            title: 'test free response answer',
            description: 'string',
            sort_order: 1,
            correct_answer: true,
          },
        ],
      },
    ],
  };

export const updatedSingleChoiceAnswer: Answer = {
  ...newCurriculumAssessmentWithSingleChoiceQuestion.questions[0].answers[0],
  question_id: 42,
  id: 37,
};

export const updatedSingleChoiceQuestion: Question = {
  ...newCurriculumAssessmentWithSingleChoiceQuestion.questions[0],
  id: 42,
  answers: [updatedSingleChoiceAnswer],
};

export const updatedFreeResponseAnswer: Answer = {
  ...newCurriculumAssessmentWithFreeResponseQuestion.questions[0].answers[0],
  question_id: 43,
  id: 38,
};

export const updatedFreeResponseQuestion: Question = {
  ...newCurriculumAssessmentWithFreeResponseQuestion.questions[0],
  id: 43,
  answers: [updatedFreeResponseAnswer],
};

export const updatedCurriculumAssessment: CurriculumAssessment = {
  ...newCurriculumAssessment,
  id: 15,
};

export const updatedCurriculumAssessmentWithSingleChoiceQuestion: CurriculumAssessment =
  {
    ...updatedCurriculumAssessment,
    questions: [updatedSingleChoiceQuestion],
  };

export const updatedCurriculumAssessmentWithFreeResponseQuestion: CurriculumAssessment =
  {
    ...updatedCurriculumAssessment,
    questions: [updatedFreeResponseQuestion],
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
