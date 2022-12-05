import {
  listPrograms,
  findProgram,
  listCurriculumActivities,
  listCurriculumActivitiesForCurriculum,
  findCurriculumActivity,
  constructProgramActivities,
  listActivityTypes,
  findProgramWithActivities,
  listProgramsForCurriculum,
  listProgramsWithActivities,
} from '../programsService';
import {
  Program,
  ProgramActivity,
  CurriculumActivity,
  ActivityType,
  ProgramWithActivities,
} from '../../models';

import { mockQuery } from '../mockDb';

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
const programActivitiesList: ProgramActivity[][] = [
  [
    {
      title: 'Morning Standup',
      description_text: '',
      program_id: 1,
      curriculum_activity_id: 1,
      activity_type: 'standup',
      start_time: '2022-10-24T17:00:00.000Z',
      end_time: '2022-10-24T18:00:00.000Z',
      duration: 60,
    },
    {
      title: 'Self-introduction',
      description_text: 'Get to know each other.',
      program_id: 1,
      curriculum_activity_id: 2,
      activity_type: 'class',
      start_time: '2022-10-24T18:10:00.000Z',
      end_time: '2022-10-24T19:00:00.000Z',
      duration: 50,
    },
    {
      title: 'Self-assessment',
      description_text: '',
      program_id: 1,
      curriculum_activity_id: 3,
      activity_type: 'assignment',
      start_time: '2022-10-25T07:00:00.000Z',
      end_time: '2022-10-25T07:00:00.000Z',
      duration: 0,
    },
  ],
  [
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
  ],
  [
    {
      title: 'Morning Standup',
      description_text: '',
      program_id: 3,
      curriculum_activity_id: 1,
      activity_type: 'standup',
      start_time: '2023-01-02T18:00:00.000Z',
      end_time: '2023-01-02T19:00:00.000Z',
      duration: 60,
    },
    {
      title: 'Self-introduction',
      description_text: 'Get to know each other.',
      program_id: 3,
      curriculum_activity_id: 2,
      activity_type: 'class',
      start_time: '2023-01-02T19:10:00.000Z',
      end_time: '2023-01-02T20:00:00.000Z',
      duration: 50,
    },
    {
      title: 'Self-assessment',
      description_text: '',
      program_id: 3,
      curriculum_activity_id: 3,
      activity_type: 'assignment',
      start_time: '2023-01-03T08:00:00.000Z',
      end_time: '2023-01-03T08:00:00.000Z',
      duration: 0,
    },
  ],
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

// TODO: Define some example participant_activity data

describe('programsService', () => {
  describe('listAllPrograms', () => {
    it('should list all available programs', async () => {
      mockQuery(
        'select `id`, `title`, `start_date`, `end_date`, `time_zone`, `curriculum_id` from `programs`',
        [],
        programsList
      );
      expect(await listPrograms()).toEqual(programsList);
    });
  });
  describe('listProgramsForCurriculum', () => {
    it('should list all available programs with a given curriculum ID', async () => {
      const curriculumId = 2;
      const matchingPrograms: Program[] = [programsList[1]];
      mockQuery(
        'select `id`, `title`, `start_date`, `end_date`, `time_zone`, `curriculum_id` from `programs` where `curriculum_id` = ?',
        [curriculumId],
        matchingPrograms
      );
      expect(await listProgramsForCurriculum(curriculumId)).toEqual(
        matchingPrograms
      );
    });
  });
  describe('findProgram', () => {
    it('should give the details of the specified program', async () => {
      const programId = 2;
      const [matchingProgram] = [programsList[1]];
      mockQuery(
        'select `id`, `title`, `start_date`, `end_date`, `time_zone`, `curriculum_id` from `programs` where `id` = ?',
        [programId],
        [programsList[1]]
      );
      expect(await findProgram(programId)).toEqual(matchingProgram);
    });
  });
  describe('listCurriculumActivities', () => {
    it('should list all available curriculum activities', async () => {
      mockQuery(
        'select `id`, `title`, `description_text`, `curriculum_week`, `curriculum_day`, `start_time`, `end_time`, `duration`, `activity_type_id`, `curriculum_id` from `activities`',
        [],
        curriculumActivitiesList
      );
      expect(await listCurriculumActivities()).toEqual(
        curriculumActivitiesList
      );
    });
  });
  describe('listCurriculumActivitiesForCurriculum', () => {
    it('should list all available activities for the specified curriculum', async () => {
      const curriculumId = 1;
      const matchingCurriculumActivities: CurriculumActivity[] = [
        curriculumActivitiesList[0],
        curriculumActivitiesList[1],
        curriculumActivitiesList[2],
      ];
      mockQuery(
        'select `id`, `title`, `description_text`, `curriculum_week`, `curriculum_day`, `start_time`, `end_time`, `duration`, `activity_type_id`, `curriculum_id` from `activities` where `curriculum_id` = ?',
        [curriculumId],
        matchingCurriculumActivities
      );
      expect(await listCurriculumActivitiesForCurriculum(curriculumId)).toEqual(
        matchingCurriculumActivities
      );
    });
  });
  describe('findCurriculumActivity', () => {
    it('should give the details of the specified program', async () => {
      const curriculumActivityId = 4;
      const [, , , matchingCurriculumActivity] = curriculumActivitiesList;
      mockQuery(
        'select `id`, `title`, `description_text`, `curriculum_week`, `curriculum_day`, `start_time`, `end_time`, `duration`, `activity_type_id`, `curriculum_id` from `activities` where `id` = ?',
        [curriculumActivityId],
        [matchingCurriculumActivity]
      );
      expect(await findCurriculumActivity(curriculumActivityId)).toEqual(
        matchingCurriculumActivity
      );
    });
  });
  describe('constructProgramActivities', () => {
    it('should list all available activities for the specified program', async () => {
      expect(
        constructProgramActivities(
          programsList[1],
          curriculumActivitiesList,
          activityTypesList
        )
      ).toEqual(programActivitiesList[1]);
    });
  });
  describe('listActivityTypes', () => {
    it('should list all activity types', async () => {
      mockQuery(
        'select `id`, `title` from `activity_types`',
        [],
        activityTypesList
      );
      expect(await listActivityTypes()).toEqual(activityTypesList);
    });
  });
  describe('findProgramWithActivities', () => {
    it('should give the details of the specified program including its activities', async () => {
      const programId = 2;
      const programWithActivities: ProgramWithActivities = {
        ...programsList[1],
        activities: programActivitiesList[1],
      };

      mockQuery(
        'select `id`, `title`, `start_date`, `end_date`, `time_zone`, `curriculum_id` from `programs` where `id` = ?',
        [programId],
        [programsList[1]]
      );
      mockQuery(
        'select `id`, `title`, `description_text`, `curriculum_week`, `curriculum_day`, `start_time`, `end_time`, `duration`, `activity_type_id`, `curriculum_id` from `activities`',
        [],
        curriculumActivitiesList
      );
      mockQuery(
        'select `id`, `title` from `activity_types`',
        [],
        activityTypesList
      );
      expect(await findProgramWithActivities(programId)).toEqual(
        programWithActivities
      );
    });
  });

  describe('listProgramsWithActivities', () => {
    it('should list all programs with their activities', async () => {
      const programsWithActivities: ProgramWithActivities[] = [
        { ...programsList[0], activities: programActivitiesList[0] },
        { ...programsList[1], activities: programActivitiesList[1] },
        { ...programsList[2], activities: programActivitiesList[2] },
      ];

      mockQuery(
        'select `id`, `title`, `start_date`, `end_date`, `time_zone`, `curriculum_id` from `programs`',
        [],
        programsList
      );
      mockQuery(
        'select `id`, `title`, `description_text`, `curriculum_week`, `curriculum_day`, `start_time`, `end_time`, `duration`, `activity_type_id`, `curriculum_id` from `activities`',
        [],
        curriculumActivitiesList
      );
      mockQuery(
        'select `id`, `title` from `activity_types`',
        [],
        activityTypesList
      );
      expect(await listProgramsWithActivities()).toEqual(
        programsWithActivities
      );
    });
  });

  // TODO: tests for getParticipantActivityId
  describe('getParticipantActivityId', () => {
    it('should return the ID of an existing row in the table', async () => {});
    it('should return null if requesting the ID of row that does not exist', async () => {});
  });

  // TODO: tests for getParticipantActivityCompletion
  describe('getParticipantActivityCompletion', () => {
    it('should return true for a completed activity by a participant', async () => {});
    it('should return false for an activity marked incomplete by participant', async () => {});
    it('should return false for an activity status not in the table', async () => {});
  });

  // TODO: tests for setParticipantActivityCompletion
  describe('setParticipantActivityCompletion', () => {
    it('should return the participant activity ID of an updated existing row in the table', async () => {});
    it('should return the participant activity ID of an inserted row in the table', async () => {});
  });
});
