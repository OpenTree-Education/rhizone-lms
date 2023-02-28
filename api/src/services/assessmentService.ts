import db from './db';

import {listAssessments } from '../models';
// import { DateTime, Duration } from 'luxon';

/**
 * Returns list of assessments in the database.
 *
 * @returns {listAssessments[]} - list of assessments in the db
 * @param {number} principalId - the unique id for the user
 */

export const listAssessmentsByParticipant = async (principalId: number) => {
  ///1. Select program_id from program_prticipants by principal_id and store it in variable
  const programIDs = await db('program_participants')
    .select('program_id')
    .where({
      principal_id: principalId,
    });
  ///2.
  const assessmentsList = await db<listAssessments>('assessments')
    .select(
      'id',
      'program_id',
      'assessment_id',
      'available_after',
      'due_date',
      'created_at',
      'updated_at'
    )
    .whereIn('program_id', programIDs); //array of program ids);
  return assessmentsList;
};
