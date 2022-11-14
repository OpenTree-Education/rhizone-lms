import { itemEnvelope } from '../responseEnvelope';
import { findProgramWithActivities } from '../../services/programsService';
import { createAppAgentForRouter } from '../routerTestUtils';
import programsRouter from '../programsRouter';

jest.mock('../../services/programsService');
const mockFindProgramWithActivities = jest.mocked(findProgramWithActivities);

describe('programsRouter', () => {
  const appAgent = createAppAgentForRouter(programsRouter);

  describe('GET /', () => {
    it('should respond with the default program and its activities', done => {
      done();
    });
  });
});
