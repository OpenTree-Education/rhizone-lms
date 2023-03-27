import {
  CurriculumAssessment,
  ProgramAssessment,
  ParticipantAssessmentSubmissionsSummary,
  FacilitatorAssessmentSubmissionsSummary,
  AssessmentSubmission,
  AssessmentWithSummary,
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

export const exampleCurriculumAssessment: CurriculumAssessment = {
  id: 12,
  title: 'Assignment 1: React',
  assessment_type: 'test',
  description: 'Your assignment for week 1 learning.',
  max_score: 10,
  max_num_submissions: 3,
  time_limit: 120,
  curriculum_id: 3,
  activity_id: 97,
  principal_id: administratorPrincipalId,
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

export const exampleCurriculumAssessmentWithCorrectAnswers: CurriculumAssessment =
  {
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
            correct_answer: true,
          },
        ],
        correct_answer_id: 1,
        max_score: 1,
        sort_order: 1,
      },
    ],
  };

export const exampleProgramAssessmentsRow = {
  program_id: 1,
  assessment_id: 12,
  available_after: '2023-02-06',
  due_date: '2023-02-10',
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
    highest_score: 10,
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

export const assessmentListPageExampleDataParticipant: AssessmentWithSummary[] =
  [
    {
      curriculum_assessment: {
        id: 1,
        title: 'Assignment 1: React',
        description: 'Your assignment for week 1 learning.',
        assessment_type: 'Assessment',
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
      participant_submissions_summary: {
        principal_id: 2,
        highest_state: '10',
        most_recent_submitted_date: '2023-03-09',
        total_num_submissions: 1,
        highest_score: 10,
      },
      principal_program_role: 'Participant',
    },
    {
      curriculum_assessment: {
        id: 2,
        title: 'SQL Quiz',
        description: 'A check on your SQL learning.',
        assessment_type: 'Quiz',
        max_score: 5,
        max_num_submissions: 3,
        time_limit: -1,
        curriculum_id: 3,
        activity_id: 98,
        principal_id: 2,
      },
      program_assessment: {
        id: 2,
        program_id: 2,
        assessment_id: 2,
        available_after: '2023-02-06 00:00:00',
        due_date: '2023-03-24 00:00:00',
      },
      participant_submissions_summary: {
        principal_id: 2,
        highest_state: '??',
        most_recent_submitted_date: '',
        total_num_submissions: 0,
        highest_score: -1,
      },
      principal_program_role: 'Participant',
    },
    {
      curriculum_assessment: {
        id: 3,
        title: 'Final Exam',
        description: 'The final exam for the course.',
        assessment_type: 'Assessment',
        max_score: 50,
        max_num_submissions: 1,
        time_limit: 120,
        curriculum_id: 3,
        activity_id: 99,
        principal_id: 2,
      },
      program_assessment: {
        id: 3,
        program_id: 2,
        assessment_id: 3,
        available_after: '2023-03-20 00:00:00',
        due_date: '2023-03-31 00:00:00',
      },
      participant_submissions_summary: {
        principal_id: 2,
        highest_state: ' ',
        most_recent_submitted_date: ' ',
        total_num_submissions: 1,
        highest_score: -1,
        // assessment_submission_state: 'Upcoming',
      },
      principal_program_role: 'Participant',
    },
    {
      curriculum_assessment: {
        id: 4,
        title: 'Algorithms',
        description: 'Unit 1 : Algorithms',
        assessment_type: 'Assessment',
        max_score: 10,
        max_num_submissions: 1,
        time_limit: 90,
        curriculum_id: 3,
        activity_id: 100,
        principal_id: 2,
      },
      program_assessment: {
        id: 4,
        program_id: 2,
        assessment_id: 1,
        available_after: '2023-02-27 00:00:00',
        due_date: '2023-03-01 00:00:00',
      },
      participant_submissions_summary: {
        principal_id: 2,
        highest_state: '10',
        most_recent_submitted_date: '2023-03-02',
        total_num_submissions: 1,
        highest_score: 0,
      },
      principal_program_role: 'Participant',
    },
    {
      curriculum_assessment: {
        id: 5,
        title: 'Database',
        description: 'Design and Modeling',
        assessment_type: 'Assessment',
        max_score: 10,
        max_num_submissions: 1,
        time_limit: 45,
        curriculum_id: 3,
        activity_id: 101,
        principal_id: 2,
      },
      program_assessment: {
        id: 5,
        program_id: 2,
        assessment_id: 1,
        available_after: '2023-02-18 00:00:00',
        due_date: '2023-03-20 00:00:00',
      },
      participant_submissions_summary: {
        principal_id: 2,
        highest_state: '10',
        most_recent_submitted_date: '2023-03-20',
        total_num_submissions: 1,
        highest_score: 10,
      },
      principal_program_role: 'Participant',
    },
  ];

export const assessmentListPageExampleDataFacilitator: AssessmentWithSummary[] =
  [
    {
      curriculum_assessment: {
        id: 1,
        title: 'Assignment 1: React',
        description: 'Your assignment for week 1 learning.',
        assessment_type: 'Assessment',
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
      facilitator_submissions_summary: {
        num_participants_with_submissions: 10,
        num_program_participants: 3,
        num_ungraded_submissions: 1,
      },
      principal_program_role: 'Facilitator',
    },
    {
      curriculum_assessment: {
        id: 2,
        title: 'SQL Quiz',
        description: 'A check on your SQL learning.',
        assessment_type: 'Quiz',
        max_score: 5,
        max_num_submissions: 3,
        time_limit: -1,
        curriculum_id: 3,
        activity_id: 98,
        principal_id: 2,
      },
      program_assessment: {
        id: 2,
        program_id: 2,
        assessment_id: 2,
        available_after: '2023-02-06 00:00:00',
        due_date: '2023-03-24 00:00:00',
      },
      facilitator_submissions_summary: {
        num_participants_with_submissions: 10,
        num_program_participants: 3,
        num_ungraded_submissions: 1,
      },
      principal_program_role: 'Facilitator',
    },
    {
      curriculum_assessment: {
        id: 3,
        title: 'Final Exam',
        description: 'The final exam for the course.',
        assessment_type: 'Assessment',
        max_score: 50,
        max_num_submissions: 1,
        time_limit: 120,
        curriculum_id: 3,
        activity_id: 99,
        principal_id: 2,
      },
      program_assessment: {
        id: 3,
        program_id: 2,
        assessment_id: 3,
        available_after: '2023-03-20 00:00:00',
        due_date: '2023-03-31 00:00:00',
      },
      facilitator_submissions_summary: {
        num_participants_with_submissions: 10,
        num_program_participants: 3,
        num_ungraded_submissions: 1,
      },
      principal_program_role: 'Facilitator',
    },
    {
      curriculum_assessment: {
        id: 4,
        title: 'Algorithms',
        description: 'Unit 1 : Algorithms',
        assessment_type: 'Assessment',
        max_score: 10,
        max_num_submissions: 1,
        time_limit: 90,
        curriculum_id: 3,
        activity_id: 100,
        principal_id: 2,
      },
      program_assessment: {
        id: 4,
        program_id: 2,
        assessment_id: 1,
        available_after: '2023-02-27 00:00:00',
        due_date: '2023-03-01 00:00:00',
      },
      facilitator_submissions_summary: {
        num_participants_with_submissions: 10,
        num_program_participants: 3,
        num_ungraded_submissions: 1,
      },
      principal_program_role: 'Facilitator',
    },
    {
      curriculum_assessment: {
        id: 5,
        title: 'Database',
        description: 'Design and Modeling',
        assessment_type: 'Assessment',
        max_score: 10,
        max_num_submissions: 1,
        time_limit: 45,
        curriculum_id: 3,
        activity_id: 101,
        principal_id: 2,
      },
      program_assessment: {
        id: 5,
        program_id: 2,
        assessment_id: 1,
        available_after: '2023-02-18 00:00:00',
        due_date: '2023-03-20 00:00:00',
      },
      facilitator_submissions_summary: {
        num_participants_with_submissions: 10,
        num_program_participants: 3,
        num_ungraded_submissions: 1,
      },
      principal_program_role: 'Facilitator',
    },
  ];
