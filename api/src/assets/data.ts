import {
  CurriculumAssessment,
  ProgramAssessment,
  ParticipantAssessmentSubmissionsSummary,
  FacilitatorAssessmentSubmissionsSummary,
  AssessmentSubmission,
  AssessmentWithSummary,
  Question,
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
  time_zone: 'America/Los_Angeles',
  curriculum_id: exampleCurriculumAssessment.curriculum_id,
};

export const exampleProgramAssessmentsRow = {
  program_id: 1,
  assessment_id: 12,
  available_after: '2023-02-06',
  due_date: '2023-02-10',
};

export const newProgramAssessment: ProgramAssessment = {
  program_id: 1,
  assessment_id: 12,
  available_after: '2023-03-06',
  due_date: '2023-04-10',
};

export const updatedProgramAssessmentsRow = {
  ...newProgramAssessment,
  id: 15,
};

export const exampleProgramAssessment: ProgramAssessment = {
  id: 15,
  program_id: 1,
  assessment_id: 12,
  available_after: '2023-02-06',
  due_date: '2023-02-10',
};

export const exampleParticipantAssessmentSubmissionsSummary: ParticipantAssessmentSubmissionsSummary =
  {
    principal_id: participantPrincipalId,
    highest_state: 'Graded',
    most_recent_submitted_date: '2023-02-09 13:23:45',
    total_num_submissions: 1,
    highest_score: 4,
  };

export const exampleFacilitatorAssessmentSubmissionsSummary: FacilitatorAssessmentSubmissionsSummary =
  {
    num_participants_with_submissions: 8,
    num_program_participants: 12,
    num_ungraded_submissions: 6,
  };

export const exampleAssessmentSubmissionInProgress: AssessmentSubmission = {
  id: 2,
  assessment_id: exampleProgramAssessment.id,
  principal_id: participantPrincipalId,
  assessment_submission_state: 'In Progress',
  opened_at: '2023-02-09 12:00:00',
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
  ...exampleAssessmentSubmissionInProgress,
  assessment_submission_state: 'Submitted',
  submitted_at: '2023-02-09 13:23:45',
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

export const assessmentSubmissionsRowGraded = {
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
