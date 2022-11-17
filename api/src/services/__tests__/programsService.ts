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
  ActivityType,
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

    it('should list all available programs with a given curriculum ID', async () => {
      const curriculumId = 2;
      const programsList: Program[] = [
        {
          id: 2,
          title: 'Cohort 5',
          start_date: '2022-10-24',
          end_date: '2022-12-16',
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
          start_time: new Date('2022-10-24 10:00:00'),
          end_time: new Date('2022-10-24 11:00:00'),
          duration: 60,
        },
        {
          title: 'Self-introduction',
          description_text: 'Get to know each other.',
          program_id: 2,
          curriculum_activity_id: 5,
          activity_type: 'class',
          start_time: new Date('2022-10-24 11:10:00'),
          end_time: new Date('2022-10-24 12:00:00'),
          duration: 50,
        },
        {
          title: 'Self-assessment',
          description_text: '',
          program_id: 2,
          curriculum_activity_id: 6,
          activity_type: 'assignment',
          start_time: new Date('2022-10-25 00:00:00'),
          end_time: new Date('2022-10-25 00:00:00'),
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

  describe('listProgramsWithActivities', () => {
    it('should list all available programs including their activities', async () => {
      const programsList = [
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

      const curriculumActivitiesListOne: CurriculumActivity[] = [
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

      const curriculumActivitiesListTwo: CurriculumActivity[] = [
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
      const programActivitiesList = [
        [
          //Program 1's activities (Curriculum 1)
          {
            title: 'Morning Standup',
            description_text: '',
            program_id: 1,
            curriculum_activity_id: 1,
            activity_type: 'standup',
            start_time: new Date('2022-10-24 10:00:00'),
            end_time: new Date('2022-10-24 11:00:00'),
            duration: 60,
          },
          {
            title: 'Self-introduction',
            description_text: 'Get to know each other.',
            program_id: 1,
            curriculum_activity_id: 2,
            activity_type: 'class',
            start_time: new Date('2022-10-24 11:10:00'),
            end_time: new Date('2022-10-24 12:00:00'),
            duration: 50,
          },
          {
            title: 'Self-assessment',
            description_text: '',
            program_id: 1,
            curriculum_activity_id: 3,
            activity_type: 'assignment',
            start_time: new Date('2022-10-25 00:00:00'),
            end_time: new Date('2022-10-25 00:00:00'),
            duration: 0,
          },
        ],
        //Program 2's activities (Curriculum 2)
        [
          {
            title: 'Morning Standup',
            description_text: '',
            program_id: 2,
            curriculum_activity_id: 4,
            activity_type: 'standup',
            start_time: new Date('2022-10-24 10:00:00'),
            end_time: new Date('2022-10-24 11:00:00'),
            duration: 60,
          },
          {
            title: 'Self-introduction',
            description_text: 'Get to know each other.',
            program_id: 2,
            curriculum_activity_id: 5,
            activity_type: 'class',
            start_time: new Date('2022-10-24 11:10:00'),
            end_time: new Date('2022-10-24 12:00:00'),
            duration: 50,
          },
          {
            title: 'Self-assessment',
            description_text: '',
            program_id: 2,
            curriculum_activity_id: 6,
            activity_type: 'assignment',
            start_time: new Date('2022-10-25 00:00:00'),
            end_time: new Date('2022-10-25 00:00:00'),
            duration: 0,
          },
        ],
        //Program 3's activities (Curriculum 1)
        [
          {
            title: 'Morning Standup',
            description_text: '',
            program_id: 3,
            curriculum_activity_id: 1,
            activity_type: 'standup',
            start_time: new Date('2023-01-02 10:00:00'),
            end_time: new Date('2023-01-02 11:00:00'),
            duration: 60,
          },
          {
            title: 'Self-introduction',
            description_text: 'Get to know each other.',
            program_id: 3,
            curriculum_activity_id: 2,
            activity_type: 'class',
            start_time: new Date('2023-01-02 11:10:00'),
            end_time: new Date('2023-01-02 12:00:00'),
            duration: 50,
          },
          {
            title: 'Self-assessment',
            description_text: '',
            program_id: 3,
            curriculum_activity_id: 3,
            activity_type: 'assignment',
            start_time: new Date('2023-01-03 00:00:00'),
            end_time: new Date('2023-01-03 00:00:00'),
            duration: 0,
          },
        ],
      ];

      const programsWithActivitiesList: ProgramWithActivities[] = [];

      programsList.forEach((program, idx) => {
        const programWithActivities = program as ProgramWithActivities;
        programWithActivities.activities = programActivitiesList[idx];
        programsWithActivitiesList.push(programWithActivities);
      });

      // List All Programs
      mockQuery('select * from `programs`', [], programsList);

      // Program 1
      // findProgram
      mockQuery(
        'select * from `programs` where `id` = ? limit ?',
        [programsList[0].id, 1],
        programsList[0]
      );

      // findProgram
      mockQuery(
        'select * from `programs` where `id` = ? limit ?',
        [programsList[0].id, 1],
        programsList[0]
      );

      // listCurriculumActivities
      mockQuery(
        'select * from `activities` where `curriculum_id` = ?',
        [programsList[0].curriculum_id],
        curriculumActivitiesListOne
      );

      // activityTypes
      mockQuery('select * from `activity_types`', [], activityTypesList);

      // Program 2
      // findProgram
      mockQuery(
        'select * from `programs` where `id` = ? limit ?',
        [programsList[1].id, 1],
        programsList[1]
      );

      //findProgram
      mockQuery(
        'select * from `programs` where `id` = ? limit ?',
        [programsList[1].id, 1],
        programsList[1]
      );

      //listCurriculumActivities
      mockQuery(
        'select * from `activities` where `curriculum_id` = ?',
        [programsList[1].curriculum_id],
        curriculumActivitiesListTwo
      );

      // activityTypes
      mockQuery('select * from `activity_types`', [], activityTypesList);

      // Program 3
      // findProgram
      mockQuery(
        'select * from `programs` where `id` = ? limit ?',
        [programsList[2].id, 1],
        programsList[2]
      );

      // findProgram
      mockQuery(
        'select * from `programs` where `id` = ? limit ?',
        [programsList[2].id, 1],
        programsList[2]
      );

      // listCurriculumActivities
      mockQuery(
        'select * from `activities` where `curriculum_id` = ?',
        [programsList[2].curriculum_id],
        curriculumActivitiesListOne
      );

      // activityTypes
      mockQuery('select * from `activity_types`', [], activityTypesList);

      expect(await listProgramsWithActivities()).toEqual(
        programsWithActivitiesList
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
          start_time: new Date('2022-10-24 10:00:00'),
          end_time: new Date('2022-10-24 11:00:00'),
          duration: 60,
        },
        {
          title: 'Self-introduction',
          description_text: 'Get to know each other.',
          program_id: 2,
          curriculum_activity_id: 5,
          activity_type: 'class',
          start_time: new Date('2022-10-24 11:10:00'),
          end_time: new Date('2022-10-24 12:00:00'),
          duration: 50,
        },
        {
          title: 'Self-assessment',
          description_text: '',
          program_id: 2,
          curriculum_activity_id: 6,
          activity_type: 'assignment',
          start_time: new Date('2022-10-25 00:00:00'),
          end_time: new Date('2022-10-25 00:00:00'),
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

      const programWithActivities = program as ProgramWithActivities;
      programWithActivities.activities = programActivitiesList;

      // findProgram
      mockQuery(
        'select * from `programs` where `id` = ? limit ?',
        [programId, 1],
        program
      );

      //findProgram
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
