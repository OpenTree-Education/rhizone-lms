// import {
//   AssessmentSubmissionsSummary,
//   FacilitatorAssessmentSubmissionsSummary,
//   CurriculumAssessment,
//   AssessmentSummary,
//   ProgramAssessment,
// } from '../../models';
// import {
//   findRoleInProgram,
//   principalEnrolledPrograms,
//   getProgramIdByCurriculumAssessmentId,
// } from '../assessmentService';
// import { mockQuery } from '../mockDb';
// // jest.mock('../../services/assessmentService.ts');

// const facilitatorPrincipalId = 3;
// const participantPrincipalId = 2;
// const programAssessmentId = 1;
// const curriculumAssessmentId = 1;
// const programId = 2;

// const curriculumAssessment: CurriculumAssessment = {
//   id: curriculumAssessmentId,
//   title: 'Assignment 1: React',
//   assessment_type: 'test',
//   description: 'Your assignment for week 1 learning.',
//   max_score: 10,
//   max_num_submissions: 3,
//   time_limit: 120,
//   curriculum_id: 3,
//   activity_id: 97,
//   principal_id: facilitatorPrincipalId || participantPrincipalId,
//   questions: [
//     {
//       id: 1,
//       assessment_id: curriculumAssessmentId,
//       title: 'What is React?',
//       description: '',
//       question_type: 'single choice',
//       answers: [
//         {
//           id: 1,
//           question_id: 1,
//           title: 'A relational database management system',
//           description: '',
//           sort_order: 1,
//           correct_answer: true,
//         },
//       ],
//       correct_answer_id: 1,
//       max_score: 1,
//       sort_order: 1,
//     },
//   ],
// };

// const programAssessment = {
//   id: programAssessmentId,
//   program_id: 1,
//   assessment_id: curriculumAssessmentId,
//   available_after: '2023-02-06',
//   due_date: '2023-02-10',
// };

// const assessmentSubmissionsSummary: AssessmentSubmissionsSummary = {
//   principal_id: participantPrincipalId,
//   highest_state: 'Graded',
//   most_recent_submitted_date: '2023-02-09 13:23:45',
//   total_num_submissions: 1,
//   highest_score: 10,
// };

// const facilitatorAssessmentSubmissionsSummary: FacilitatorAssessmentSubmissionsSummary =
//   {
//     num_participants_with_submissions: 6,
//     num_program_participants: 12,
//     num_ungraded_submissions: 2,
//   };

// const assessmentsSummaryList: AssessmentSummary[] = [
//   {
//     curriculum_assessment: curriculumAssessment,
//     program_assessment: programAssessment,
//     submissions_summary:
//       assessmentSubmissionsSummary || facilitatorAssessmentSubmissionsSummary,
//   },
// ];

// const response: {
//   program_assessment: AssessmentSummary[];
// } = {
//   program_assessment: assessmentsSummaryList,
// };

// describe('principalEnrolledPrograms', () => {
//   it('when principalEnrolledPrograms than returns enrolled program IDs', async () => {
//     const principalId = 3;
//     mockQuery(
//       'select `program_id` from `program_participants` where `principal_id` = ?',
//       [principalId],
//       [programId]
//     );
//     expect(await principalEnrolledPrograms(principalId)).toEqual([programId]);
//   });
// });

// describe('getAssessmentsForProgram', () => {
//   it('returns matching program assessment with given program ID', async () => {
//     const programId = 2;
//     const [matchingProgramAssessment]: ProgramAssessment[] = [
//       programAssessment,
//     ];
//     mockQuery(
//       'select `id`, `assessment_id`, `available_after`, `due_date` from `program_assessments` where `program_id` = ?',
//       [programId],
//       [matchingProgramAssessment]
//     );
//     expect(await principalEnrolledPrograms(programId)).toEqual([
//       matchingProgramAssessment,
//     ]);
//   });
// });

// describe('findRoleInProgram', () => {
//   it('returns the role of the participant in a given program', async () => {
//     const principalId = 1;
//     const enrolledProgramId = 3;
//     const roleName = 'facilitator';
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
//     mockQuery('select `program_id` from `program_assessment`', [], programId);
//     expect(
//       await getProgramIdByCurriculumAssessmentId(curriculumAssessment)
//     ).toEqual(programId);
//   });
// });
