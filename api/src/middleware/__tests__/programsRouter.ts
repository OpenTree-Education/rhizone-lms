import { collectionEnvelope } from '../responseEnvelope';
import { listProgramsWithActivities } from '../../services/programsService';
import { createAppAgentForRouter } from '../routerTestUtils';
import programsRouter from '../programsRouter';
import { ProgramWithActivities } from '../../models';

jest.mock('../../services/programsService');
const mockListProgramsWithActivities = jest.mocked(listProgramsWithActivities);

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
      
    });

    it('should respond with an internal server error if an error was thrown when trying to find a participant activity', done => {

    });
  });

  describe('POST /activityStatus/:programId/:activityId', () => {
    it('should respond with a program activity completion status', done => {
      // see competenciesRouter test L119 for PUT/setter function test example
    });

    it('should respond with a validation error if the completion value in the request body is not a boolean', done => {

    });

    it('should respond with a validation error if completion value is not provided in the request body', done => {

    });

    it('should respond with an internal server error if an error was thrown when trying to find a participant activity', done => {

    });
  });
});
