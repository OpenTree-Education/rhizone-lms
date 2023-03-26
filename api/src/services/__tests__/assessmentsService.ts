import { mockQuery } from '../mockDb';

import {
  constructFacilitatorAssessmentSummary,
  constructParticipantAssessmentSummary,
  createAssessmentSubmission,
  createCurriculumAssessment,
  createProgramAssessment,
  deleteCurriculumAssessment,
  deleteProgramAssessment,
  findProgramAssessment,
  getAssessmentSubmission,
  getCurriculumAssessment,
  getPrincipalProgramRole,
  listParticipantProgramAssessmentSubmissions,
  listPrincipalEnrolledProgramIds,
  listProgramAssessments,
  updateAssessmentSubmission,
  updateCurriculumAssessment,
  updateProgramAssessment,
} from '../assessmentsService';
import {
  ProgramAssessment,
  AssessmentSubmission,
  AssessmentWithRole,
} from '../../models.d';
describe('assessmentsService', () => {
  describe('constructFacilitatorAssessmentSummary', () => {});

  describe('constructParticipantAssessmentSummary', () => {});

  describe('createAssessmentSubmission', () => {});

  describe('createCurriculumAssessment', () => {});

  describe('createProgramAssessment', () => {});

  describe('deleteCurriculumAssessment', () => {});

  describe('deleteProgramAssessment', () => {});

  describe('getAssessmentSubmission', () => {
    it('should get assessment submission based on given submission id', async () => {
      const assessmentSubmissionId = 1;
      const responsesIncluded = true;
      const gradingsIncluded = true;

      const assessmentSubmissionsRow = {
        assessment_id: 2,
        principal_id: 30,
        assessment_submission_state: 'Graded',
        score: 10,
        opened_at: '2023-02-09 12:00:00',
        submitted_at: '2023-02-09 13:23:45',
      };

      const assessmentResponsesRow = {
        id: 15,
        assessment_id: 2,
        question_id: 1,
        answer_id: 1,
        response: null as string,
        score: 1,
        grader_response: null as string,
      };

      const assessmentSubmissionGraded: AssessmentSubmission = {
        id: assessmentSubmissionId,
        assessment_id: 2,
        principal_id: 30,
        assessment_submission_state: 'Graded',
        score: 10,
        opened_at: '2023-02-09 12:00:00',
        submitted_at: '2023-02-09 13:23:45',
        responses: [
          {
            id: 15,
            assessment_id: 2,
            submission_id: assessmentSubmissionId,
            question_id: 1,
            answer_id: 1,
            response_text: null,
            score: 1,
            grader_response: null,
          },
        ],
      };

      mockQuery(
        'select `assessment_id`, `principal_id`, `assessment_submission_states`.`title` as `assessment_submission_state`, `score`, `opened_at`, `submitted_at` from `assessment_submissions` inner join `assessment_submission_states` on `assessment_submissions`.`assessment_submission_state_id` = `assessment_submission_states`.`id` where `assessment_submissions`.`id` = ?',
        [assessmentSubmissionId],
        [assessmentSubmissionsRow]
      );

      mockQuery(
        'select `id`, `assessment_id`, `question_id`, `answer_id`, `response`, `score`, `grader_response` from `assessment_responses` where `submission_id` = ?',
        [assessmentSubmissionId],
        [assessmentResponsesRow]
      );

      expect(
        await getAssessmentSubmission(
          assessmentSubmissionId,
          responsesIncluded,
          gradingsIncluded
        )
      ).toEqual(assessmentSubmissionGraded);
    });
  });

  describe('findProgramAssessment', () => {
    it('should select program id form program_assessments for  a given programAssessmentId', async () => {
      const exampleProgramAssessmentId = 4;
      const matchingProgramAssessmentsRows = [
        {
          program_id: 1,
          assessment_id: 3,
          available_after: '2023-03-23 01:23:45',
          due_date: '2023-03-23 01:23:45',
        },
      ];

      const exampleProgramAssessment: ProgramAssessment = {
        id: exampleProgramAssessmentId,
        program_id: matchingProgramAssessmentsRows[0].program_id,
        assessment_id: matchingProgramAssessmentsRows[0].assessment_id,
        available_after: matchingProgramAssessmentsRows[0].available_after,
        due_date: matchingProgramAssessmentsRows[0].due_date,
      };
      mockQuery(
        'select `program_id`, `assessment_id`, `available_after`, `due_date` from `program_assessments` where `id` = ?',
        [exampleProgramAssessmentId],
        matchingProgramAssessmentsRows
      );

      expect(await findProgramAssessment(exampleProgramAssessmentId)).toEqual(
        exampleProgramAssessment
      );
    });
  });

  describe('getPrincipalProgramRole', () => {
    it('should find a role based on principal id and program id ', async () => {
      const principalId = 2;
      const programId = 2;
      // const name = 'Participant';
      const role = [{ title: 'Facilitator' }];

      const principalRole = {
        principal_program_role: 'Participant',
      };
      mockQuery(
        'select `program_participant_roles`.`title` from `program_participants` inner join `program_participant_roles` on `program_participant_roles`.`id` = `program_participants`.`role_id` where `principal_id` = ? and `program_id` = ?',
        [principalId, programId],
        role
      );

      expect(await getPrincipalProgramRole(principalId, programId)).toEqual(
        principalRole.principal_program_role
      );
    });
  });

  describe('getCurriculumAssessment', () => {
    it('should select curriculum assessment based on given programAssessmentId', async () => {
      const curriculumAssessmentId = 1;
      const questionsAndAllAnswersIncluded = true,
        questionsAndCorrectAnswersIncluded = true;
      const facilitatorPrincipalId = 3;

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
      const matchinglistAssessmentQuestionsRows = {
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
        'select `title`, `max_score`, `max_num_submissions`, `time_limit`, `curriculum_id`, `activity_id`, `principal_id` from `curriculum_assessments` where `id` = ? ',
        [curriculumAssessmentId],
        [test]
      );
      mockQuery(
        'select `assessment_questions`.`id`, `assessment_questions`.`title`, `description`, `assessment_question_types`.`title` as `question_type`, `correct_answer_id`, `max_score`, `sort_order` from `assessment_questions` inner join `assessment_question_types` on `assessment_questions`.`question_type_id` = `assessment_question_types`.`id` where `assessment_questions`.`assessment_id` = ? ',
        [curriculumAssessmentId],
        []
      );
      mockQuery(
        'select `id`, `question_id`, `title`, `description`, `sort_order` from `assessment_answers` where `question_id` in (?)',
        [matchinglistAssessmentQuestionsRows.questions[0].id],
        []
      );

      expect(
        await getCurriculumAssessment(
          curriculumAssessmentId,
          questionsAndAllAnswersIncluded,
          questionsAndCorrectAnswersIncluded
        )
      ).toEqual(matchinglistAssessmentQuestionsRows);
    });
  });

  describe('listParticipantProgramAssessmentSubmissions', () => {});

  describe('listPrincipalEnrolledProgramIds', () => {});

  describe('listProgramAssessments', () => {});

  describe('updateAssessmentSubmission', () => {});

  describe('updateCurriculumAssessment', () => {});

  describe('updateProgramAssessment', () => {});
});
