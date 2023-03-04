import {
  insertToProgramParticipants,
  insertToAssessmentSubmissions,
  insertToAssessmentResponses,
} from '../assessmentsDummyService';
import { mockQuery } from '../mockDb';

describe('assessmentsDummyService', () => {
  describe('insertToProgramParticipants', () => {
    it('should check for principalId, programId in program_participants table and insert new record', async () => {
      const principalId = 3;
      const programId = 2;
      const roleId = 1;
      const participant = [
        {
          id: 1,
          principal_id: principalId,
          program_id: programId,
          role_id: roleId,
        },
      ];
      mockQuery(
        'select `id`, `principal_id`, `program_id`, `role_id` from `program_participants` where `principal_id` = ? and `program_id` = ?',
        [principalId, programId],
        []
      );
      mockQuery(
        'insert into `program_participants` (`principal_id`, `program_id`, `role_id`) values (?, ?, ?)',
        [principalId, programId, roleId],
        []
      );
      mockQuery(
        'select `id` from `program_participants` where `principal_id` = ? and `program_id` = ?',
        [principalId, programId],
        participant
      );
      expect(
        await insertToProgramParticipants(principalId, programId, roleId)
      ).toEqual(participant[0]);
    });

    it('should check for principalId, programId in program_participants table and update existing record', async () => {
      const principalId = 3;
      const programId = 2;
      const roleId = 1;
      const participant = [
        {
          id: 1,
          principal_id: principalId,
          program_id: programId,
          role_id: roleId,
        },
      ];
      mockQuery(
        'select `id`, `principal_id`, `program_id`, `role_id` from `program_participants` where `principal_id` = ? and `program_id` = ?',
        [principalId, programId],
        participant
      );
      mockQuery(
        'update `program_participants` set `program_id` = ?, `role_id` = ? where `principal_id` = ?',
        [programId, roleId, principalId],
        []
      );
      mockQuery(
        'select `id` from `program_participants` where `principal_id` = ? and `program_id` = ?',
        [principalId, programId],
        participant
      );
      expect(
        await insertToProgramParticipants(principalId, programId, roleId)
      ).toEqual(participant[0]);
    });
  });
  // describe('insertToAssessmentSubmissions', () => {
  //   it('should check for principalId, programId in assessment_submissions table and insert new record', async () => {
  //     const principalId = 3;
  //     const assessmentId = 1;

  //     const dummyAssessmentSubmissionData = {
  //       assessmentId: assessmentId,
  //       principalId: principalId,
  //       assessmentSubmissionStateId: 7,
  //       score: 10,
  //       openedAt: '2023-02-09 12:00:00',
  //       submittedAt: '2023-02-09 13:23:45',
  //       questions: [
  //         { id: 1, answerId: 4 },
  //         { id: 2, answerId: 5 },
  //         { id: 3, answerId: 9 },
  //         { id: 4, answerId: 14 },
  //         { id: 5, answerId: 18 },
  //         { id: 6, answerId: 21 },
  //         { id: 7, answerId: 23 },
  //         {
  //           id: 8,
  //           responseText:
  //             'const HelloWorld = () => { return <p>Hello, World!</p>; }; export default HelloWorld;',
  //         },
  //         {
  //           id: 9,
  //           responseText:
  //             'React differs from other JavaScript frameworks because it uses a component-based architecture, a virtual DOM, JSX syntax, unidirectional data flow, and is primarily focused on building UIs rather than providing a complete application framework. These features make it faster, more efficient, and more flexible than other frameworks.',
  //         },
  //         {
  //           id: 10,
  //           responseText:
  //             'Benefits of using React include its modular and reusable components, efficient updates with virtual DOM, JSX syntax, and active community.',
  //         },
  //       ],
  //     };

  //     mockQuery(
  //       'select `id`, `assessment_id`, `principal_id`, from `assessment_submissions` where`assessment_id` = ? and `principal_id` = ?  ',
  //       [assessmentId, principalId],
  //       []
  //     );

  //     mockQuery(
  //       'insert into `assessment_submissions` (assessment_id,`principal_id`, `assessment_submission_state_id`,`score`,`opende_at`,`submitted_at`) values (?, ?, ?,?,?,?)',
  //       [
  //         assessmentId,
  //         principalId,
  //         dummyAssessmentSubmissionData.assessmentSubmissionStateId,
  //         dummyAssessmentSubmissionData.score,
  //         dummyAssessmentSubmissionData.openedAt,
  //         dummyAssessmentSubmissionData.submittedAt,
  //         dummyAssessmentSubmissionData.questions,
  //       ],
  //       []
  //     );
  //     mockQuery(
  //       'select `id` from `assessment_submissions` where`assessment_id` = ? and `principal_id` = ?  ',
  //       [assessmentId, principalId],
  //       dummyAssessmentSubmissionData
  //     );
  //     expect(
  //       await insertToAssessmentSubmissions(
  //         assessmentId,
  //         principalId,
  //         dummyAssessmentSubmissionData.assessmentSubmissionStateId,
  //         dummyAssessmentSubmissionData.score,
  //         dummyAssessmentSubmissionData.openedAt,
  //         dummyAssessmentSubmissionData.submittedAt,
  //         dummyAssessmentSubmissionData.questions
  //       )
  //     ).toEqual(dummyAssessmentSubmissionData);
  //   });

  //   it('should check for principalId, programId in assessment_submissions table and update existing record', async () => {
  //     const principalId = 3;
  //     const assessmentId = 1;

  //     const dummyAssessmentSubmissionData = {
  //       assessmentId: assessmentId,
  //       principalId: principalId,
  //       assessmentSubmissionStateId: 7,
  //       score: 10,
  //       openedAt: '2023-02-09 12:00:00',
  //       submittedAt: '2023-02-09 13:23:45',
  //       questions: [
  //         { id: 1, answerId: 4 },
  //         { id: 2, answerId: 5 },
  //         { id: 3, answerId: 9 },
  //         { id: 4, answerId: 14 },
  //         { id: 5, answerId: 18 },
  //         { id: 6, answerId: 21 },
  //         { id: 7, answerId: 23 },
  //         {
  //           id: 8,
  //           responseText:
  //             'const HelloWorld = () => { return <p>Hello, World!</p>; }; export default HelloWorld;',
  //         },
  //         {
  //           id: 9,
  //           responseText:
  //             'React differs from other JavaScript frameworks because it uses a component-based architecture, a virtual DOM, JSX syntax, unidirectional data flow, and is primarily focused on building UIs rather than providing a complete application framework. These features make it faster, more efficient, and more flexible than other frameworks.',
  //         },
  //         {
  //           id: 10,
  //           responseText:
  //             'Benefits of using React include its modular and reusable components, efficient updates with virtual DOM, JSX syntax, and active community.',
  //         },
  //       ],
  //     };

  //     mockQuery(
  //       'select `id`, `assessment_id`, `principal_id`, from `assessment_submissions` where`assessment_id` = ? and `principal_id` = ?  ',
  //       [assessmentId, principalId],
  //       [dummyAssessmentSubmissionData]
  //     );
  //     mockQuery(
  //       'update `assessment_submissions` set `assessment_id` = ? where `principal_id` = ?',
  //       [assessmentId, principalId],
  //       []
  //     );
  //     mockQuery(
  //       'select `id` from `assessment_submissions` where `assessment_id` = ?and `principal_id` = ? ',
  //       [assessmentId, principalId],
  //       dummyAssessmentSubmissionData
  //     );
  //     expect(
  //       await insertToAssessmentSubmissions(
  //         assessmentId,
  //         principalId,
  //         dummyAssessmentSubmissionData.assessmentSubmissionStateId,
  //         dummyAssessmentSubmissionData.score,
  //         dummyAssessmentSubmissionData.openedAt,
  //         dummyAssessmentSubmissionData.submittedAt,
  //         dummyAssessmentSubmissionData.questions
  //       )
  //     ).toEqual(dummyAssessmentSubmissionData);
  //   });
  // });
});
