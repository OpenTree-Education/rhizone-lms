import {
  FacilitatorAssessmentSubmissionsSummary,
  CurriculumAssessment,
  ProgramAssessment,
  AssessmentSubmission,
  ParticipantAssessmentSubmissionsSummary,
} from '../../models';
import {
  findRoleInProgram,
  principalEnrolledPrograms,
  getAssessmentsForProgram,
} from '../assessmentService';
import { mockQuery } from '../mockDb';

const principalId = 3;
const participantPrincipalId = 2;
const programAssessmentId = 1;
const curriculumAssessmentId = 1;
const programId = 2;
const administratorPrincipalId = 3;
const unenrolledPrincipalId = 31;
const otherParticipantPrincipalId = 32;

const exampleCurriculumAssessment: CurriculumAssessment = {
  id: 12,
  title: 'Assignment 1: React',
  assessment_type: 'test',
  description: 'Your assignment for week 1 learning.',
  max_score: 10,
  max_num_submissions: 3,
  time_limit: 120,
  curriculum_id: 3,
  activity_id: 97,
  principal_id: principalId,
};

const exampleCurriculumAssessmentWithQuestions: CurriculumAssessment = {
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

const exampleCurriculumAssessmentWithCorrectAnswers: CurriculumAssessment = {
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

const exampleProgramAssessment: ProgramAssessment = {
  id: 15,
  program_id: 1,
  assessment_id: 12,
  available_after: '2023-02-06',
  due_date: '2023-02-10',
};

const exampleParticipantAssessmentSubmissionsSummary: ParticipantAssessmentSubmissionsSummary =
  {
    principal_id: participantPrincipalId,
    highest_state: 'Graded',
    most_recent_submitted_date: '2023-02-09 13:23:45',
    total_num_submissions: 1,
    highest_score: 10,
  };

const exampleFacilitatorAssessmentSubmissionsSummary: FacilitatorAssessmentSubmissionsSummary =
  {
    num_participants_with_submissions: 8,
    num_program_participants: 12,
    num_ungraded_submissions: 6,
  };

describe('principalEnrolledPrograms', () => {
  it('when principalEnrolledPrograms than returns enrolled program IDs', async () => {
    const principalId = 3;
    mockQuery(
      'select `program_id` from `program_participants` where `principal_id` = ?',
      [principalId],
      [programId]
    );
    expect(await principalEnrolledPrograms(principalId)).toEqual([programId]);
  });
});

// describe('getAssessmentsForProgram', () => {
//   it('returns matching program assessment with given program ID', async () => {
//     const programId = 2;
//     const matchingProgramAssessment: ProgramAssessment[] = [
//       exampleProgramAssessment,
//     ];
//     mockQuery(
//       'select `id`, `program_id`, `assessment_id`, `available_after`, `due_date` from `program_assessments` where `program_id` = ?',
//       [programId],
//       matchingProgramAssessment
//     );
//     expect(await getAssessmentsForProgram(programId)).toEqual([
//       matchingProgramAssessment,
//     ]);
//   });
// });

// describe('findRoleInProgram', () => {
//   it('returns the role of the participant in a given program', async () => {
//     const principalId = 1;
//     const enrolledProgramId = 2;
//     const roleName = 'Facilitator';
//     mockQuery(
//       'select `program_participant_roles`.`title` from `program_participants` inner join `program_participant_roles` on `program_participant_roles`.`id` = `program_participants`.`role_id` where `principal_id` = ? and `program_id` = ?',
//       [principalId, enrolledProgramId],
//       [roleName]
//     );
//     expect(await findRoleInProgram(principalId, enrolledProgramId)).toEqual(
//       roleName
//     );
//   });
// });

// describe('getProgramIdByCurriculumAssessmentId', () => {
//   it('returns the role of the participant in a given program', async () => {
//     const curriculumAssessment = 1;
//     mockQuery(
//       'select `program_id` from `program_assessment` where `assessment_id` = ?',
//       [curriculumAssessment],
//       programId
//     );
//     expect(
//       await getProgramIdByCurriculumAssessmentId(curriculumAssessment)
//     ).toEqual(programId);
//   });
// });
