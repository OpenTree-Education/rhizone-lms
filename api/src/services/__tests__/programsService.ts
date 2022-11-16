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
      const programsList: Program[] = [
        {
          id: 1,
          principal_id: 2,
          curriculum_id: 1,
          title: 'Cohort 4',
          start_date: '2022-10-24',
          end_date: '2022-12-16',
          created_at: '2022-11-15 01:23:45',
          updated_at: '2022-11-15 01:23:45',
        },
        {
          id: 2,
          principal_id: 2,
          curriculum_id: 2,
          title: 'Cohort 5',
          start_date: '2022-10-24',
          end_date: '2022-12-16',
          created_at: '2022-11-15 01:23:45',
          updated_at: '2022-11-15 01:23:45',
        },
        {
          id: 3,
          principal_id: 2,
          curriculum_id: 1,
          title: 'Cohort 6',
          start_date: '2023-01-02',
          end_date: '2023-02-24',
          created_at: '2022-11-15 01:23:45',
          updated_at: '2022-11-15 01:23:45',
        },
      ];
      mockQuery('select * from `programs`', [], programsList);
      expect(await listPrograms()).toEqual(programsList);
    });
  });
  describe('findProgram', () => {
    it('should give the details of the specified program', async () => {
      const programId = 2;
      const program: Program = {
        id: 2,
        principal_id: 2,
        curriculum_id: 2,
        title: 'Cohort 5',
        start_date: '2022-10-24',
        end_date: '2022-12-16',
        created_at: '2022-11-15 01:23:45',
        updated_at: '2022-11-15 01:23:45',
      };
      mockQuery(
        'select * from `programs` where `id` = ? limit ?',
        [programId, 1],
        program
      );
      expect(await findProgram(programId)).toEqual(program);
    });
  });
  describe('listCurriculumActivities', () => {
    it('should list all available activities for the specified curriculum', async () => {
      const curriculumId = 1;
      const curriculumActivitiesList: CurriculumActivity[] = [
        {
          id: 1,
          title: 'Morning Standup',
          description_text: '',
          curriculum_week: 1,
          curriculum_day: 1,
          start_time: '10:00:00',
          end_time: '11:00:00',
          duration: 60,
          activity_type_id: 3,
          curriculum_id: 1,
          created_at: '2022-11-15 01:23:45',
          updated_at: '2022-11-15 01:23:45',
        },
        {
          id: 2,
          title: 'Self-introduction',
          description_text: 'Get to know each other.',
          curriculum_week: 1,
          curriculum_day: 1,
          start_time: '11:10:00',
          end_time: '12:00:00',
          duration: 50,
          activity_type_id: 1,
          curriculum_id: 1,
          created_at: '2022-11-15 01:23:45',
          updated_at: '2022-11-15 01:23:45',
        },
        {
          id: 3,
          title: 'Self-assessment',
          description_text: '',
          curriculum_week: 1,
          curriculum_day: 2,
          start_time: null,
          end_time: null,
          duration: null,
          activity_type_id: 2,
          curriculum_id: 1,
          created_at: '2022-11-15 01:23:45',
          updated_at: '2022-11-15 01:23:45',
        },
      ];
      mockQuery(
        'select * from `activities` where `curriculum_id` = ?',
        [curriculumId],
        curriculumActivitiesList
      );
      expect(await listCurriculumActivities(curriculumId)).toEqual(
        curriculumActivitiesList
      );
    });
  });

  describe('findCurriculumActivity', () => {
    it('should give the details of the specified curriculum activity', async () => {
      const curriculumActivityId = 1;
      const curriculumActivity: CurriculumActivity = {
        id: 1,
        created_at: '10:00:00',
        updated_at: '10:00:00',
        title: 'makeSampleData',
        description_text: 'create some mock data',
        curriculum_week: 4,
        curriculum_day: 3,
        start_time: '10:00:00',
        end_time: '15:00:00',
        duration: 5,
        activity_type_id: 1,
        curriculum_id: 1,
      };
      mockQuery(
        'select * from `activities` where `id` = ? limit ?',
        [curriculumActivityId, 1],
        curriculumActivity
      );
      expect(await findCurriculumActivity(curriculumActivityId)).toEqual(
        curriculumActivity
      );
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
