import db from './db';

import { ProgramAssessments, CurriculumAssessments } from '../models';
// import { DateTime, Duration } from 'luxon';

// /**
//  * (GET /assessments) Returns list of assessments in the database.
//  *
//  * @returns {ProgramAssessments[]} - list of assessments in the db
//  * @param {number} principalId - the unique id for the user
//  */

// export const listAssessmentsByParticipant = async (principalId: number) => {
//   ///1. Select program_id from program_prticipants by principal_id and store it in variable
//   const programIds = await db('programs')
//     .select('id')
//     .where(
//       'principal_id', principalId
//     );

//     console.log(programIds);
//   const programId = programIds.map(({ id }) => id);
//   console.log(t);
//   ///2.
//   const assessmentsList = await db<ProgramAssessments>('program_assessments')
//     .select(
//       'id',
//       'program_id',
//       'assessment_id',
//       'available_after',
//       'due_date',
//       'created_at',
//       'updated_at'
//     )
//     .whereIn('program_id', programId); //array of program ids);
//   return assessmentsList;
// };

/**
 * (GET /assessments) Returns list of assessments in the database.
 *
 * @returns {CurriculumAssessments[]} - list of assessments in the db
 */

export const listAssessmentsByParticipant = async () => {
  const assessmentsList = await db<CurriculumAssessments>(
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
    .where('title', 'Final Exam'); // we can use it as a filter
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
 *
 */

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
 * (GET /assessments/:id) Get the meta information about the
 * assessment (title, list of submission ids, due date, etc)/
 * Get the meta information about the assessment (title, list
 * of mentees that have submissions and their submission
 * ids, due date, etc)
 *
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
 * Creates a new (draft) submission (which starts the timer) and
 * returns the questions and possible answers
 *
 */
