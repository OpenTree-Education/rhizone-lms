import db from './db';
import { AssessmentResponse } from '../models';

interface ProgramParticipantsRow {
  id: number;
  principal_id?: number;
  program_id?: number;
  role_id?: number;
}

/**
 * Enrolls a user in the system into a program and grants them the corresponding
 * permission. If user is pre-existing in that program, their permission is
 * changed to the specified permission level.
 *
 * @param {number} principalId - The user ID to make a program participant
 * @param {number} programId - The given program ID
 * @param {number} roleId - The program participant role type ID
 * @returns {ProgramParticipantsRow} -
 *   The inserted row in the program_participants table
 */
export const insertToProgramParticipants = async (
  principalId: number,
  programId: number,
  roleId: number
): Promise<ProgramParticipantsRow> => {
  let matchingProgramParticipantsRows: ProgramParticipantsRow[] =
    await db<ProgramParticipantsRow>('program_participants')
      .select('id', 'principal_id', 'program_id', 'role_id')
      .where({ principal_id: principalId, program_id: programId });

  if (matchingProgramParticipantsRows.length) {
    await db('program_participants')
      .update({
        program_id: programId,
        role_id: roleId,
      })
      .where({ principal_id: principalId });
  } else {
    await db('program_participants').insert({
      principal_id: principalId,
      program_id: programId,
      role_id: roleId,
    });
  }

  matchingProgramParticipantsRows = await db<ProgramParticipantsRow>(
    'program_participants'
  )
    .select('id')
    .where({ principal_id: principalId, program_id: programId });

  return {
    id: matchingProgramParticipantsRows[0].id,
    principal_id: principalId,
    program_id: programId,
    role_id: roleId,
  };
};

interface AssessmentSubmissionRow {
  id: number;
  principal_id?: number;
  assessment_id?: number;
  opened_at?: string;
  score?: number;
  submitted_at?: string;
  responses?: AssessmentResponse[];
}

/**
 * Inserts a new (or updates an existing) assessment into the
 * assessment_submissions table, and if provided responses, inserts or updates
 * those as well.
 *
 * @param {number} assessmentId - The ID of the assessment being updated
 * @param {number} principalId - The ID of the user submitting the assessment
 * @param {number} assessmentSubmissionStateId -
 *   The assessment submission state type ID
 * @param {string} openedAt - The date and time the assessment was first opened
 * @param {AssessmentResponse[]} responses -
 *   Responses for the questions in the assessment
 * @param {number?} score - The total score for the assessment being updated
 * @param {string?} submittedAt - The date and time the assessment was submitted
 * @returns {AssessmentSubmissionRow} -
 *   The inserted or updated row in the assessment_submissions table
 */
export const insertToAssessmentSubmissions = async (
  assessmentId: number,
  principalId: number,
  assessmentSubmissionStateId: number,
  openedAt: string,
  responses: AssessmentResponse[],
  score?: number,
  submittedAt?: string
): Promise<AssessmentSubmissionRow> => {
  let matchingAsssessmentSubmissionsRows: AssessmentSubmissionRow[] = await db(
    'assessment_submissions'
  )
    .select('id', 'assessment_id')
    .where({ assessment_id: assessmentId, principal_id: principalId });

  if (matchingAsssessmentSubmissionsRows.length) {
    await db(`assessment_submissions`)
      .update({
        assessment_submission_state_id: assessmentSubmissionStateId,
        score: score,
        opened_at: openedAt,
        submitted_at: submittedAt,
      })
      .where({ assessment_id: assessmentId, principal_id: principalId });
  } else {
    await db(`assessment_submissions`).insert({
      assessment_id: assessmentId,
      principal_id: principalId,
      assessment_submission_state_id: assessmentSubmissionStateId,
      score: score,
      opened_at: openedAt,
      submitted_at: submittedAt,
    });
  }

  matchingAsssessmentSubmissionsRows = await db<AssessmentSubmissionRow>(
    'assessment_submissions'
  )
    .select('id')
    .where({ assessment_id: assessmentId, principal_id: principalId });

  for (const response of responses) {
    await insertToAssessmentResponses(
      assessmentId,
      matchingAsssessmentSubmissionsRows[0].id,
      response.question_id,
      response.answer_id,
      response.response,
      response.score,
      response.grader_response
    );
  }

  return {
    id: matchingAsssessmentSubmissionsRows[0].id,
    principal_id: principalId,
    assessment_id: assessmentId,
    score: score,
    opened_at: openedAt,
    submitted_at: submittedAt,
    responses: responses,
  };
};

/**
 * Inserts a new (or updates an existing) response into the
 * assessment_responses table.
 *
 * @param {number} assessmentId - The associated assessment for this response
 * @param {number} submissionId - The associated assessment submission
 * @param {number} questionId - The ID of the question for this response
 * @param {number?} answerId - The ID of the answer for this response
 * @param {string?} response - The text of the answer for this response
 * @param {number?} score - The graded score for this response
 * @param {string?} graderResponse - Text of grader's feedback for this response
 * @returns {AssessmentResponse} -
 *   The inserted or updated row in the assessment_responses table
 */
export const insertToAssessmentResponses = async (
  assessmentId: number,
  submissionId: number,
  questionId: number,
  answerId?: number,
  response?: string,
  score?: number,
  graderResponse?: string
) => {
  let assessmentResponsesWithMatchedId = await db(`assessment_responses`)
    .select('id', 'assessment_id')
    .where({ assessment_id: assessmentId, submission_id: submissionId });
  if (assessmentResponsesWithMatchedId.length) {
    await db(`assessment_responses`)
      .update({
        answer_id: answerId,
        response: response,
        score: score,
        grader_response: graderResponse,
      })
      .where({ assessment_id: assessmentId, submission_id: submissionId });
  } else {
    await db(`assessment_responses`).insert({
      assessment_id: assessmentId,
      submission_id: submissionId,
      question_id: questionId,
      answer_id: answerId,
      response: response,
      score: score,
      grader_response: graderResponse,
    });
  }
  assessmentResponsesWithMatchedId = await db(`assessment_responses`)
    .select('id')
    .where({ assessment_id: assessmentId, submission_id: submissionId });

  return {
    id: assessmentResponsesWithMatchedId[0].id,
    assessment_id: assessmentId,
    submission_id: submissionId,
    question_id: questionId,
    answer_id: answerId,
    response: response,
    score: score,
    grader_response: graderResponse,
  };
};
