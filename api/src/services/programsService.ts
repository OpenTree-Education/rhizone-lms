import db from './db';
import {
  Program,
  ProgramActivity,
  ProgramWithActivities,
  CurriculumActivity,
  ActivityType,
  ParticipantActivity,
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
 * Temporary workaround to check if the `participant_activities` table has been
 * pre-filled with data for each program assignment. If it hasn't, perform some
 * inserts to fill in the missing data.
 *
 * @param {number} principalId - restrict result to programs with which the
 *   user is associated
 * @param {ProgramWithActivities[]} programsWithActivities - list of programs
 *   with which user is associated, and their associated activities
 * @returns {Array} - default return value from a database insert; leaving in
 *   to make function easier to test with Jest
 */
export const checkForPrefill = async (
  principalId?: number,
  programsWithActivities?: ProgramWithActivities[]
) => {
  if (!principalId) {
    return;
  }

  const allParticipantActivities = await db('participant_activities')
    .select('program_id', 'activity_id', 'principal_id', 'completed')
    .where({ principal_id: principalId });

  const rowsToInsert: {
    principal_id: number;
    program_id: number;
    activity_id: number;
    completed: boolean;
  }[] = [];

  for (const program of programsWithActivities) {
    const programAssignments: ProgramActivity[] = JSON.parse(
      JSON.stringify(program.activities)
    ).filter((activity: ProgramActivity) => {
      return activity.activity_type === 'assignment';
    });

    const programParticipantActivities = JSON.parse(
      JSON.stringify(allParticipantActivities)
    ).filter((ppa: ParticipantActivity) => {
      return ppa.program_id === program.id;
    });

    if (programAssignments.length > programParticipantActivities.length) {
      for (const assignment of programAssignments) {
        rowsToInsert.push({
          principal_id: principalId,
          program_id: program.id,
          activity_id: assignment.curriculum_activity_id,
          completed: false,
        });
      }
    }
  }

  if (rowsToInsert.length > 0) {
    return await db('participant_activities')
      .insert(rowsToInsert)
      .onConflict(['program_id', 'principal_id', 'activity_id'])
      .ignore();
  } else {
    return [];
  }
};

/**
 * Retrieve the details for all programs in the database, including all program
 * activities as a member of that program.
 *
 * @param {number} principalId - optional parameter to restrict result to
 *   programs with which the user is associated
 * @returns {ProgramWithActivities[]} - all programs with their activities
 */
export const listProgramsWithActivities = async (principalId?: number) => {
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

  // Temporary workaround until we have an admin feature
  await checkForPrefill(principalId, programsWithActivities);

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
 * Set/update the completion status of the specific activity. Insert a new row
 * or—if conflict occurs (which means it already has a row matching
 * (`program_id`, `principal_id`, and `activity_id`)—merge to update the
 * `completed` field to what we received from the user.
 *
 * @param {number} principalId - the unique id for the user
 * @param {number} programId - the id for the unique program
 * @param {number} activityId - the id for the unique activity
 * @param {boolean} completed - whether or not the user has completed
 *   the given assignment
 * @returns {Object} - the ID of the row that was inserted or updated in the
 *   `participant_activities` table and the completion status of the activity
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

/**
 * Get the completion status (either true or false) of all activities of type
 * assignment in a given program.
 *
 * @param {number} principalId - the unique id for the user
 * @param {number} programId - the id for the unique program
 * @returns {ParticipantActivityForProgram} - the program ID and an array of
 *   the activity_id of the assignment and a boolean of its completion status
 */
export const listParticipantActivitiesCompletionForProgram = async (
  principalId: number,
  programId: number
) => {
  const participantActivities = await db('participant_activities')
    .select('activity_id', 'completed')
    .where({
      program_id: programId,
      principal_id: principalId,
    })
    .then(rows => {
      return rows.map(row => ({
        activity_id: row.activity_id,
        completed: row.completed === 1,
      }));
    });

  return {
    program_id: programId,
    participant_activities: participantActivities,
  };
};
