import db from './db';

import {
  Answer,
  AssessmentSubmission,
  AssessmentResponse,
  CurriculumAssessment,
  ProgramAssessment,
  Question,
} from '../models';
// import { DateTime, Duration } from 'luxon';

/**
 * a function that returns the curriculum assessment ID and program ID given a program assessment ID.
 *
 * @param {number} programAssessmentId
 *
 */
export const getCurriculumAndProgramAssessmentId = async (
  programAssessmentId: number
) => {
  const [matchingProgramAssessmentId] = await db<ProgramAssessment>(
    'program_assessments'
  )
    .select('assessment_id', 'program_id')
    .where({ id: programAssessmentId });
  return matchingProgramAssessmentId;
};

/**
 * a function to returns the role of the participant in a given program
 *
 * @param {number} programId
 * @param {number} principalId
 *
 */
export const findRoleParticipant = async (
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

/**
 * a function to returns details about the curriculum assessment given a curriculum assessment ID, with an optional flag to determine whether or not questions and answers should be included in the return value.
 *
 * @param {number} curriculumAssessmentId
 * @param {boolean} isQuestionsAndAnswersIncluded
 *
 */

export const getCurriculumAssesmentById = async (
  curriculumAssessmentId: number,
  isQuestionsAndAnswersIncluded: boolean
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

  if (isQuestionsAndAnswersIncluded == true) {
    const questions = await db<Question>('assessment_questions')
      .select()
      .where({ assessment_id: curriculumAssessmentId });
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

    curriculumAssessmentDetails.forEach(
      element =>
        (element.questions = questions.filter(
          qestion => qestion.assessment_id === element.id
        ))
    );
  }
  return curriculumAssessmentDetails;
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

/**
 * a function to return details about your own submissions or all participants' submissions, with an optional flag to determine whether or not responses should be included in the return value.
 *
 * @param {number} programAssessmentId - The assessment ID for the specified assessment
 * @returns {Submission[]} - list of assessments in the db
 *
 */

export const sumbmissionDetails = async (programAssessmentId: number) => {
  const findProgramAssessmentById = await db<ProgramAssessment>(
    'curriculum_assessments'
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

/**
 * a function to returns details about the curriculum assessment given a curriculum assessment ID, with an optional flag to determine whether or not questions and answers should be included in the return value.
 *
 * @param {number} assessmentSubmissionId
 * @param {number} questionId
 * @param {number} answerId
 * @param {boolean} isResponseIncluded
 *
 */

// export const getAssessmentSubmissionById = async (
//   assessmentSubmissionId: number,
//   questionId: number,
//   answerId: number,
//   isResponseIncluded: boolean
// ) => {
//   const assessmentSubmissionDetails = await db<AssessmentSubmission>(
//     'assessment_submissions'
//   )
//     .select(
//       'id',
//       'assessment_id',
//       'principal_id',
//       'assessment_submisson_state_id',
//       'score',
//       'opened_at',
//       'submitted_at',
//       'created_at',
//       'updated_at',
//     )
//     .where('id', assessmentSubmissionId);

//   if (isResponseIncluded == true) {
//     const responses = await db<AssessmentResponse>('assessment_responses')
//       .select()
//       .where({ submission_id: assessmentSubmissionId });

//   return assessmentSubmissionDetails;
// };

// **old version from previous week is below the line

/**
 * (GET /assessments) Returns list of assessments in the database.
 * @param {number} principalId - the unique id for the user
 *
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
    .where('principal_id', principalId); // we can use it as a filter
  return assessmentsList;
};

/**
 * (POST /assessments) ERR 403/
 * Creates a new assessment into the system
 *
 * Program participants should be able to create a new
 * submission for an assessment if:
 * - they have not reached the limit of the allowed number
 * of submissions
 * - the available_after date has passed
 * - the due_date has not passed
 */
export const createAssessment = async (
  title: string,
  description: string,
  maxScore: number,
  maxNumSubmissions: number,
  timeLimit: number,
  curriculumId: number,
  activityId: number,
  principalId: number
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
    // await trx('program_assessments').insert({
    //   assessment_id: assessmentId,
    //   program_id: programId,
    //   available_after: availableAfter,
    //   due_date: dueDate,
    // });
  });
  return { id: assessmentId };
};

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

/**
 *
 *
 * (PUT /assessments/:id)
 * @param {Object} questions
 * @param {number} principalId
 * @param {number} assessmentId - The assessment ID for the specified assessment
 * @param {number} programId
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
  questions: [], // question here about type
  availableAfter: string,
  dueDate: string,
  programAssessmentId: number,
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

/**
 *
 * @param {number} assessmentId - The assessment ID for the specified submission
 * @returns {Assessment} - The assessment data for the specified assessment ID
 */
export const findAssessment = async (assessmentId: number) => {
  const [matchingAssessment] = await db<CurriculumAssessment>(
    'curriculum_assessment'
  )
    .select(
      'id',
      'title',
      'start_date',
      'end_date',
      'time_zone',
      'curriculum_id'
    )
    .where({ assessment_id: assessmentId });
  return matchingAssessment;
};

/**
 * @param {number} programId
 * @param {number} principalId
 * @param {number} assessmentId - The submission ID for the specified assesment
 * @returns {AssessmentSubmission} - The assessment data for the specified assessment ID
 */
export const findSubmissionByAssessmentId = async (
  assessmentId: number,
  programId: number,
  principalId: number
) => {
  const [roleName] = await db('program_participants')
    .select({ role_id: 'program_participant_roles.title' })
    .join(
      'program_participant_roles',
      'program_participant_roles.id',
      'program_participants.role_id'
    )
    .where({ principal_id: principalId, program_id: programId });

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
  const [matchingAssessmentForStudent] = await db<AssessmentSubmission>(
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

  if (roleName.role_id === 2) return matchingAssessmentForFacilitator;
  else matchingAssessmentForStudent;
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
