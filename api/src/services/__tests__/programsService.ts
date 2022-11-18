import {
  listPrograms,
  findProgram,
  listCurriculumActivities,
  findCurriculumActivity,
  listProgramActivities,
  findProgramWithActivities,
} from '../programsService';
import {
  Program,
  ProgramActivity,
  CurriculumActivity,
  ActivityType,
} from '../../models';
import { mockQuery } from '../mockDb';

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
          time_zone: 'America/Los_Angeles',
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
          time_zone: 'America/Los_Angeles',
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
          time_zone: 'America/Los_Angeles',
          created_at: '2022-11-15 01:23:45',
          updated_at: '2022-11-15 01:23:45',
        },
      ];
      mockQuery('select * from `programs`', [], programsList);
      expect(await listPrograms()).toEqual(programsList);
    });

    it('should list all available programs with a given curriculum ID', async () => {
      const curriculumId = 2;
      const programsList: Program[] = [
        {
          id: 2,
          title: 'Cohort 5',
          start_date: '2022-10-24',
          end_date: '2022-12-16',
          time_zone: 'America/Los_Angeles',
          principal_id: 2,
          curriculum_id: 2,
          created_at: '2022-11-15 01:23:45',
          updated_at: '2022-11-15 01:23:45',
        },
      ];
      mockQuery(
        'select * from `programs` where `curriculum_id` = ?',
        [curriculumId],
        programsList
      );
      expect(await listPrograms(curriculumId)).toEqual(programsList);
    });
  });

  describe('findProgram', () => {
    it('should give the details of the specified program', async () => {
      const programId = 2;
      const program: Program = {
        id: 2,
        principal_id: 2,
        curriculum_id: 2,
        time_zone: 'America/Los_Angeles',
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
    it('should list all available curriculum activities', async () => {
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
        {
          id: 4,
          title: 'Morning Standup',
          description_text: '',
          curriculum_week: 1,
          curriculum_day: 1,
          start_time: '10:00:00',
          end_time: '11:00:00',
          duration: 60,
          activity_type_id: 3,
          curriculum_id: 2,
          created_at: '2022-11-15 01:23:45',
          updated_at: '2022-11-15 01:23:45',
        },
        {
          id: 5,
          title: 'Self-introduction',
          description_text: 'Get to know each other.',
          curriculum_week: 1,
          curriculum_day: 1,
          start_time: '11:10:00',
          end_time: '12:00:00',
          duration: 50,
          activity_type_id: 1,
          curriculum_id: 2,
          created_at: '2022-11-15 01:23:45"',
          updated_at: '2022-11-15 01:23:45',
        },
        {
          id: 6,
          title: 'Self-assessment',
          description_text: '',
          curriculum_week: 1,
          curriculum_day: 2,
          start_time: null,
          end_time: null,
          duration: null,
          activity_type_id: 2,
          curriculum_id: 2,
          created_at: '2022-11-15 01:23:45',
          updated_at: '2022-11-15 01:23:45',
        },
      ];
      mockQuery('select * from `activities`', [], curriculumActivitiesList);
      expect(await listCurriculumActivities()).toEqual(
        curriculumActivitiesList
      );
    });

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
    it('should give the details of the specified program', async () => {
      const curriculumActivityId = 4;

      const curriculumActivity: CurriculumActivity = {
        id: 4,
        title: 'Morning Standup',
        description_text: '',
        curriculum_week: 1,
        curriculum_day: 1,
        start_time: '10:00:00',
        end_time: '11:00:00',
        duration: 60,
        activity_type_id: 3,
        curriculum_id: 2,
        created_at: '2022-11-15 01:23:45',
        updated_at: '2022-11-15 01:23:45',
      };

      mockQuery(
        'select * from `activities` where `id` = ? limit ?',
        [curriculumActivityId, 1], // binding param // replace above ? with the value // findProgram() get the first program object, so the limit is 1
        curriculumActivity
      );

      expect(await findCurriculumActivity(curriculumActivityId)).toEqual(
        curriculumActivity
      );
    });
  });

  describe('listProgramActivities', () => {
    it('should list all available activities for the specified program', async () => {
      const programId = 2;
      const curriculumId = 2;

      const program: Program = {
        id: 2,
        principal_id: 2,
        curriculum_id: 2,
        title: 'Cohort 5',
        start_date: '2022-10-24',
        end_date: '2022-12-16',
        time_zone: 'America/Los_Angeles',
        created_at: '2022-11-15 01:23:45',
        updated_at: '2022-11-15 01:23:45',
      };

      const curriculumActivitiesList: CurriculumActivity[] = [
        {
          id: 4,
          title: 'Morning Standup',
          description_text: '',
          curriculum_week: 1,
          curriculum_day: 1,
          start_time: '10:00:00',
          end_time: '11:00:00',
          duration: 60,
          activity_type_id: 3,
          curriculum_id: 2,
          created_at: '2022-11-15 01:23:45',
          updated_at: '2022-11-15 01:23:45',
        },
        {
          id: 5,
          title: 'Self-introduction',
          description_text: 'Get to know each other.',
          curriculum_week: 1,
          curriculum_day: 1,
          start_time: '11:10:00',
          end_time: '12:00:00',
          duration: 50,
          activity_type_id: 1,
          curriculum_id: 2,
          created_at: '2022-11-15 01:23:45',
          updated_at: '2022-11-15 01:23:45',
        },
        {
          id: 6,
          title: 'Self-assessment',
          description_text: '',
          curriculum_week: 1,
          curriculum_day: 2,
          start_time: null,
          end_time: null,
          duration: null,
          activity_type_id: 2,
          curriculum_id: 2,
          created_at: '2022-11-15 01:23:45',
          updated_at: '2022-11-15 01:23:45',
        },
      ];

      const programActivitiesList: ProgramActivity[] = [
        {
          title: 'Morning Standup',
          description_text: '',
          program_id: 2,
          curriculum_activity_id: 4,
          activity_type: 'standup',
          start_time: '2022-10-24T17:00:00.000Z',
          end_time: '2022-10-24T18:00:00.000Z',
          duration: 60,
        },
        {
          title: 'Self-introduction',
          description_text: 'Get to know each other.',
          program_id: 2,
          curriculum_activity_id: 5,
          activity_type: 'class',
          start_time: '2022-10-24T18:10:00.000Z',
          end_time: '2022-10-24T19:00:00.000Z',
          duration: 50,
        },
        {
          title: 'Self-assessment',
          description_text: '',
          program_id: 2,
          curriculum_activity_id: 6,
          activity_type: 'assignment',
          start_time: '2022-10-25T07:00:00.000Z',
          end_time: '2022-10-25T07:00:00.000Z',
          duration: 0,
        },
      ];

      const activityTypesList: ActivityType[] = [
        {
          id: 1,
          title: 'class',
          created_at: '2022-11-15 01:23:45',
          updated_at: '2022-11-15 01:23:45',
        },
        {
          id: 2,
          title: 'assignment',
          created_at: '2022-11-15 01:23:45',
          updated_at: '2022-11-15 01:23:45',
        },
        {
          id: 3,
          title: 'standup',
          created_at: '2022-11-15 01:23:45',
          updated_at: '2022-11-15 01:23:45',
        },
        {
          id: 4,
          title: 'retrospective',
          created_at: '2022-11-15 01:23:45',
          updated_at: '2022-11-15 01:23:45',
        },
      ];

      // findProgram
      mockQuery(
        'select * from `programs` where `id` = ? limit ?',
        [programId, 1],
        program
      );

      // listCurriculumActivities
      mockQuery(
        'select * from `activities` where `curriculum_id` = ?',
        [curriculumId],
        curriculumActivitiesList
      );

      // activity types
      mockQuery('select * from `activity_types`', [], activityTypesList);

      // listProgramActivities
      expect(await listProgramActivities(programId)).toEqual(
        programActivitiesList
      );
    });
  });

  describe('findProgramWithActivities', () => {
    it('should give the details of the specified program including its activities', async () => {
      const programId = 2;

      const program: Program = {
        id: 2,
        principal_id: 2,
        curriculum_id: 2,
        title: 'Cohort 5',
        start_date: '2022-10-24',
        end_date: '2022-12-16',
        time_zone: 'America/Los_Angeles',
        created_at: '2022-11-15 01:23:45',
        updated_at: '2022-11-15 01:23:45',
      };

      const curriculumActivitiesList: CurriculumActivity[] = [
        {
          id: 4,
          title: 'Morning Standup',
          description_text: '',
          curriculum_week: 1,
          curriculum_day: 1,
          start_time: '10:00:00',
          end_time: '11:00:00',
          duration: 60,
          activity_type_id: 3,
          curriculum_id: 2,
          created_at: '2022-11-15 01:23:45',
          updated_at: '2022-11-15 01:23:45',
        },
        {
          id: 5,
          title: 'Self-introduction',
          description_text: 'Get to know each other.',
          curriculum_week: 1,
          curriculum_day: 1,
          start_time: '11:10:00',
          end_time: '12:00:00',
          duration: 50,
          activity_type_id: 1,
          curriculum_id: 2,
          created_at: '2022-11-15 01:23:45',
          updated_at: '2022-11-15 01:23:45',
        },
        {
          id: 6,
          title: 'Self-assessment',
          description_text: '',
          curriculum_week: 1,
          curriculum_day: 2,
          start_time: null,
          end_time: null,
          duration: null,
          activity_type_id: 2,
          curriculum_id: 2,
          created_at: '2022-11-15 01:23:45',
          updated_at: '2022-11-15 01:23:45',
        },
      ];

      const programActivitiesList: ProgramActivity[] = [
        {
          title: 'Morning Standup',
          description_text: '',
          program_id: 2,
          curriculum_activity_id: 4,
          activity_type: 'standup',
          start_time: '2022-10-24T17:00:00.000Z',
          end_time: '2022-10-24T18:00:00.000Z',
          duration: 60,
        },
        {
          title: 'Self-introduction',
          description_text: 'Get to know each other.',
          program_id: 2,
          curriculum_activity_id: 5,
          activity_type: 'class',
          start_time: '2022-10-24T18:10:00.000Z',
          end_time: '2022-10-24T19:00:00.000Z',
          duration: 50,
        },
        {
          title: 'Self-assessment',
          description_text: '',
          program_id: 2,
          curriculum_activity_id: 6,
          activity_type: 'assignment',
          start_time: '2022-10-25T07:00:00.000Z',
          end_time: '2022-10-25T07:00:00.000Z',
          duration: 0,
        },
      ];

      const activityTypesList: ActivityType[] = [
        {
          id: 1,
          title: 'class',
          created_at: '2022-11-15 01:23:45',
          updated_at: '2022-11-15 01:23:45',
        },
        {
          id: 2,
          title: 'assignment',
          created_at: '2022-11-15 01:23:45',
          updated_at: '2022-11-15 01:23:45',
        },
        {
          id: 3,
          title: 'standup',
          created_at: '2022-11-15 01:23:45',
          updated_at: '2022-11-15 01:23:45',
        },
        {
          id: 4,
          title: 'retrospective',
          created_at: '2022-11-15 01:23:45',
          updated_at: '2022-11-15 01:23:45',
        },
      ];

      const programWithActivities = JSON.parse(JSON.stringify(program));
      programWithActivities.activities = programActivitiesList;

      // findProgram
      mockQuery(
        'select * from `programs` where `id` = ? limit ?',
        [programId, 1],
        program
      );

      //listCurriculumActivities
      mockQuery(
        'select * from `activities` where `curriculum_id` = ?',
        [program.curriculum_id],
        curriculumActivitiesList
      );

      // activityTypes
      mockQuery('select * from `activity_types`', [], activityTypesList);

      expect(await findProgramWithActivities(programId)).toEqual(
        programWithActivities
      );
    });
  });
});
