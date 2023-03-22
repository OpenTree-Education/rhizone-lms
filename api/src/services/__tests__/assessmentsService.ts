import {
  getProgramIdByProgramAssessmentId,
  programAssessmentById,
  findRoleInProgram,
  submissionDetails,
  getCurriculumAssessmentById,
} from '../assessmentService';
import { mockQuery } from '../mockDb';

describe('assessmentsService', () => {
  describe('getProgramIdByProgramAssessmentId', () => {
    it('should select program id form program_assessments for  a given programAssessmentId', async () => {
      const programAssessmentId = 1;
      const programId = 2;
      const program = [
        {
          program_id: programId,
        },
      ];
      mockQuery(
        'select `program_id` from `program_assessments` where `id` = ?',
        [programAssessmentId],
        [programId]
      );

      expect(
        await getProgramIdByProgramAssessmentId(programAssessmentId)
      ).toEqual(program);
    });
  });
  describe('findRoleInProgram', () => {
    it('should find a role based on principal id and program id ', async () => {
      const principalId = 2;
      const programId = 2;
      const name = 'Participant';
      const role = { title: name };
      mockQuery(
        'select `program_participant_roles`.`title` from `program_participants` inner join `program_participant_roles` on `program_participant_roles`.`id` = `program_participants`.`role_id` where `principal_id` = ? and `program_id` = ?',
        [principalId, programId],
        [{ title: 'Participant' }]
      );

      expect(await findRoleInProgram(principalId, programId)).toEqual(role);
    });
  });
  describe('programAssessmentById', () => {
    it('should select program assessment based on given programAssessmentId', async () => {
      const programAssessmentId = 1;
      const curriculumAssessmentId = 1;
      const programAssessment = {
        id: programAssessmentId,
        program_id: 1,
        assessment_id: curriculumAssessmentId,
        available_after: '2023-02-06',
        due_date: '2023-02-10',
      };
      mockQuery(
        'select `id`, `program_id`, `assessment_id`, `available_after`, `due_date`, `created_at`, `updated_at` from `program_assessments` where `id` = ?',
        [programAssessmentId],
        [programAssessment]
      );

      expect(await programAssessmentById(programAssessmentId)).toEqual(
        programAssessment
      );
    });
  });

  describe('submissionDetails', () => {
    it('should select assessment submission based on given submission id', async () => {
      const submissionId = 1;
      const isQuestionsIncluded = true;
      const isAnswersIncluded = true;

      const facilitatorPrincipalId = 3;
      const test = {
        id: 1,
        assessment_id: 1,
        principal_id: facilitatorPrincipalId,
        assessment_submission_state: 'Graded',
        score: 1,
        opened_at: '2023-02-09 12:00:00',
        submitted_at: '2023-02-09 13:23:45',
      };
      const assessmentSubmissionGraded = {
        id: 1,
        assessment_id: 1,
        principal_id: facilitatorPrincipalId,
        assessment_submission_state: 'Graded',
        score: 1,
        opened_at: '2023-02-09 12:00:00',
        submitted_at: '2023-02-09 13:23:45',
        responses: [
          {
            id: 1,
            answer_id: 1,
            assessment_id: 1,
            submission_id: 2,
            question_id: 1,
          },
        ],
      };
      mockQuery(
        'select *, `assessment_submission_states`.`title` as `assessment_submission_state` from `assessment_submissions` inner join `assessment_submission_states` on `assessment_submission_states`.`id` = `assessment_submission_state_id` where `assessment_submissions`.`id` = ?'[
          submissionId
        ],
        [test]
      );
      mockQuery(
        'select * from `assessment_responses` where `submission_id` = ?'[
          assessmentSubmissionGraded.responses[0].submission_id
        ],
        assessmentSubmissionGraded.responses
      );

      expect(await submissionDetails(submissionId, true, true)).toEqual(
        assessmentSubmissionGraded
      );
    });
  });
  describe('getCurriculumAssessmentById', () => {
    it('should select curriculum assessment based on given programAssessmentId', async () => {
      const assessmentId = 1;
      const isQuestionsIncluded = true;
      const isAnswersIncluded = true;
      // const questionId = 1;
      const facilitatorPrincipalId = 3;
      const curriculumAssessmentId = 1;
      const test = {
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
      };
      const curriculumAssessmentWithCorrectAnswer = {
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
      mockQuery(
        'select `id`, `title`, `max_score`, `max_num_submissions`, `time_limit`, `curriculum_id`, `activity_id`, `principal_id`, `created_at`, `updated_at` from `curriculum_assessments` where `id` = ?',
        [assessmentId],
        [test]
      );
      mockQuery(
        'select * from `assessment_questions` where `assessment_id` = ?',
        [test.id]
      );
      mockQuery(
        'select * from `assessment_answers` where `assessment_id` = ?',
        [
          curriculumAssessmentWithCorrectAnswer.questions[0].answers[0]
            .question_id,
        ],
        curriculumAssessmentWithCorrectAnswer
      );

      expect(
        await getCurriculumAssessmentById(assessmentId, true, true, true)
      ).toEqual(curriculumAssessmentWithCorrectAnswer);
    });
  });
});
