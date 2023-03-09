import db from './db';

import {
  Answer,
  AssessmentResponse,
  AssessmentSubmission,
  CurriculumAssessment,
  ProgramAssessment,
  Question,
} from '../models';

// TODO: Need descriptions for the parameters of the functions as well as their return values
// TODO: Test file

// ** Helper functions ** //

/* Helper functions we need:

- Something that can grab a ProgramAssessment given a program assessment ID
- It should probably grab the associated CurriculumAssessment

- Something that can check if the user is enrolled in the program
- It should probably return the permission level if they are ("participant"/"facilitator")
*/

/**
 * a function that returns the curriculum assessment ID and program ID given a program assessment ID.
 * @param {number} curriculumAssessmentId - THe curriculum assessment ID
 * @param {number} programAssessmentId - The program assessment ID
 * @param {number} programId - The program ID for the specified program
 * @param {number} principalId - The restrict result to programs with which the user is associated
 * @returns {AssessmentSummary} - assessment summary that includes curiculum assessment, program assessment and submissions summury
 *
 */
// export const getCurriculumAndProgramAssessment = async (
//   curriculumAssessmentId: number,
//   programAssessmentId: number,
//   principalId: number,
//   programId: number
// ) => {
//   const curriculumAssessment = await getCurriculumAssessment(
//     curriculumAssessmentId
//   );
//   const programAssessment = await getProgramAssessment(
//     programAssessmentId,
//     curriculumAssessmentId
//   );
//   const role = await findRoleInProgram(principalId, programId);
//   const question = await getQuestionsByCurriculumAssessmentId(
//     curriculumAssessmentId,
//     true
//   );

//   const autorizedCheck = async (
//     principalId: number,
//     programId: number,
//     assessmentId: number
//   ) => {
//     if (role === 'Facilitator') return;
//   };
// };

// export const getCurriculumAssessment = async (
//   curriculumAssessmentId: number
// ) => {
//   const [matchingCurriculumAssessmentId] = await db<CurriculumAssessment>(
//     'curriculum_assessments'
//   )
//     .select()
//     .where({ id: curriculumAssessmentId });
//   return matchingCurriculumAssessmentId;
// };

// export const getProgramAssessment = async (
//   programAssessmentId: number,
//   curriculumAssessmentId: number
// ) => {
//   const [matchingProgramAssessmentId] = await db<ProgramAssessment>(
//     'program_assessments'
//   )
//     .select()
//     .where({ id: programAssessmentId, assessment_id: curriculumAssessmentId });
//   return matchingProgramAssessmentId;
// };

// export const getNumProgramParticipants = async (programId: number) => {
//   return await db<number>('program_participants')
//     .count('id')
//     .where('program_id', programId);
// };

// export const getNumUngradedSubmissons = async (assessmentId: number) => {
//   return await db<number>('assessment_submissions')
//     .count('id')
//     .where('assessment_id', assessmentId)
//     .andWhere('score', null);
// };

// export const getTotalNumSubmissons = async (assessmentId: number) => {
//   return await db<number>('assessment_submissions')
//     .count('id')
//     .where('assessment_id', assessmentId);
// };

/**
 * a function to returns the role of the participant in a given program
 *
 * @param {number} programId - The program ID for the specified program
 * @param {number} principalId - The restrict result to programs with which the user is associated
 * @returns {} - //? should it be extend to ProgramParticipantCompletionSummary ?
 *
 */
export const findRoleInProgram = async (
  principalId: number,
  programId: number
) => {
  const [roleName] = await db('program_participants')
    .select('program_participant_roles.title')
    .join(
      'program_participant_roles',
      'program_participant_roles.id',
      'program_participants.role_id'
    )
    .where({ principal_id: principalId, program_id: programId });
  return roleName;
};

// ? where do we get information for AssessmentSubmissionsSummary
/**
 * a function to returns details about the curriculum assessment given a curriculum assessment ID, with an optional flag to determine whether or not questions and answers should be included in the return value.
 *
 * @param {number} curriculumAssessmentId - The curriculum assessment ID
 * @param {boolean} isQuestionsIncluded - The flag if the question should also be sent
 * @param {boolean} isAnswersIncluded - The flag if the answers should also be sent
 * @returns {CurriculumAssessment} - The details about matching curriculum assessment
 *
 */

export const getCurriculumAssessmentById = async (
  curriculumAssessmentId: number,
  isQuestionsIncluded: boolean,
  isAnswersIncluded: boolean
) => {
  const curriculumAssessmentDetails = await db<CurriculumAssessment>(
    'curriculum_assessments'
  )
    .select(
      'id',
      'title',
      'max_score',
      'max_num_submissions',
      'time_limit',
      'curriculum_id',
      'activity_id',
      'principal_id',
      'created_at',
      'updated_at'
    )
    .where('id', curriculumAssessmentId);

  if (isQuestionsIncluded == true) {
    const questions = await getQuestionsByCurriculumAssessmentId(
      curriculumAssessmentId,
      isAnswersIncluded
    );

    curriculumAssessmentDetails.forEach(
      assesment =>
        (assesment.questions = questions.filter(
          question => question.assessment_id === assesment.id
        ))
    );
  }
  return curriculumAssessmentDetails;
};

