import db from './db';
import {
  Program,
  ProgramActivity,
  ProgramWithActivities,
  CurriculumActivity,
} from '../models';

export const listPrograms = (curriculumId?: number): Promise<Program[]> => {
  if (curriculumId) {
    return db<Program>('programs').where({ curriculum_id: curriculumId });
  } else {
    return db<Program>('programs');
  }
};

export const findProgram = (programId: number): Promise<Program> => {
  return db<Program>('programs').first().where('id', programId);
};

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

export const findCurriculumActivity = (
  activityId: number
): Promise<CurriculumActivity> => {
  return db<CurriculumActivity>('activities').first().where('id', activityId);
};

export const listProgramActivities = async (
  programId: number
): Promise<ProgramActivity[]> => {
  const program = await findProgram(programId);
  const curriculumActivities = await listCurriculumActivities(
    program.curriculum_id
  );
  const programActivities: ProgramActivity[] = [];

  // TODO: manipulation here

  return programActivities;
};

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
