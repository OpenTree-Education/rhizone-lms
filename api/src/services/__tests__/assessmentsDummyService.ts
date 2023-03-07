import {
  insertToProgramParticipants,
  insertToAssessmentSubmissions,
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
  describe('insertToAssessmentSubmissions', () => {
    it('should check for principalId, programId in assessment_submissions table and insert new record', async () => {
      const assessmentId = 3;
      const principalId = 3;
      const dummyAssessmentSubmissionData = [
        {
          assessment_id: assessmentId,
          principal_id: principalId,
          assessment_submission_state_id: 7,
          score: 10,
          opened_at: '2023-02-09 12:00:00',
          submitted_at: '2023-02-09 13:23:45',
          questions: [
            {
              id: 1,
              answerId: 4,
              response: 'test',
              score: 8,
              grader_response: '',
            },
          ],
        },
      ];

      mockQuery(
        'select `id`, `assessment_id`, `principal_id` from `assessment_submissions` where `assessment_id` = ? and `principal_id` = ?',
        [assessmentId, principalId],
        []
      );

      mockQuery(
        'insert into `assessment_submissions` (`assessment_id`, `principal_id`,`assessment_submission_state_id`,`score`, `opened_at`,`submitted_at`) values (?, ?, ?, ?, ?, ?)',
        [
          assessmentId,
          principalId,
          dummyAssessmentSubmissionData[0].assessment_submission_state_id,
          dummyAssessmentSubmissionData[0].score,
          dummyAssessmentSubmissionData[0].opened_at,
          dummyAssessmentSubmissionData[0].submitted_at,
        ],
        []
      );
      mockQuery(
        'select `id`, `assessment_id`, `principal_id` from `assessment_submissions` where`assessment_id` = ? and `principal_id` = ?  ',
        [assessmentId, principalId],
        dummyAssessmentSubmissionData[0]
      );
      // const data = dummyAssessmentSubmissionData[0].questions.forEach(
      //   element => {
      //     return {
      //       id: element.id,

      //       answerId: element.answerId,
      //       response: element.response,
      //       score: element.score,
      //       grader_reponse: element.grader_response,
      //     };
      //   }
      // );
      mockQuery(
        'select `assessment_id`,`submission_id` from `assessment_responses` where `assessment_id` =? ',
        [assessmentId],
        []
      );
      mockQuery(
        // insert into `assessment_responses` (`answer_id`, `assessment_id`, `grader_response`, `question_id`, `response`, `score`, `submission_id`) values (?, ?, ?, ?, DEFAULT, ?, ?)
        'insert  into `assessment_responses` (`assessment_id`,`submission_id`,`question_id`,`answer_id`,`response`,`score`,`grader_response`)values(?,?,?,?,?,?,?) ',
        [
          assessmentId,
          dummyAssessmentSubmissionData[0].assessment_submission_state_id,
          dummyAssessmentSubmissionData[0].questions[0].id,
          dummyAssessmentSubmissionData[0].questions[0].answerId,
          dummyAssessmentSubmissionData[0].questions[0].response,
          dummyAssessmentSubmissionData[0].questions[0].score,
          dummyAssessmentSubmissionData[0].questions[0].grader_response,
        ],
        []
      );

      expect(
        await insertToAssessmentSubmissions(
          assessmentId,
          principalId,
          dummyAssessmentSubmissionData[0].assessment_submission_state_id,
          dummyAssessmentSubmissionData[0].score,
          dummyAssessmentSubmissionData[0].opened_at,
          dummyAssessmentSubmissionData[0].submitted_at,
          dummyAssessmentSubmissionData[0].questions
        )
      ).toEqual(dummyAssessmentSubmissionData[0]);
    });

    it('should check for principalId, programId in assessment_submissions table and update existing record', async () => {
      const principalId = 3;
      const assessmentId = 2;

      const dummyAssessmentSubmissionData = [
        {
          id: 1,
          assessmentId: assessmentId,
          principalId: principalId,
          assessmentSubmissionStateId: 7,
          score: 10,
          openedAt: '2023-02-09 12:00:00',
          submittedAt: '2023-02-09 13:23:45',
          questions: [{ id: 1, answerId: 4 }],
        },
      ];

      mockQuery(
        'select `id`, `assessment_id`, `principal_id`, from `assessment_submissions` where `assessment_id` = ? and `principal_id` = ?',
        [assessmentId, principalId],
        dummyAssessmentSubmissionData
      );
      mockQuery(
        'update `assessment_submissions` set `assessment_id` = ?, `principal_id` = ?, `assessment_submission_state_id` = ?, `score` = ?, `opened_at` = ?, `submitted_at` = ? where `assessment_id` = ? and `principal_id` = ?',
        [
          assessmentId,
          principalId,
          dummyAssessmentSubmissionData[0].assessmentSubmissionStateId,
          dummyAssessmentSubmissionData[0].score,
          dummyAssessmentSubmissionData[0].openedAt,
          dummyAssessmentSubmissionData[0].submittedAt,
        ],
        []
      );
      mockQuery(
        'select `id` from `assessment_submissions` where `assessment_id` = ? and `principal_id` = ?',
        [assessmentId, principalId],
        dummyAssessmentSubmissionData
      );
      // const data = dummyAssessmentSubmissionData[0].questions.forEach(
      //   element => {
      //     return {
      //       id: element.id,
      //       answerId: element.answerId,
      //     };
      //   }
      // );
      mockQuery(
        'select `assessment_id`,`submission_id` from `assessment_responses` where `assessment_id` =? ',
        [assessmentId],
        dummyAssessmentSubmissionData
      );
      mockQuery(
        'update `assessment_responses` set `answer_id` = ?, `score` = ?, `grader_response` = ? where `assessment_id` = ?)values(?,?,?,?) ',
        [
          assessmentId,
          dummyAssessmentSubmissionData[0].questions[0].answerId,
          1,
          '',
        ],
        []
      );

      expect(
        await insertToAssessmentSubmissions(
          assessmentId,
          principalId,
          dummyAssessmentSubmissionData[0].assessmentSubmissionStateId,
          dummyAssessmentSubmissionData[0].score,
          dummyAssessmentSubmissionData[0].openedAt,
          dummyAssessmentSubmissionData[0].submittedAt,
          dummyAssessmentSubmissionData[0].questions
        )
      ).toEqual(dummyAssessmentSubmissionData[0]);
    });
  });
});
