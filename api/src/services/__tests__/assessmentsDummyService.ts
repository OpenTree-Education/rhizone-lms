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
      const submissionId = 2;
      const principalId = 3;
      const responseId = 5;
      const dummyAssessmentSubmissionData = {
        id: submissionId,
        assessment_id: assessmentId,
        principal_id: principalId,
        assessment_submission_state_id: 7,
        score: 10,
        opened_at: '2023-02-09 12:00:00',
        submitted_at: '2023-02-09 13:23:45',
        responses: [
          {
            assessment_id: assessmentId,
            submission_id: submissionId,
            question_id: 1,
            answer_id: 4,
            response: 'test',
            score: 8,
            grader_response: '',
          },
        ],
      };
      mockQuery(
        'select `id`, `assessment_id` from `assessment_submissions` where `assessment_id` = ? and `principal_id` = ?',
        [assessmentId, principalId],
        []
      );

      mockQuery(
        'insert into `assessment_submissions` (`assessment_id`, `assessment_submission_state_id`, `opened_at`, `principal_id`, `score`, `submitted_at`) values (?, ?, ?, ?, ?, ?)',
        [
          assessmentId,
          dummyAssessmentSubmissionData.assessment_submission_state_id,
          dummyAssessmentSubmissionData.opened_at,
          principalId,
          dummyAssessmentSubmissionData.score,
          dummyAssessmentSubmissionData.submitted_at,
        ],
        []
      );
      mockQuery(
        'select `id` from `assessment_submissions` where `assessment_id` = ? and `principal_id` = ?',
        [assessmentId, principalId],
        [{ id: submissionId }]
      );
      const [response] = dummyAssessmentSubmissionData.responses;
      mockQuery(
        'select `id`, `assessment_id` from `assessment_responses` where `submission_id` = ? and `question_id` = ?',
        [submissionId, response.question_id],
        []
      );
      mockQuery(
        'insert into `assessment_responses` (`answer_id`, `assessment_id`, `grader_response`, `question_id`, `response`, `score`, `submission_id`) values (?, ?, ?, ?, ?, ?, ?)',
        [
          response.answer_id,
          response.assessment_id,
          response.grader_response,
          response.question_id,
          response.response,
          response.score,
          response.submission_id,
        ],
        []
      );
      mockQuery(
        'select `id` from `assessment_responses` where `submission_id` = ? and `question_id` = ?',
        [submissionId, response.question_id],
        [{ id: responseId }]
      );

      expect(
        await insertToAssessmentSubmissions(
          assessmentId,
          principalId,
          dummyAssessmentSubmissionData.assessment_submission_state_id,
          dummyAssessmentSubmissionData.opened_at,
          dummyAssessmentSubmissionData.responses,
          dummyAssessmentSubmissionData.score,
          dummyAssessmentSubmissionData.submitted_at
        )
      ).toEqual({
        id: submissionId,
        principal_id: principalId,
        assessment_id: assessmentId,
        score: dummyAssessmentSubmissionData.score,
        opened_at: dummyAssessmentSubmissionData.opened_at,
        submitted_at: dummyAssessmentSubmissionData.submitted_at,
        responses: dummyAssessmentSubmissionData.responses,
      });
    });

    it('should check for principalId, programId in assessment_submissions table and update existing record', async () => {
      const principalId = 3;
      const assessmentId = 2;
      const submissionId = 2;

      const dummyAssessmentSubmissionData = {
        id: submissionId,
        assessment_id: assessmentId,
        principal_id: principalId,
        assessment_submission_state_id: 7,
        score: 10,
        opened_at: '2023-02-09 12:00:00',
        submitted_at: '2023-02-09 13:23:45',
        responses: [
          {
            id: 2,
            assessment_id: assessmentId,
            submission_id: submissionId,
            question_id: 1,
            answer_id: 4,
            response: 'test',
            score: 8,
            grader_response: '',
          },
        ],
      };
      mockQuery(
        'select `id`, `assessment_id` from `assessment_submissions` where `assessment_id` = ? and `principal_id` = ?',
        [assessmentId, principalId],
        [
          {
            id: submissionId,
            assessment_id: assessmentId,
          },
        ]
      );
      mockQuery(
        'update `assessment_submissions` set `assessment_submission_state_id` = ?, `score` = ?, `opened_at` = ?, `submitted_at` = ? where `assessment_id` = ? and `principal_id` = ?',
        [
          dummyAssessmentSubmissionData.assessment_submission_state_id,
          dummyAssessmentSubmissionData.score,
          dummyAssessmentSubmissionData.opened_at,
          dummyAssessmentSubmissionData.submitted_at,
          assessmentId,
          principalId,
        ],
        []
      );
      mockQuery(
        'select `id` from `assessment_submissions` where `assessment_id` = ? and `principal_id` = ?',
        [assessmentId, principalId],
        [{ id: submissionId }]
      );
      const [response] = dummyAssessmentSubmissionData.responses;
      mockQuery(
        'select `id`, `assessment_id` from `assessment_responses` where `submission_id` = ? and `question_id` = ?',
        [submissionId, response.question_id],
        [{ id: response.id }]
      );
      mockQuery(
        'update `assessment_responses` set `answer_id` = ?, `response` = ?, `score` = ?, `grader_response` = ? where `submission_id` = ? and `question_id` = ?',
        [
          response.answer_id,
          response.response,
          response.score,
          response.grader_response,
          submissionId,
          response.question_id,
        ],
        []
      );
      mockQuery(
        'select `id` from `assessment_responses` where `submission_id` = ? and `question_id` = ?',
        [submissionId, response.question_id],
        [{ id: dummyAssessmentSubmissionData.responses[0].id }]
      );
      expect(
        await insertToAssessmentSubmissions(
          assessmentId,
          principalId,
          dummyAssessmentSubmissionData.assessment_submission_state_id,
          dummyAssessmentSubmissionData.opened_at,
          dummyAssessmentSubmissionData.responses,
          dummyAssessmentSubmissionData.score,
          dummyAssessmentSubmissionData.submitted_at
        )
      ).toEqual({
        id: submissionId,
        principal_id: principalId,
        assessment_id: assessmentId,
        score: dummyAssessmentSubmissionData.score,
        opened_at: dummyAssessmentSubmissionData.opened_at,
        submitted_at: dummyAssessmentSubmissionData.submitted_at,
        responses: dummyAssessmentSubmissionData.responses,
      });
    });
  });
});
