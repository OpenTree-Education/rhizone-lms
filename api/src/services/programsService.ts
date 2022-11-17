import db from './db';
import {
  Program,
  ProgramActivity,
  ProgramWithActivities,
  CurriculumActivity,
  ActivityType,
} from '../models';

/**
 * Returns the programs associated with an optionally specified curriculum ID. If ID is not specified, returns all programs.
 * @param {number} curriculumId - optional ID for a specified curriculum
 * @returns {Array<Program>} - programs belonging to the curriculumId if specified, or all programs.
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
 * @param {number} programId - The program ID for the specified program
 * @returns {Program} - The program data for the specified program ID
 */
export const findProgram = (programId: number): Promise<Program> => {
  return db<Program>('programs').where('id', programId).first();
};

/**
 * Return a list of curriculum activities that match the given curriculum id
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
 * @param {number} activityId - the id for the unique activity we are looking for.
 * @returns {CurriculumActivity} - the specified activity, or null if not found.
 *
 * @example
 * // Correct usage.
 * findCurriculumActivity(1);
 */
export const findCurriculumActivity = (
  activityId: number
): Promise<CurriculumActivity> => {
  return db<CurriculumActivity>('activities').first().where('id', activityId);
};

/**
 *
 * @param {number} programId - The program ID for the specified program
 * @returns {programActivities} - An array of program activities
 */
export const listProgramActivities = async (
  programId: number
): Promise<ProgramActivity[]> => {
  const program = await findProgram(programId);
  const curriculumActivities = await listCurriculumActivities(
    program.curriculum_id
  );

  const calculateProgramActivityDate = (week: number, day: number) => {
    const programActivityDate = new Date(program.start_date);
    const offsetDays = (week - 1) * 7 + (day - 1);

    programActivityDate.setDate(programActivityDate.getDate() + offsetDays);

    return programActivityDate.toDateString();
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

      // If it's an all-day activity, let's set the time of the activity to midnight and the duration to 0
      if (activity.duration === null || activity.duration === 0) {
        startTime = new Date(`${activityDate} 00:00:00`);
        endTime = new Date(`${activityDate} 00:00:00`);
        duration = 0;
      }

      // However, if we specified a start and end time for the activity, use those instead
      else {
        startTime = new Date(`${activityDate} ${activity.start_time}`);
        endTime = new Date(`${activityDate} ${activity.end_time}`);
        duration = activity.duration;
      }

      return {
        title: activity.title,
        description_text: activity.description_text,
        program_id: programId,
        curriculum_activity_id: activity.id,
        activity_type: findActivityType.title,
        start_time: startTime,
        end_time: endTime,
        duration: duration,
      };
    }
  );

  console.log('programActivities being sent back: ', programActivities);

  return programActivities;
};

/**
 * Get an object of the program with acticity property which is a list of activities with specified program ID
 * @param {number} programId - the id for the unique program
 * @returns  {ProgramWithActivities }  - a specified program with an array of activities
 */
export const findProgramWithActivities = (
  programId: number
): Promise<ProgramWithActivities> => {
  return findProgram(programId).then(
    async (program): Promise<ProgramWithActivities> => {
      const pwa = program as ProgramWithActivities;
      pwa.activities = await listProgramActivities(program.id);
      return pwa;
    }
  );
};

/**
 * Get all programs with acticity property which is a list of activities
 * @returns {ProgramWithActivities[]} - an array contains all programs including their activities
 */
export const listProgramsWithActivities = (): Promise<
  ProgramWithActivities[]
> => {
  return listPrograms().then((programs): Promise<ProgramWithActivities[]> => {
    const promises: Promise<ProgramWithActivities>[] = [];
    programs.forEach(program => {
      promises.push(findProgramWithActivities(program.id));
    });
    return Promise.all(promises);
  });
};
