import { collectionEnvelope, itemEnvelope } from '../responseEnvelope';
import {
  listProgramsWithActivities,
  getParticipantActivityCompletion,
  setParticipantActivityCompletion,
  listParticipantActivitiesCompletionForProgram,
} from '../../services/programsService';
import { createAppAgentForRouter, mockPrincipalId } from '../routerTestUtils';
import programsRouter from '../programsRouter';
import { ProgramWithActivities } from '../../models';

jest.mock('../../services/programsService');
const mockListProgramsWithActivities = jest.mocked(listProgramsWithActivities);
const mockGetParticipantActivityCompletion = jest.mocked(
  getParticipantActivityCompletion
);
const mockSetParticipantActivityCompletion = jest.mocked(
  setParticipantActivityCompletion
);
const mockListParticipantActivitiesCompletionForProgram = jest.mocked(
  listParticipantActivitiesCompletionForProgram
);

describe('programsRouter', () => {
  const appAgent = createAppAgentForRouter(programsRouter);

  describe('GET /', () => {
    it('should respond with the default program and its activities', done => {
      const allPrograms: ProgramWithActivities[] = [
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
          activities: [
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
        },
      ];
      mockListProgramsWithActivities.mockResolvedValue(allPrograms);
      appAgent.get('/').expect(200, collectionEnvelope(allPrograms, 1), err => {
        expect(mockListProgramsWithActivities).toHaveBeenCalled();
        done(err);
      });
    });

    it('should respond with an internal server error if an error was thrown while listing programs', done => {
      mockListProgramsWithActivities.mockRejectedValue(new Error());
      appAgent.get('/').expect(500, done);
    });
  });

  describe('GET /activityStatus/:programId', () => {
    it("should return the program ID and a list of the program's activities and the principal's completed statuses.", done => {
      const programId = 1;
      const principalId = 3;

      const participantActivitiesForProgram = {
        program_id: 1,
        participant_activities: [
          { activity_id: 7, completed: false },
          { activity_id: 8, completed: false },
          { activity_id: 10, completed: true },
        ],
      };
      mockPrincipalId(principalId);

      mockListParticipantActivitiesCompletionForProgram.mockResolvedValue(
        participantActivitiesForProgram
      );

      appAgent
        .get(`/activityStatus/${programId}`)
        .expect(200, itemEnvelope(participantActivitiesForProgram), err => {
          expect(
            mockListParticipantActivitiesCompletionForProgram
          ).toHaveBeenCalledWith(principalId, programId);
          done(err);
        });
    });

    it('should respond with a bad request error if given an invalid program id', done => {
      const programId = 0;

      appAgent.get(`/activityStatus/${programId}`).expect(400, done);
    });

    it('should respond with an internal server error if an error was thrown while listing programs', done => {
      const programId = 1;
      mockListParticipantActivitiesCompletionForProgram.mockRejectedValue(
        new Error()
      );
      appAgent.get(`/activityStatus/${programId}`).expect(500, done);
    });
  });

  describe('GET /activityStatus/:programId/:activityId', () => {
    it('should respond with a program activity completion status', done => {
      const principalId = 1;
      const programId = 1;
      const activityId = 1;
      const participantActivity = { id: 1, completed: false };

      mockPrincipalId(principalId);
      mockGetParticipantActivityCompletion.mockResolvedValue({
        completed: participantActivity.completed,
      });

      appAgent.get(`/activityStatus/${programId}/${activityId}`).expect(
        200,
        itemEnvelope({
          programId: programId,
          activityId: activityId,
          completed: participantActivity.completed,
        }),
        err => {
          expect(mockGetParticipantActivityCompletion).toHaveBeenCalledWith(
            principalId,
            programId,
            activityId
          );
          done(err);
        }
      );
    });

    it('should respond with a bad request error if given an invalid program id', done => {
      const programId = 0;
      const activityId = 1;

      appAgent
        .get(`/activityStatus/${programId}/${activityId}`)
        .expect(400, done);
    });

    it('should respond with a bad request error if given an invalid activity id', done => {
      const programId = 1;
      const activityId = 0;

      appAgent
        .get(`/activityStatus/${programId}/${activityId}`)
        .expect(400, done);
    });

    it('should respond with an internal server error if an error was thrown while getting participant activity completion status', done => {
      const programId = 1;
      const activityId = 1;

      mockGetParticipantActivityCompletion.mockRejectedValue(new Error());

      appAgent
        .get(`/activityStatus/${programId}/${activityId}`)
        .expect(500, done);
    });
  });

  describe('PUT /activityStatus/:programId/:activityId', () => {
    it('should respond with a program activity completion status', done => {
      const principalId = 1;
      const programId = 1;
      const activityId = 1;
      const participantActivity = {
        participantActivityId: 1,
        completed: true,
      };

      mockPrincipalId(principalId);
      mockSetParticipantActivityCompletion.mockResolvedValue(
        participantActivity
      );

      appAgent
        .put(`/activityStatus/${programId}/${activityId}`)
        .send({
          completed: true,
        })
        .expect(201, err => {
          expect(mockSetParticipantActivityCompletion).toHaveBeenCalledWith(
            principalId,
            programId,
            activityId,
            true
          );
          done(err);
        });
    });

    it('should respond with a bad request error if given an invalid program id', done => {
      const programId = 0;
      const activityId = 1;

      appAgent
        .put(`/activityStatus/${programId}/${activityId}`)
        .send({
          completed: true,
        })
        .expect(400, done);
    });

    it('should respond with a bad request error if given an invalid activity id', done => {
      const programId = 1;
      const activityId = 0;

      appAgent
        .put(`/activityStatus/${programId}/${activityId}`)
        .send({
          completed: true,
        })
        .expect(400, done);
    });

    it('should respond with an internal server error if an error was thrown while setting participant activity completion status', done => {
      const programId = 1;
      const activityId = 1;

      mockSetParticipantActivityCompletion.mockRejectedValue(new Error());

      appAgent
        .put(`/activityStatus/${programId}/${activityId}`)
        .send({ completed: true })
        .expect(500, done);
    });
  });
});
