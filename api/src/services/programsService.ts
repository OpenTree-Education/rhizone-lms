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
 * Returns the curriculum activities associated with an optionally specified curriculum ID. If ID is not specified, returns all curiculum activities.
 * @param {number} curriculumId - optional ID for a specified curriculum
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

// TODO: function header
export const listProgramActivities = async (
  programId: number
): Promise<ProgramActivity[]> => {
  const program = await findProgram(programId);
  const curriculumActivities = await listCurriculumActivities(
    program.curriculum_id
  );
  const activityTypes = await db<ActivityType>('actitivity_types');
  const programActivities: ProgramActivity[] = [];

  // TODO: manipulation here

  return programActivities;
};

// TODO: function header
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

// TODO: function header
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
