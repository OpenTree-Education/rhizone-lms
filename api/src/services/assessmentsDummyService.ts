import db from './db';

interface ProgramParticipantsRow {
  id: number;
  principal_id?: number;
  program_id?: number;
  role_id?: number;
}

/**
 * return matching rows from the program_participants table that have  been inserted or updated based on their pre-existence in the table.
 *
 * @param {number} principalId - The given principalId
 * @param {number} programId - The given programId
 * @param {number} roleId - roleId
 *
 * @returns {ProgramParticipantsRow}
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

  const insertedRowParsed = {
    id: matchingProgramParticipantsRows[0].id,
    principal_id: principalId,
    program_id: programId,
    role_id: roleId,
  };

  return insertedRowParsed;
};

interface AssessmentSubmissionRow {
  id: number;
  assessment_id?: number;
  principal_id?: number;
}

interface Response {
  id?: number;
  assessment_id: number;
  submission_id: number;
  question_id: number;
  answer_id?: number;
  response?: string;
  score?: number;
  grader_response?: string;
}

export const insertDataIntoAssessmentSubmissions = async (
  assessmentId: number,
  principalId: number,
  assessmentSubmissionStateId: number,
  score: number,
  openedAt: string,
  submittedAt: string,
  responses: Response[]
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
    await insertIntoAssessmentResponses(
      assessmentId,
      matchingAsssessmentSubmissionsRows[0].id,
      response.question_id,
      response.answer_id,
      response.response,
      response.score,
      response.grader_response
    );
  }

  const insertedRowParsed = {
    id: matchingAsssessmentSubmissionsRows[0].id,
    principal_id: principalId,
    assessment_id: assessmentId,
    score: score,
    opened_at: openedAt,
    submitted_at: submittedAt,
    responses: responses,
  };

  return insertedRowParsed;
};

export const insertIntoAssessmentResponses = async (
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

  return assessmentResponsesWithMatchedId;
};
