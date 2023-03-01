import db from './db';

interface ProgramParticipantsRow {
  id: number;
  principal_id: number;
  program_id: number;
  role_id: number;
}

/**
 * Return  program_participants table for any rows matching this principalId and this programId.
 *
 * @param {number} principalId - The given principalId id
 *
 * @returns {} - An array of matching curriculum activities
 */
export const insertToProgramParticipants = async(
  principalId: number,
  programId: number,
  roleId: number
): Promise<ProgramParticipantsRow[]> => {
  // select from the program_participants table for any rows matching this principalId and this programId
  let matchingProgramParticipantsRows: ProgramParticipantsRow[] =
    await db<ProgramParticipantsRow>('program_participants')
      .select('principal_id', 'program_id', 'id', 'role_id')
      .where({ principal_id: principalId, program_id: programId });

  // console.debug(`matchingProgramParticipantsRows value is: ${JSON.stringify(matchingProgramParticipantsRows, null, 2)}`);

  // - if a row exists, update the roleId to the roleId that's being passed in, using the id of the row returned from that table as the key for updating
  if (matchingProgramParticipantsRows.length) {
    await db('program_participants')
      .update({
        principal_id: principalId,
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

  // console.debug(`programParticipantsRow value is: ${JSON.stringify(programParticipantsRow, null, 2)}`);

  matchingProgramParticipantsRows = await db<ProgramParticipantsRow>(
    'program_participants'
  )
    .select('principal_id', 'program_id', 'id', 'role_id')
    .where({ principal_id: principalId, program_id: programId });

  return matchingProgramParticipantsRows;
};

interface AssessmentSubmissionRow {
  id: number;
  assessment_id: number;
  principal_id: number;
}

interface Question {
  id: number;
  answerId?: number;
  responseText?: string;
}

export const insertToAssessmentSubmissions = async (
  assessmentId: number,
  principalId: number,
  assessmentSubmissionStateId: number,
  score: number,
  openedAt: string,
  submittedAt: string,
  questions: Question[]
): Promise<AssessmentSubmissionRow[]> => {
  // select from the assessment_submissions table for any rows matching this principalId and assessmentId
  let matchingAsssessmentSubmissionsRows = await db<AssessmentSubmissionRow>(
    'assessment_submissions'
  )
    .select('id', 'assessment_id', 'principal_id')
    .where({ assessment_id: assessmentId, principal_id: principalId });

  if (matchingAsssessmentSubmissionsRows.length) {
    // - if a row exists, update the status and submittedAt dates (if one is passed) and return the id of that row

    await db(`assessment_submissions`)
      .update({
        assessment_id: assessmentId,
        principal_id: principalId,
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
    .select('id', 'assessment_id', 'principal_id')
    .where({ assessment_id: assessmentId, principal_id: principalId });

  questions.forEach(question => {
    insertToAssessmentResponses(
      assessmentId,
      matchingAsssessmentSubmissionsRows[0].id,
      question.id,
      question.answerId,
      question.responseText,
      1
    );
  });

  return matchingAsssessmentSubmissionsRows;
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
  const assessmentResponsesWithMatchredId = await db
    .select('assessment_id', 'assessment_submission_state_id', 'submitted_at')
    .where({ assessment_id: assessmentId });
  await db(`assessment_responses`).insert({
    assessment_id: assessmentId,
    submission_id: submissionId,
    question_id: questionId,
    answer_id: answerId,
    response: response,
    score: score,
    grader_response: graderResponse,
  });
};
