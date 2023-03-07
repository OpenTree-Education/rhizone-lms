import db from './db';

interface ProgramParticipantsRow {
  id: number;
  principal_id?: number;
  program_id?: number;
  role_id?: number;
}

/**
 * Return  program_participants table for any rows matching this principalId and this programId.
 *
 * @param {number} principalId - The given principalId
 * @param {number} programId - The given programId
 *
 * @returns {ProgramParticipantsRow}
 */
export const insertToProgramParticipants = async (
  principalId: number,
  programId: number,
  roleId: number
): Promise<ProgramParticipantsRow> => {
  // select from the program_participants table for any rows matching this principalId and this programId

  let matchingProgramParticipantsRows: ProgramParticipantsRow[] =
    await db<ProgramParticipantsRow>('program_participants')
      .select('id', 'principal_id', 'program_id', 'role_id')
      .where({ principal_id: principalId, program_id: programId });

  // - if a row exists, update the roleId to the roleId that's being passed in, using the id of the row returned from that table as the key for updating

  if (matchingProgramParticipantsRows.length) {
    await db('program_participants')
      .update({
        program_id: programId,
        role_id: roleId,
      })
      .where({ principal_id: principalId });
  }
  // - if no row exists, insert a row into the table for this principalId, programId, and roleId
  else {
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

export const insertToAssessmentSubmissions = async (
  assessmentId: number,
  principalId: number,
  assessmentSubmissionStateId: number,
  score: number,
  openedAt: string,
  submittedAt: string,
  responses: Response[]
): Promise<AssessmentSubmissionRow> => {
  // select from the assessment_submissions table for any rows matching this principalId and assessmentId

  let matchingAsssessmentSubmissionsRows: AssessmentSubmissionRow[] = await db(
    'assessment_submissions'
  )
    .select('id', 'assessment_id')
    .where({ assessment_id: assessmentId, principal_id: principalId });

  if (matchingAsssessmentSubmissionsRows.length) {
    // - if a row exists, update the status and submittedAt dates (if one is passed) and return the id of that row

    await db(`assessment_submissions`)
      .update({
        assessment_submission_state_id: assessmentSubmissionStateId,
        score: score,
        opened_at: openedAt,
        submitted_at: submittedAt,
      })
      .where({ assessment_id: assessmentId, principal_id: principalId });
  } else {
    // - if a row doesn't exist, create one and return the id of that row in the assessment_submissions table
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

export const insertToAssessmentResponses = async (
  assessmentId: number,
  submissionId: number,
  questionId: number,
  answerId?: number,
  response?: string,
  score?: number,
  graderResponse?: string
) => {
  const assessmentResponsesWithMatchedId = await db(`assessment_responses`)
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
};
