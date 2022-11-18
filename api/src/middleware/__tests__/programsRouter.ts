import { itemEnvelope } from '../responseEnvelope';
import { findProgramWithActivities } from '../../services/programsService';
import { createAppAgentForRouter } from '../routerTestUtils';
import programsRouter from '../programsRouter';
import { ProgramWithActivities } from '../../models';

jest.mock('../../services/programsService');
const mockFindProgramWithActivities = jest.mocked(findProgramWithActivities);

describe('programsRouter', () => {
  const appAgent = createAppAgentForRouter(programsRouter);

  describe('GET /', () => {
    it('should respond with the default program and its activities', done => {
      const program: ProgramWithActivities = {"id":2,"principal_id":2,"curriculum_id":2,"title":"Cohort 5","start_date":"2022-10-24","end_date":"2022-12-16","created_at":"2022-11-15 01:23:45","updated_at":"2022-11-15 01:23:45","activities":[{"title":"Morning Standup","description_text":"","program_id":2,"curriculum_activity_id":4,"activity_type":"standup","start_time":"2022-10-24T17:00:00.000Z","end_time":"2022-10-24T18:00:00.000Z","duration":60},{"title":"Self-introduction","description_text":"Get to know each other.","program_id":2,"curriculum_activity_id":5,"activity_type":"class","start_time":"2022-10-24T18:10:00.000Z","end_time":"2022-10-24T19:00:00.000Z","duration":50},{"title":"Self-assessment","description_text":"","program_id":2,"curriculum_activity_id":6,"activity_type":"assignment","start_time":"2022-10-25T07:00:00.000Z","end_time":"2022-10-25T07:00:00.000Z","duration":0}]};
      mockFindProgramWithActivities.mockResolvedValue(program);
      appAgent.get('/').expect(200, itemEnvelope(program), err => {
        expect(mockFindProgramWithActivities).toHaveBeenCalled();
        done(err);
      });
    });
  });
});
