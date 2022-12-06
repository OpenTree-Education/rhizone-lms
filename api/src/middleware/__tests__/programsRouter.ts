import { collectionEnvelope, itemEnvelope } from '../responseEnvelope';
import {
  listProgramsWithActivities,
  getParticipantActivityId,
  getParticipantActivityCompletion,
  setParticipantActivityCompletion,
} from '../../services/programsService';
import { createAppAgentForRouter, mockPrincipalId } from '../routerTestUtils';
import programsRouter from '../programsRouter';
import { ProgramWithActivities } from '../../models';

jest.mock('../../services/programsService');
const mockListProgramsWithActivities = jest.mocked(listProgramsWithActivities);
const mockGetParticipantActivityId = jest.mocked(getParticipantActivityId);
const mockGetParticipantActivityCompletion = jest.mocked(
  getParticipantActivityCompletion
);
const mockSetParticipantActivityCompletion = jest.mocked(
  setParticipantActivityCompletion
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
  });

  describe('GET /activityStatus/:programId/:activityId', () => {
    it('should respond with a program activity completion status', done => {
      // referencing reflectionsRouter GET test L19
      const principalId = 1;
      const programId = 1;
      const activityId = 1;
      const participantActivity = { id: 1, completed: false };

      mockPrincipalId(principalId);
      mockGetParticipantActivityId.mockResolvedValue({
        id: participantActivity.id,
      });
      mockGetParticipantActivityCompletion.mockResolvedValue({
        status: participantActivity.completed,
      }); // this error will go away after updates to service file return value
      appAgent
        .get(`/activityStatus/${programId}/${activityId}`)
        .expect(200, itemEnvelope({ status: false }), err => {
          // should there be an expectation here for getParticipantActivityId to have been called as well?
          expect(mockGetParticipantActivityCompletion).toHaveBeenCalledWith(
            principalId,
            programId,
            activityId
          );
          done(err);
        });
    });

    // test handling program id and activity id that aren't integers
  });

  describe('PUT /activityStatus/:programId/:activityId', () => {
    it('should respond with a program activity completion status', done => {
      // see competenciesRouter test L119 for PUT/setter function test example
      const principalId = 1;
      const programId = 1;
      const activityId = 1;
      const participantActivity = { id: 1, completed: false };

      mockPrincipalId(principalId);
      mockGetParticipantActivityId.mockResolvedValue({
        id: participantActivity.id,
      });
      mockSetParticipantActivityCompletion.mockResolvedValue({
        id: 1,
        completed: true,
      });
      appAgent
        .put(`/activityStatus/${programId}/${activityId}`)
        .send({
          "completed": true,
        })
        .expect(200, err => {
          // should there be an expectation here for getParticipantActivityId to have been called as well?
          expect(mockSetParticipantActivityCompletion).toHaveBeenCalledWith(
            principalId,
            programId,
            activityId
          );
          done(err);
        });
    });
  });

  // test handling program id and activity id that aren't integers
});
