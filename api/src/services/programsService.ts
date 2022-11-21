import db from './db';
import {
  Program,
  ProgramActivity,
  ProgramWithActivities,
  CurriculumActivity,
  ActivityType,
} from '../models';
import { DateTime, Duration } from 'luxon';

/**
 * Returns all programs in the database.
 *
 * @returns {Program[]} - all programs, or null if not found
 */
export const listAllPrograms = async () => {
  const programsList = await db('programs').select(
    'id',
    'title',
    'start_date',
    'end_date',
    'time_zone',
    'curriculum_id'
  );
  return programsList;
};

/**
 * Returns the programs associated with a specified curriculum ID.
 *
 * @param {number} curriculumId - ID for a specified curriculum
 * @returns {Program[]} - all matching programs, or null if no match
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

/**
 * Get the first program associated with the specified program ID.
 *
 * @param {number} programId - The program ID for the specified program
 * @returns {Program} - The program data for the specified program ID
 */
export const findProgram = async (programId: number) => {
  const [matchingProgram] = await db<Program>('programs')
    .select(
      'id',
      'title',
      'start_date',
      'end_date',
      'time_zone',
      'curriculum_id'
    )
    .where('id', programId);
  return matchingProgram;
};

/**
 * Return a list of curriculum activities that match the given curriculum id
 *
 * @param {number} curriculumId - The given curriculum id
 * @returns {CurriculumActivity[]} - An array of curriculum activities
 */

export const listCurriculumActivities = async (curriculumId: number) => {
  const curriculumActivities = await db<CurriculumActivity>('activities')
    .select(
      'id',
      'title',
      'description_text',
      'curriculum_week',
      'curriculum_day',
      'start_time',
      'end_time',
      'duration',
      'activity_type_id',
      'curriculum_id'
    )
    .where({
      curriculum_id: curriculumId,
    });
  return curriculumActivities;
};

/**
 * Locate a single activity from list of curriculum activities.
 *
 * @param {number} activityId - the id for the unique activity
 * @returns {CurriculumActivity} - the specified activity if exists
 */
export const findCurriculumActivity = async (activityId: number) => {
  const [curriculumActivity] = await db<CurriculumActivity>('activities')
    .select(
      'id',
      'title',
      'description_text',
      'curriculum_week',
      'curriculum_day',
      'start_time',
      'end_time',
      'duration',
      'activity_type_id',
      'curriculum_id'
    )
    .where('id', activityId);
  return curriculumActivity;
};

/**
 * Generate the list of all program activities for a given program based on the
 * activities associated with the program’s curriculum and the program’s start
 * date.
 *
 * @param {number} programId - The program ID for the specified program
 * @returns {programActivity[]} - An array of program activities
 */
export const listProgramActivities = async (programId: number) => {
  const program = await findProgram(programId);
  const curriculumActivities = await listCurriculumActivities(
    program.curriculum_id
  );

  const calculateProgramActivityDate = (week: number, day: number) => {
    const startDateLuxon = DateTime.fromISO(program.start_date, {
      zone: program.time_zone,
    });
    const programActivityDate = startDateLuxon.plus({
      weeks: week - 1,
      days: day - 1,
    });
    return programActivityDate;
  };

  const activityTypes = await db<ActivityType>('activity_types').select('id', 'title');
  const programActivities: ProgramActivity[] = curriculumActivities.map(
    activity => {
      const findActivityType = activityTypes.find(
        element => activity.activity_type_id === element.id
      );

      const activityDate = calculateProgramActivityDate(
        activity.curriculum_week,
        activity.curriculum_day
      );

      let startTime, endTime, duration;

      // If it's an all-day activity, let’s set the time of the activity to
      // midnight and the duration to 0
      if (activity.duration === null || activity.duration === 0) {
        startTime = activityDate.toUTC();
        endTime = activityDate.toUTC();
        duration = 0;
      }

      // However, if we specified a start and end time for the activity, use
      // those times and that duration instead
      else {
        startTime = activityDate
          .plus(Duration.fromISOTime(activity.start_time))
          .toUTC();
        endTime = activityDate
          .plus(Duration.fromISOTime(activity.end_time))
          .toUTC();
        ({ duration } = activity);
      }

      return {
        title: activity.title,
        description_text: activity.description_text,
        program_id: programId,
        curriculum_activity_id: activity.id,
        activity_type: findActivityType.title,
        start_time: startTime.toISO(),
        end_time: endTime.toISO(),
        duration: duration,
      };
    }
  );

  return programActivities;
};

/**
 * Retrieve the details for a given program, including all program activities
 * as a member of that program.
 *
 * @param {number} programId - the id for the unique program
 * @returns {ProgramWithActivities} - a specified program containing an array
 *   of activities, or null if programId is not found
 */
export const findProgramWithActivities = async (programId: number) => {
  const matchingProgram = await findProgram(programId);
  if (!matchingProgram) {
    return null;
  }

  // Cast program into variable that contains activities field
  const pwa: ProgramWithActivities = JSON.parse(
    JSON.stringify(matchingProgram)
  );
  pwa.activities = await listProgramActivities(matchingProgram.id);
  return pwa;
};
