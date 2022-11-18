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
 * Returns the programs associated with an optionally specified curriculum ID.
 * If ID is not specified, returns all programs.
 *
 * @param {number} curriculumId - optional ID for a specified curriculum
 * @returns {Program[]} - all matching programs, or all programs
 */
export const listPrograms = (curriculumId?: number): Promise<Program[]> => {
  if (curriculumId) {
    return db<Program>('programs').where({ curriculum_id: curriculumId });
  } else {
    return db<Program>('programs');
  }
};

/**
 * Get the first program associated with the specified program ID.
 *
 * @param {number} programId - The program ID for the specified program
 * @returns {Program} - The program data for the specified program ID
 */
export const findProgram = (programId: number): Promise<Program> => {
  return db<Program>('programs').where('id', programId).first();
};

/**
 * Return a list of curriculum activities that match the given curriculum id
 *
 * @param {number} curriculumId - The given curriculum id
 * @returns {CurriculumActivity[]} - An array of curriculum activities
 */
export const listCurriculumActivities = (
  curriculumId?: number
): Promise<CurriculumActivity[]> => {
  if (curriculumId) {
    return db<CurriculumActivity>('activities').where({
      curriculum_id: curriculumId,
    });
  } else {
    return db<CurriculumActivity>('activities');
  }
};

/**
 * Locate a single activity from list of curriculum activities.
 *
 * @param {number} activityId - the id for the unique activity
 * @returns {CurriculumActivity} - the specified activity if exists
 *
 * @example
 * // Correct usage.
 * findCurriculumActivity(1);
 */
export const findCurriculumActivity = (
  activityId: number
): Promise<CurriculumActivity> => {
  return db<CurriculumActivity>('activities').where('id', activityId).first();
};

/**
 * Generate the list of all program activities for a given program based on the
 * activities associated with the program’s curriculum and the program’s start
 * date.
 *
 * @param {number} programId - The program ID for the specified program
 * @returns {programActivity[]} - An array of program activities
 */
export const listProgramActivities = async (
  programId: number
): Promise<ProgramActivity[]> => {
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

  const activityTypes = await db<ActivityType>('activity_types');
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
 *   of activities
 */
export const findProgramWithActivities = (
  programId: number
): Promise<ProgramWithActivities> => {
  return findProgram(programId).then(
    async (program): Promise<ProgramWithActivities> => {
      const pwa: ProgramWithActivities = JSON.parse(JSON.stringify(program));
      pwa.activities = await listProgramActivities(program.id);
      return pwa;
    }
  );
};
