import db from './db';

export const listPrograms = async () => {
  const foundPrograms = await db('programs');
  return foundPrograms ?? [];
};

export const findProgram = async (programId: number) => {
  return (await db('programs').where('id', programId)) ?? [];
};

export const listCurriculumActivities = async (curriculumId?: number) => {
  let foundActivities;

  if (curriculumId) {
    foundActivities = await db('activities')
      .select(
        'activities.title',
        'activities.description_text',
        'activities.curriculum_week',
        'activities.curriculum_day',
        'activities.start_time',
        'activities.end_time',
        'activities.duration',
        'activity_types.title as activity_type'
      )
      .leftJoin(
        'activity_types',
        'activities.activity_type_id',
        'activity_types.id'
      )
      .where({ curriculum_id: curriculumId });
  } else {
    foundActivities = await db('activities');
  }
  return foundActivities ?? [];
};

export const findActivity = async (activityId: number) => {
  return (await db('activities').where('id', activityId)) ?? [];
};
