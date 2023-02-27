import db from './db';

// import {
//     Program,
//     ProgramActivity,
//     ProgramWithActivities,
//     CurriculumActivity,
//     ActivityType,
//     ParticipantActivity,
//   } from '../models';
//   import { DateTime, Duration } from 'luxon';

  /**
   * Returns list of assessments in the database.
   *
   * @returns {listAssessments[]} - list of assessments in the db
   */

  export const listAssessments = async () => {
    const assessmentsList = await db('assessments').select(
        'id',
        'assessment_id',
        'available_after',
        'due_date'
    );
    return assessmentsList;
  };


/**
 * Returns the programs associated with a specified curriculum ID.
 *
 * @param {number} curriculumId - ID for a specified curriculum
 * @returns {Program[]} - all matching programs
 */
export const listProgramsForCurriculum = async (curriculumId: number) => {
    const programsList = await db<Program>('programs')
      .select(
        'id',
        'title',
        'start_date',
        'end_date',
        'time_zone',
        'curriculum_id'
      )
      .where({ curriculum_id: curriculumId });
    return programsList;
  };