/**
 * a function based on curriculum assessment ID that allow include or exclude answers to response
 *
 * @param {number} curriculumAssessmentId - The curriculum assessment ID
 * @param {boolean} isAnswersIncluded - The flag if the answers should also be sent
 * @returns {Question[]} - The data about questions
 *
 */

export const getQuestionsByCurriculumAssessmentId = async (
  curriculumAssessmentId: number,
  isAnswersIncluded: boolean
) => {
  const questions = await db<Question>('assessment_questions')
    .select()
    .where({ assessment_id: curriculumAssessmentId });

  if (isAnswersIncluded == true) {
    const questionIds = questions.map(element => element.id);
    const answers = await db<Answer>('assessment_answers')
      .select()
      .whereIn('question_id', questionIds);

    questions.forEach(
      question =>
        (question.answers = answers.filter(
          answer => answer.question_id === question.id
        ))
    );
  }

  return questions;
};

/**
 * a function that returns details about a program assessment given a program assessment ID
 *
 * @param {number} programAssessmentId - The assessment ID for the specified assessment
 *
 */
export const programAssessmentById = async (programAssessmentId: number) => {
  const findProgramAssessmentById = await db<ProgramAssessment>(
    'program_assessments'
  )
    .select(
      'id',
      'program_id',
      'assessment_id',
      'available_after',
      'due_date',
      'created_at',
      'updated_at'
    )
    .where({ id: programAssessmentId });
  return findProgramAssessmentById;
};

// TODO: Fix spelling error in function name.

/**
 * A function to return details about your own submissions or all participants' submissions,
 * with an optional flag to determine whether or not responses should be included in the return value.
 *
 * @param {number} programAssessmentId - The assessment ID for the specified assessment
 * @param {boolean} isResponsesIncluded - A flag to determine whether or not responses should be included
 * @returns {<AssessmentSubmission[]>} - A list of assessment submissions in the db
 */
export const submissionDetails = async (
  programAssessmentId: number,
  isResponsesIncluded: boolean
) => {
  const assessmentSubmissionByProgramAssessmentId =
    await db<AssessmentSubmission>('assessment_submission')
      .select()
      .where({ id: programAssessmentId });

  if (isResponsesIncluded) {
    const assessmentSubmissionIds =
      assessmentSubmissionByProgramAssessmentId.map(element => element.id);
    const responses = await db<AssessmentResponse>('assessment_responses')
      .select()
      .whereIn('submission_id', assessmentSubmissionIds);

    assessmentSubmissionByProgramAssessmentId.forEach(
      assessment =>
        (assessment.responses = responses.filter(
          response => response.submission_id === assessment.id
        ))
    );
  }

  return assessmentSubmissionByProgramAssessmentId;
};

//** service functions for router **/

/**
 * (GET /assessments) Returns list of assessments in the database.
 * @param {number} principalId - restrict result to programs with which the user is associated
 * @returns {CurriculumAssessment}
 */

export const listAssessmentsByParticipant = async (principalId: number) => {
  const assessmentsList = await db<CurriculumAssessment>(
    'curriculum_assessments'
  )
    .select(
      'id',
      'title',
      'max_score',
      'max_num_submissions',
      'time_limit',
      'curriculum_id',
      'activity_id',
      'principal_id',
      'created_at',
      'updated_at'
    )
    .where('principal_id', principalId);
  return assessmentsList;
};

// TODO: Fix function header

/**
 * (POST /assessments) ERR 403/
 * A function that creates a new assessment into the system
 * @param {string} title title for assessment
 * @param {string} description description of assessment
 * @param {number} maxScore max score for assessment
 * @param {number} maxNumSubmissions maximum number of allowed submission
 * @param {number} timeLimit time limit
 * @param {number} curriculumId
 * @param {number} activityId //?number of activity in database
 * @param {number} principalId - restrict result to programs with which the user is associated
 * @param {number} programId
 * @param {string} availableAfter
 * @param {string} dueDate
 *
 */
export const createAssessment = async (
  title: string,
  description: string,
  maxScore: number,
  maxNumSubmissions: number,
  timeLimit: number,
  curriculumId: number,
  activityId: number,
  principalId: number,
  programId: number,
  availableAfter: string,
  dueDate: string
) => {
  let assessmentId: number;
  await db.transaction(async trx => {
    [assessmentId] = await trx('curriculum_assessments').insert({
      title: title,
      description: description,
      max_score: maxScore,
      max_num_submissions: maxNumSubmissions,
      time_limit: timeLimit,
      curriculum_id: curriculumId,
      activity_id: activityId,
      principal_id: principalId,
    });
    await trx('program_assessments').insert({
      assessment_id: assessmentId,
      program_id: programId,
      available_after: availableAfter,
      due_date: dueDate,
    });
  });
  return { id: assessmentId };
};

