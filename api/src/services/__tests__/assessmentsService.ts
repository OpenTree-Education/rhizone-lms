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

  describe('getAssessmentSubmission', () => {});

  describe('getCurriculumAssessment', () => {});

  describe('getPrincipalProgramRole', () => {});

  describe('listParticipantProgramAssessmentSubmissions', () => {});

  describe('listPrincipalEnrolledProgramIds', () => {});

  describe('listProgramAssessments', () => {});

  describe('updateAssessmentSubmission', () => {});

  describe('updateCurriculumAssessment', () => {});

  describe('updateProgramAssessment', () => {});
});
