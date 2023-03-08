import db from './db';

interface ProgramParticipantsRow {
  id: number;
  principal_id?: number;
  program_id?: number;
  role_id?: number;
}

/**
 * Return matching rows from the program_participants table that have  been inserted or updated based on their pre-existence in the table.
 *
 * @param {number} principalId - The user Id
 * @param {number} programId - The given program Id
 * @param {number} roleId - The id associate to the program    participant
 *
 * @returns {ProgramParticipantsRow}-Return id,principl id,program id,role id
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
/**
 * Return matching rows from the assessment_submissions table that have  been inserted or updated based on their pre-existence in the table.
 *
 * @param {number} principalId - The given user id 
 * @param {number} assessmentId - The  assessment id for taken assessment
 * @param {number} assessmentSubmissionStateId -Id for assessment subission state /active/inactive/open 
 * @param {number} score -Total score for submitted assessment
 * @param {string} openedAt - Open time for assessment 
 * @param {string} submittedAt - Assessment submitted date
 * @param {Response[]} responses - Responses for the questions in the assessment

 * @returns {AssessmentSubmissionRow} return data for taking assessment 
 */

export const insertToAssessmentSubmissions = async (
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

/**
 * Return matching rows from the assessment_responses table that have  been inserted or updated based on their pre-existence in the table.
 *
 *
 * @param {number} assessmentId - Assessment Is associated with the taken assessment
 * @param {number} submissionId - Id for the submitted assessment
 * @param {number} questionId - Question id
 * @param {number} answerId - Id associated with answer
 * @param {string} responses - Respone for a question
 * @param {number} score - Total score for answered  questions
 * @param {string} graderResponse - The graderResponse
 * @returns {Response} -Responses for the taken assessment
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

  const insertedRowParsed = {
    id: assessmentResponsesWithMatchedId,
    assessment_id: assessmentId,
    submission_id: submissionId,
    question_id: questionId,
    answer_id: answerId,
    responses: response,
    score: score,
    graderResponse: graderResponse,
  };

  return insertedRowParsed;
};
