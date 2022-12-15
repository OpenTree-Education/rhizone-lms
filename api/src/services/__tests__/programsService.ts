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
  checkForPrefill,
  listProgramsWithActivities,
  getParticipantActivityId,
  getParticipantActivityCompletion,
  setParticipantActivityCompletion,
  listParticipantActivitiesCompletionForProgram,
} from '../programsService';
import {
  Program,
  ProgramActivity,
  CurriculumActivity,
  ActivityType,
  ProgramWithActivities,
  ParticipantActivity,
  ParticipantActivityForProgram,
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
    activity_type_id: 4,
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
    activity_type_id: 9,
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
    activity_type_id: 1,
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
    activity_type_id: 4,
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
    activity_type_id: 9,
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
    activity_type_id: 1,
    curriculum_id: 2,
    created_at: '2022-11-15 01:23:45',
    updated_at: '2022-11-15 01:23:45',
  },
];
const participantActivitiesList: ParticipantActivity[] = [
  {
    id: 1,
    program_id: 1,
    activity_id: 3,
    principal_id: 2,
    completed: false,
  },
  {
    id: 2,
    program_id: 2,
    activity_id: 6,
    principal_id: 2,
    completed: true,
  },
  {
    id: 3,
    program_id: 3,
    activity_id: 3,
    principal_id: 2,
    completed: false,
  },
];

