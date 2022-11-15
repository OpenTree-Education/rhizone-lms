import {
  listPrograms,
  findProgram,
  listCurriculumActivities,
  findCurriculumActivity,
  listProgramActivities,
  listProgramsWithActivities,
  findProgramWithActivities,
} from '../programsService';
import {
  Program,
  ProgramActivity,
  ProgramWithActivities,
  CurriculumActivity,
  Curriculum,
} from '../../models';
import { mockQuery } from '../mockDb';

/*
  Assume this is the data that will be in the database before your test is run.
  In a text document stored on one of your pair programming partner's computers,
  write down what you think the return value should be from your function given
  the following data is the current state of the database.

  Do *not* reference any of the example data that appear in the V020 migration.
  As far as these tests are concerned, the database *only* contains the data
  you see below.

  If your function takes a parameter, you'll also need to specify the parameter
  value, and the return value of the function should match the data when that
  specific parameter is passed.

  HINT: use the types defined in models.d.ts to conform the return value to the
  expected structure.

  # ACTIVITIES:
  id, title, description_text, curriculum_week, curriculum_day, start_time, end_time, duration, activity_type_id, curriculum_id, created_at, updated_at
  1, 'Morning Standup', '', 1, 1, '10:00:00', '11:00:00', 60, 3, 1, "2022-11-15 01:23:45", "2022-11-15 01:23:45"
  2, 'Self-introduction', 'Get to know each other.', 1, 1, '11:10:00', '12:00:00', 50, 1, 1, "2022-11-15 01:23:45", "2022-11-15 01:23:45"
  3, 'Self-assessment', '', 1, 2, NULL, NULL, NULL, 2, 1, "2022-11-15 01:23:45", "2022-11-15 01:23:45"
  4, 'Morning Standup', '', 1, 1, '10:00:00', '11:00:00', 60, 3, 2, "2022-11-15 01:23:45", "2022-11-15 01:23:45"
  5, 'Self-introduction', 'Get to know each other.', 1, 1, '11:10:00', '12:00:00', 50, 1, 2, "2022-11-15 01:23:45", "2022-11-15 01:23:45"
  6, 'Self-assessment', '', 1, 2, NULL, NULL, NULL, 2, 2, "2022-11-15 01:23:45", "2022-11-15 01:23:45"

  # PROGRAMS:
  id, principal_id, curriculum_id, title, start_date, end_date, created_at, updated_at
  1, 2, 1, 'Cohort 4', '2022-10-24', '2022-12-16', "2022-11-15 01:23:45", "2022-11-15 01:23:45"
  2, 2, 2, 'Cohort 5', '2022-10-24', '2022-12-16', "2022-11-15 01:23:45", "2022-11-15 01:23:45"
  3, 2, 1, 'Cohort 6', '2023-01-02', '2023-02-24', "2022-11-15 01:23:45", "2022-11-15 01:23:45"

  # CURRICULUMS:
  id, principal_id, title, created_at, updated_at
  1, 2, 'Professional Mentorship Program', "2022-11-15 01:23:45", "2022-11-15 01:23:45"
  2, 2, 'Honors Professional Mentorship Program', "2022-11-15 01:23:45", "2022-11-15 01:23:45"
*/

describe('programsService', () => {
  describe('listPrograms', () => {
    it('should list all available programs', async () => {
      let programsList: Program[];
    });
  });
  describe('findProgram', () => {
    it('should give the details of the specified program', async () => {
      let programId: number;
      let program: Program;
    });
  });
  describe('listCurriculumActivities', () => {
    it('should list all available activities for the specified curriculum', async () => {
      let curriculumActivityList: CurriculumActivity[];
    });
  });
  describe('findCurriculumActivity', () => {
    it('should give the details of the specified curriculum activity', async () => {
      let curriculumActivityId: number;
      let curriculumActivity: CurriculumActivity;
    });
  });
  describe('listProgramActivities', () => {
    it('should list all available activities for the specified program', async () => {
      let programId: number;
      let program: Program;
      let curriculumActivitiesList: CurriculumActivity[];
      let programActivitiesList: ProgramActivity[];
    });
  });
  describe('findProgramWithActivities', () => {
    it('should give the details of the specified program including its activities', async () => {
      let programId: number;
      let program: Program;
      let curriculumActivitiesList: CurriculumActivity[];
      let programActivitiesList: ProgramActivity[];
      let programWithActivities: ProgramWithActivities;
    });
  });
  describe('listProgramsWithActivities', () => {
    it('should list all available programs including their activities', async () => {
      let programsList: Program[];
      let curriculumActivitiesLists: [CurriculumActivity[]];
      let programsWithActivitiesList: ProgramWithActivities[];
    });
  });
});
