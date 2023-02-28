import db from './db';

import {ListAssessments} from '../models';
// import { DateTime, Duration } from 'luxon';

/**
 * (GET /assessments) Returns list of assessments in the database.
 *
 * @returns {ListAssessments[]} - list of assessments in the db
 * @param {number} principalId - the unique id for the user
 */

export const listAssessmentsByParticipant = async (principalId: number) => {
  ///1. Select program_id from program_prticipants by principal_id and store it in variable
  const programIds = await db('program_participants')
    .select('program_id')
    .where({
      principal_id: principalId,
    });
  ///2.
  const assessmentsList = await db<ListAssessments>('program_assessments')
    .select(
      'id',
      'program_id',
      'assessment_id',
      'available_after',
      'due_date',
      'created_at',
      'updated_at'
    )
    .whereIn('program_id', programIds); //array of program ids);
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
 *
 */

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
 * (PUT /assessments/:id) Get the meta information about the
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
