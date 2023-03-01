import db from './db';
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
) => {
  // select from the program_participants table for any rows matching this principalId and this programId
  // - if a row exists, update the roleId to the roleId that's being passed in, using the id of the row returned from that table as the key for updating
  // - if no row exists, insert a row into the table for this principalId, programId, and roleId
  const listProgramParticipants = await db('program_participants')
    .select('principal_id', 'program_id', 'id', 'role_id')
    .where({ principal_id: principalId, program_id: programId })
    .then(rows => {
      return rows.map(row => ({
        id: row.id,
        // role_id:row.role_id
      }));
    });
  if (listProgramParticipants.length < 0) {
    await db('program_participants').insert({
      principal_id: principalId,
      program_id: programId,
      role_id: roleId,
    });
  } else {
    await db('program_participants').update({
      principal_id: principalId,
      program_id: programId,
      role_id: roleId,
    });
  }

  // const rowsToInsert: {
  //   principal_id: number;
  //   program_id: number;
  //   role_id: number;
  // }[] = [];
  return {};
};

export const insertToAssessmentSubmissions = async (
  assessmentId: number,
  principalId: number,
  status: number,
  submittedAt?: string
) => {
  // select from the assessment_submissions table for any rows matching this principalId and assessmentId
  // - if a row exists, update the status and submittedAt dates (if one is passed) and return the id of that row
  // - if a row doesn't exist, create one and return the id of that row in the assessment_submissions table
  // await db(`assessment_submissions`).insert({
  //   assessment_id:assessmentId,
  //   principal_id:principalId,
  //   submitted_at:submittedAt,
  //   assessment_submission_state_id:status
  // })

  const AssessmentSubmissionsWithMatchedId = await db('assessment_submissions')
    .select(
      'assessment_id',
      'principal_id',
      'assessment_submission_state_id',
      'submitted_at'
    )
    .where({ assessment_id: assessmentId, principal_id: principalId });
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
  await db(`assessment_submissions`).insert({
    assessment_id: assessmentId,
    submission_id: submissionId,
    question_id: questionId,
    answer_id: answerId,
    response: response,
    score: score,
    grader_response: graderResponse,
  });
};
