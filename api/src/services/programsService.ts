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
 * @returns {Program[]} - all programs in the db
 */
export const listPrograms = async () => {
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
    .where({ id: programId });
  return matchingProgram;
};

/**
 * Return a list of all curriculum activities in the database.
 *
 * @returns {CurriculumActivity[]} - An array of curriculum activities
 */
export const listCurriculumActivities = async () => {
  return await db<CurriculumActivity>('activities').select(
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
  );
};

/**
 * Return a list of curriculum activities that match the given curriculum ID.
 *
 * @param {number} curriculumId - The given curriculum id
 * @returns {CurriculumActivity[]} - An array of matching curriculum activities
 */

export const listCurriculumActivitiesForCurriculum = async (
  curriculumId: number
) => {
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
 * Helper function to calculate the date of a given program activity given the
 * program with which it's associated and the curriculum week and day of the
 * event.
 *
 * @param {Program} program - the program associated with the activity
 * @param {number} week - week number of the activity, starting with 1
 * @param {number} day - day of the curriculum week, starting with 1
 * @returns {DateTime} - a Luxon DateTime for the activity date
 */
const calculateProgramActivityDate = (
  program: Program,
  week: number,
  day: number
) => {
  const startDateLuxon = DateTime.fromISO(program.start_date, {
    zone: program.time_zone,
  });
  const programActivityDate = startDateLuxon.plus({
    weeks: week - 1,
    days: day - 1,
  });
  return programActivityDate;
};

/**
 * Generate the list of all program activities for a given program based on the
 * activities associated with the program’s curriculum and the list of all
 * activity types.
 *
 * @param {Program} program - The program whose activities we should generate
 * @param {CurriculumActivity[]} curriculumActivities - All curriculum activities
 *   in the database
 * @param {ActivityType[]} activityType - All activity types in the database
 * @returns {ProgramActivity[]} - An array of program activities
 */
export const constructProgramActivities = (
  program: Program,
  curriculumActivities: CurriculumActivity[],
  activityTypes: ActivityType[]
) => {
  const matchingCurriculumActivities = curriculumActivities.filter(
    activity => activity.curriculum_id === program.curriculum_id
  );
  const programActivities: ProgramActivity[] = matchingCurriculumActivities.map(
    activity => {
      const activityType = activityTypes.find(
        element => activity.activity_type_id === element.id
      );

      const activityDate = calculateProgramActivityDate(
        program,
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
        program_id: program.id,
        curriculum_activity_id: activity.id,
        activity_type: activityType.title,
        start_time: startTime.toISO(),
        end_time: endTime.toISO(),
        duration: duration,
      } as ProgramActivity;
    }
  );
  return programActivities;
};

/**
 * Retrieve all activity types from the database.
 *
 * @returns {ActivityType[]} - array of all activity types from the database
 */
export const listActivityTypes = async () => {
  return await db<ActivityType>('activity_types').select('id', 'title');
};

/**
 * Retrieve the details for a given program, including all program activities
 * as a member of that program.
 *
 * @param {number} programId - the id for the unique program
 * @returns {ProgramWithActivities} - a specified program containing an array
 *   of activities
 */
export const findProgramWithActivities = async (programId: number) => {
  const program = await findProgram(programId);
  const allCurriculumActivities = await listCurriculumActivities();
  const activityTypes = await listActivityTypes();

  const pwa: ProgramWithActivities = {
    ...program,
    activities: constructProgramActivities(
      program,
      allCurriculumActivities,
      activityTypes
    ),
  };

  return pwa;
};

/**
 * Retrieve the details for all programs in the database, including all program
 * activities as a member of that program.
 *
 * @returns {ProgramWithActivities[]} - all programs with their activities
 */
export const listProgramsWithActivities = async () => {
  const allPrograms = await listPrograms();
  const allCurriculumActivities = await listCurriculumActivities();
  const activityTypes = await listActivityTypes();

  const programsWithActivities: ProgramWithActivities[] = allPrograms.map(
    program => ({
      ...program,
      activities: constructProgramActivities(
        program,
        allCurriculumActivities,
        activityTypes
      ),
    })
  );

  return programsWithActivities;
};

/**
 * Get the id of the row in the `participant_activities` table that belongs to
 * the given user, program, and activity if it exists, Otherwise it returns null.
 *
 * @param {number} principalId - the unique id for the user
 * @param {number} programId - the id for the unique program
 * @param {number} activityId - the id for the unique activity
 * @returns - Either id of matching row in the table or null if participantActivity doesn't exists
 */
export const getParticipantActivityId = async (
  principalId: number,
  programId: number,
  activityId: number
) => {
  const [participantActivity] = await db('participant_activities')
    .select('id')
    .where({
      principal_id: principalId,
      program_id: programId,
      activity_id: activityId,
    });
  if (!participantActivity) return null;
  return participantActivity.id;
};

/**
 * Get the completion status (either true or false) of the specific activity.
 *
 * @param {number} principalId - the unique id for the user
 * @param {number} programId - the id for the unique program
 * @param {number} activityId - the id for the unique activity
 * @returns {Object} - return the completion status (true or false) of the activity by the given participantActivityId.
 *                     If participantActivityId doesn't exist, the completion status is false.
 */
export const getParticipantActivityCompletion = async (
  principalId: number,
  programId: number,
  activityId: number
) => {
  const participantActivityId = await getParticipantActivityId(
    principalId,
    programId,
    activityId
  );
  if (!participantActivityId) return { completed: false };
  const [participantActivity] = await db('participant_activities')
    .select('activity_id', 'id', 'completed')
    .where({ id: participantActivityId });
  return {
    completed: participantActivity.completed === 1,
  };
};

/**
 *  Set/Update the completion status of the specific activity.
 *  Insert a new row and if conflict occurs which means it already has a row matching 'program_id', 'principal_id', 'activity_id',
 *  then .merge({}) to update with 'completed' field to what we received from a user.
 *
 * @param {number} principalId - the unique id for the user
 * @param {number} programId - the id for the unique program
 * @param {number} activityId - the id for the unique activity
 * @param {boolean} completed - the boolean value that a user wants to set
 *    into the completed field
 * @returns {Object} - return the participantActivityId and the completion status (true or false) of an inserted row in the table
 */
export const setParticipantActivityCompletion = async (
  principalId: number,
  programId: number,
  activityId: number,
  completed: boolean
) => {
  await db('participant_activities')
    .insert({
      principal_id: principalId,
      program_id: programId,
      activity_id: activityId,
      completed: completed,
    })
    .onConflict(['program_id', 'principal_id', 'activity_id'])
    .merge({ completed: completed });

  const [participantActivity] = await db('participant_activities')
    .select('id', 'completed')
    .where({
      principal_id: principalId,
      program_id: programId,
      activity_id: activityId,
    });

  return {
    participantActivityId: participantActivity.id,
    completed: participantActivity.completed === 1,
  };
};
