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
} from '../../models';
import {
  assessmentResponsesRowGraded,
  assessmentSubmissionsRowGraded,
  exampleAssessmentSubmissionGraded,
  exampleProgramAssessment,
  exampleProgramAssessmentsRow,
  exampleProgramParticipantRoleFacilitatorRow,
  exampleProgramParticipantRoleParticipantRow,
  facilitatorPrincipalId,
  participantPrincipalId,
} from '../../assets/data';

describe('assessmentsService', () => {
  describe('constructFacilitatorAssessmentSummary', () => {});

  describe('constructParticipantAssessmentSummary', () => {});

  describe('createAssessmentSubmission', () => {});

  describe('createCurriculumAssessment', () => {});

  describe('createProgramAssessment', () => {});

  describe('deleteCurriculumAssessment', () => {});

  describe('deleteProgramAssessment', () => {});

  describe('getAssessmentSubmission', () => {
    it('should get assessment submission based on given submission ID', async () => {
      const assessmentSubmissionId = exampleAssessmentSubmissionGraded.id;
      const responsesIncluded = true;
      const gradingsIncluded = true;

      mockQuery(
        'select `assessment_id`, `principal_id`, `assessment_submission_states`.`title` as `assessment_submission_state`, `score`, `opened_at`, `submitted_at` from `assessment_submissions` inner join `assessment_submission_states` on `assessment_submissions`.`assessment_submission_state_id` = `assessment_submission_states`.`id` where `assessment_submissions`.`id` = ?',
        [assessmentSubmissionId],
        [assessmentSubmissionsRowGraded]
      );

      mockQuery(
        'select `id`, `assessment_id`, `question_id`, `answer_id`, `response`, `score`, `grader_response` from `assessment_responses` where `submission_id` = ?',
        [assessmentSubmissionId],
        [assessmentResponsesRowGraded]
      );

      expect(
        await getAssessmentSubmission(
          assessmentSubmissionId,
          responsesIncluded,
          gradingsIncluded
        )
      ).toEqual(exampleAssessmentSubmissionGraded);
    });
  });

  describe('findProgramAssessment', () => {
    it('should get program assessment for a given program assessment ID', async () => {
      mockQuery(
        'select `program_id`, `assessment_id`, `available_after`, `due_date` from `program_assessments` where `id` = ?',
        [exampleProgramAssessment.id],
        [exampleProgramAssessmentsRow]
      );

      expect(await findProgramAssessment(exampleProgramAssessment.id)).toEqual(
        exampleProgramAssessment
      );
    });
  });

  describe('getPrincipalProgramRole', () => {
    it('should return the correct role for a facilitator based on principal ID and program ID', async () => {
      mockQuery(
        'select `program_participant_roles`.`title` from `program_participants` inner join `program_participant_roles` on `program_participant_roles`.`id` = `program_participants`.`role_id` where `principal_id` = ? and `program_id` = ?',
        [facilitatorPrincipalId, exampleProgramAssessment.program_id],
        [exampleProgramParticipantRoleFacilitatorRow]
      );

      expect(
        await getPrincipalProgramRole(
          facilitatorPrincipalId,
          exampleProgramAssessment.program_id
        )
      ).toEqual('Facilitator');
    });

    it('should return the correct role for a participant based on principal ID and program ID', async () => {
      mockQuery(
        'select `program_participant_roles`.`title` from `program_participants` inner join `program_participant_roles` on `program_participant_roles`.`id` = `program_participants`.`role_id` where `principal_id` = ? and `program_id` = ?',
        [participantPrincipalId, exampleProgramAssessment.program_id],
        [exampleProgramParticipantRoleParticipantRow]
      );

      expect(
        await getPrincipalProgramRole(
          participantPrincipalId,
          exampleProgramAssessment.program_id
        )
      ).toEqual('Participant');
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