// TODO: Fix function header

/**
 * (DELETE /assessments/:id) ERR 403/
 * “Deletes” an assessment in the system
 *
 */
export const deleteAssessmentById = async (assessmentId: number) => {
  return await db.transaction(async trx => {
    return await trx('curriculum_assessments')
      .where({ id: assessmentId })
      .del();
  });
};

/**
 * (PUT /assessments/:id) ERR 403/
 * Edits an assessment in the system
 *
 * Program participants should be able to update their
 * assessment submission if:
 * - they haven’t clicked the submit button
 * -  time has not expired
 * -  due date has not passed
 *
 */

/**
 * (PUT /assessments/:id/submission/:id) Submits their answers
 * for this submission/
 * Submits comments for the submission.
 *
 *
 */

/** (GET /assessments/:id/submission/new) Creates a new (draft)
 * submission (which starts the timer) and returns the questions
 * and possible answers and the submission ID number/
 *
 */
// ? which function structure is more apropriate post/put assessment

/**
 * A function that update assessment by ID
 *
 * (PUT /assessments/:id)
 * @param {<Question> []} questions
 * @param {number} principalId restrict result to programs with which theuser is associated
 * @param {number} assessmentId - The assessment ID for the specified assessment
 * @param {number} programId - The program ID for the specified program
 * @param {string} title title for assessment
 * @param {string} description description of assessment
 * @param {number} maxScore max score for assessment
 * @param {number} maxNumSubmissions maximum number of allowed submission
 * @param {number} timeLimit time limit
 * @param {number} curriculumId the ID for uniq curriculum assessment
 * @param {number} activityId //?number of activity in database
 * @param {string} availableAfter date after
 *
 */

export const updateAssessmentById = async (
  title: string,
  description: string,
  maxScore: number,
  maxNumSubmissions: number,
  timeLimit: number,
  curiculumId: number,
  principalId: number,
  activityId: number,
  questions: [], // ????question here about type
  availableAfter: string,
  dueDate: string,
  programId: number,
  assessmentId: number
) => {
  await db('curriculum_assessments')
    .where({ assessment_id: assessmentId })
    .update({
      title,
      description,
      maxScore,
      maxNumSubmissions,
      timeLimit,
      curiculumId,
      activityId,
      principalId,
    });
  await db('program_assessments')
    .where({ curiculum_id: curiculumId })
    .update({ availableAfter, dueDate, programId });
  await db('assessment_questions')
    .where({ assessment_id: assessmentId })
    .update({ title: questions, description: description });
  return { assessment_id: assessmentId };
};

// TODO: Fix function header

// /**
//  *
//  * @param {number} assessmentId - The assessment ID for the specified submission
//  * @returns {Assessment} - The assessment data for the specified assessment ID
//  */
// export const findAssessment = async (assessmentId: number) => {
//   const [matchingAssessment] = await db<CurriculumAssessment>(
//     'curriculum_assessment'
//   )
//     .select(
//       'id',
//       'title',
//       'start_date',
//       'end_date',
//       'time_zone',
//       'curriculum_id'
//     )
//     .where({ assessment_id: assessmentId });
//   return matchingAssessment;
// };

/**
 * Get information about assessment submission based on role
 *
 * @param {number} programId - The program ID for the specified program
 * @param {number} principalId - The restrict result to programs with which the user is associated
 * @param {number} assessmentId - The submission ID for the specified assesment
 * @returns
 */
export const findSubmissionByAssessmentId = async (
  assessmentId: number,
  programId: number,
  principalId: number
) => {
  const role = await findRoleInProgram(programId, principalId);

  const [matchingAssessmentForFacilitator] = await db<AssessmentSubmission>(
    'assessment_submissions'
  )
    .select(
      'assessment_id',
      'principal_id',
      'assessment_submisson_state_id',
      'score',
      'opened_at',
      'submitted_at',
      'created_at',
      'updated_at'
    )
    .where({ assessment_id: assessmentId });
  const [matchingAssessmentForParticipant] = await db<AssessmentSubmission>(
    'assessment_submissions'
  )
    .select(
      'assessment_id',
      'principal_id',
      'assessment_submisson_state_id',
      'score',
      'opened_at',
      'submitted_at',
      'created_at',
      'updated_at'
    )
    .where({ assessment_id: assessmentId });

  if (role === 'Facilitator') return matchingAssessmentForFacilitator;
  else matchingAssessmentForParticipant;
};

/**
 *
 * @param {number} assessmentId - The submission ID for the specified assesment
 * @returns {AssessmentSubmission} - The assessment data for the specified assessment ID
 */
export const listSubmissions = async (assessmentId: number) => {
  const [matchingAssessment] = await db<AssessmentSubmission>(
    'curriculum_assessment'
  )
    .select(
      'assessment_id',
      'principal_id',
      'assessment_submisson_state_id',
      'score',
      'opened_at',
      'submitted_at',
      'created_at',
      'updated_at'
    )
    .where({ assessment_id: assessmentId });
  return matchingAssessment;
};