const participantActivitiesForProgram: ParticipantActivityForProgram = {
  program_id: 1,
  participant_activities: participantActivitiesList.map(participantActivity => {
    return {
      activity_id: participantActivity.activity_id,
      completed: participantActivity.completed,
    };
  }),
};

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
      activity_type: 'other meeting',
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
      activity_type: 'other meeting',
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
      activity_type: 'other meeting',
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
    title: 'assignment',
    created_at: '2022-11-15 01:23:45',
    updated_at: '2022-11-15 01:23:45',
  },
  {
    id: 2,
    title: 'all-day activity',
    created_at: '2022-11-15 01:23:45',
    updated_at: '2022-11-15 01:23:45',
  },
  {
    id: 3,
    title: 'planning',
    created_at: '2022-11-15 01:23:45',
    updated_at: '2022-11-15 01:23:45',
  },
  {
    id: 4,
    title: 'standup',
    created_at: '2022-11-15 01:23:45',
    updated_at: '2022-11-15 01:23:45',
  },
  {
    id: 5,
    title: 'bulk development',
    created_at: '2022-11-15 01:23:45',
    updated_at: '2022-11-15 01:23:45',
  },
  {
    id: 6,
    title: 'office hours',
    created_at: '2022-11-15 01:23:45',
    updated_at: '2022-11-15 01:23:45',
  },
  {
    id: 7,
    title: 'workshop',
    created_at: '2022-11-15 01:23:45',
    updated_at: '2022-11-15 01:23:45',
  },
  {
    id: 8,
    title: 'retrospective',
    created_at: '2022-11-15 01:23:45',
    updated_at: '2022-11-15 01:23:45',
  },
  {
    id: 9,
    title: 'other meeting',
    created_at: '2022-11-15 01:23:45',
    updated_at: '2022-11-15 01:23:45',
  },
];

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

  describe('checkForPrefill', () => {
    const programsWithActivities: ProgramWithActivities[] = [
      { ...programsList[0], activities: programActivitiesList[0] },
      { ...programsList[1], activities: programActivitiesList[1] },
      { ...programsList[2], activities: programActivitiesList[2] },
    ];
    it('should insert missing participant activities', async () => {
      mockQuery(
        'select `program_id`, `activity_id`, `principal_id`, `completed` from `participant_activities` where `principal_id` = ?',
        [participantActivitiesList[0].principal_id],
        [participantActivitiesList[0]]
      );

      mockQuery(
        'insert ignore into `participant_activities` (`activity_id`, `completed`, `principal_id`, `program_id`) values (?, ?, ?, ?), (?, ?, ?, ?)',
        [
          participantActivitiesList[1].activity_id,
          false,
          participantActivitiesList[1].principal_id,
          participantActivitiesList[1].program_id,
          participantActivitiesList[2].activity_id,
          false,
          participantActivitiesList[2].principal_id,
          participantActivitiesList[2].program_id,
        ],
        []
      );

      expect(
        await checkForPrefill(
          participantActivitiesList[0].principal_id,
          programsWithActivities
        )
      ).toEqual([]);
    });

    it('should do nothing if all assignments in participant_activities have completion status', async () => {
      mockQuery(
        'select `program_id`, `activity_id`, `principal_id`, `completed` from `participant_activities` where `principal_id` = ?',
        [participantActivitiesList[0].principal_id],
        participantActivitiesList
      );

      expect(
        await checkForPrefill(
          participantActivitiesList[0].principal_id,
          programsWithActivities
        )
      ).toEqual([]);
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

  describe('getParticipantActivityId', () => {
    const principalId = 2;
    const programId = 1;
    const activityId = 7;
    it('should return the ID of an existing row in the table', async () => {
      mockQuery(
        'select `id` from `participant_activities` where `principal_id` = ? and `program_id` = ? and `activity_id` = ?',
        [principalId, programId, activityId],
        [{ id: participantActivitiesList[0].id }]
      );
      expect(
        await getParticipantActivityId(principalId, programId, activityId)
      ).toEqual(participantActivitiesList[0].id);
    });

    it('should return null if requesting the ID of row that does not exist', async () => {
      mockQuery(
        'select `id` from `participant_activities` where `principal_id` = ? and `program_id` = ? and `activity_id` = ?',
        [principalId, programId, activityId],
        []
      );
      expect(
        await getParticipantActivityId(principalId, programId, activityId)
      ).toEqual(null);
    });
  });

  describe('getParticipantActivityCompletion', () => {
    const principalId = 2;
    const programId = 1;
    const activityId = 10;
    it('should return an object of completion status being true for a completed activity by a participant', async () => {
      mockQuery(
        'select `id` from `participant_activities` where `principal_id` = ? and `program_id` = ? and `activity_id` = ?',
        [principalId, programId, activityId],
        [{ id: 3 }]
      );
      mockQuery(
        'select `activity_id`, `id`, `completed` from `participant_activities` where `id` = ?',
        [3],
        [{ activity_id: activityId, id: 3, completed: 1 }]
      );
      expect(
        await getParticipantActivityCompletion(
          principalId,
          programId,
          activityId
        )
      ).toEqual({
        completed: true,
      });
    });

    it('should return an object of completion status being false with activity id and participantActivityId for an activity marked incomplete by participant', async () => {
      mockQuery(
        'select `id` from `participant_activities` where `principal_id` = ? and `program_id` = ? and `activity_id` = ?',
        [principalId, programId, activityId],
        [{ id: 2 }]
      );
      mockQuery(
        'select `activity_id`, `id`, `completed` from `participant_activities` where `id` = ?',
        [2],
        [{ activity_id: activityId, id: 3, completed: 0 }]
      );
      expect(
        await getParticipantActivityCompletion(
          principalId,
          programId,
          activityId
        )
      ).toEqual({
        completed: false,
      });
    });

    it('should return an object of completion status being false for an activity status not in the table', async () => {
      mockQuery(
        'select `id` from `participant_activities` where `principal_id` = ? and `program_id` = ? and `activity_id` = ?',
        [principalId, programId, activityId],
        []
      );
      expect(
        await getParticipantActivityCompletion(
          principalId,
          programId,
          activityId
        )
      ).toEqual({
        completed: false,
      });
    });
  });

  describe('setParticipantActivityCompletion', () => {
    const principalId = 2;
    const programId = 1;
    const activityId = 7;
    const activityId2 = 9;
    const completed = true;
    const newIndex = participantActivitiesList.length;
    it('should return the participant activity ID and the completion status of an updated existing row in the table', async () => {
      mockQuery(
        'insert into `participant_activities` (`activity_id`, `completed`, `principal_id`, `program_id`) values (?, ?, ?, ?) on duplicate key update `completed` = ?',
        [activityId, completed, principalId, programId, completed],
        []
      );
      mockQuery(
        'select `id`, `completed` from `participant_activities` where `principal_id` = ? and `program_id` = ? and `activity_id` = ?',
        [principalId, programId, activityId],
        [
          {
            id: participantActivitiesList[0].id,
            completed: false,
          },
        ]
      );
      expect(
        await setParticipantActivityCompletion(
          principalId,
          programId,
          activityId,
          completed
        )
      ).toEqual({
        participantActivityId: participantActivitiesList[0].id,
        completed: false,
      });
    });

    it('should return the participant activity ID and the completion status of an inserted row in the table', async () => {
      mockQuery(
        'insert into `participant_activities` (`activity_id`, `completed`, `principal_id`, `program_id`) values (?, ?, ?, ?) on duplicate key update `completed` = ?',
        [activityId2, completed, principalId, programId, completed],
        []
      );
      mockQuery(
        'select `id`, `completed` from `participant_activities` where `principal_id` = ? and `program_id` = ? and `activity_id` = ?',
        [principalId, programId, activityId2],
        [
          {
            id: newIndex,
            completed: false,
          },
        ]
      );
      expect(
        await setParticipantActivityCompletion(
          principalId,
          programId,
          activityId2,
          completed
        )
      ).toEqual({
        participantActivityId: newIndex,
        completed: false,
      });
    });
  });

  describe('listParticipantActivitiesCompletionForProgram', () => {
    it('should return a list of participant activities with their completion statuses', async () => {
      const programId = 1;
      const principalId = 3;
      const exampleParticipantActivities: {
        activity_id: number;
        completed: number;
      }[] = participantActivitiesForProgram.participant_activities.map(
        participantActivity => ({
          activity_id: participantActivity.activity_id,
          completed: participantActivity.completed ? 1 : 0,
        })
      );

      mockQuery(
        'select `activity_id`, `completed` from `participant_activities` where `program_id` = ? and `principal_id` = ?',
        [programId, principalId],
        exampleParticipantActivities
      );
      expect(
        await listParticipantActivitiesCompletionForProgram(
          principalId,
          programId
        )
      ).toEqual(participantActivitiesForProgram);
    });
  });
});
