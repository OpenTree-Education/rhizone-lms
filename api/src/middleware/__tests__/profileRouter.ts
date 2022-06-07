import profileRouter from '../profileRouter';
import { createAppAgentForRouter } from '../routerTestUtils';

describe('profileRouter', () => {
  describe('GET /', () => {
    const appAgent = createAppAgentForRouter(profileRouter);

    it('should reject requests for profiles without specifying a principal ID', done => {
      appAgent.get('/').expect(500, done);
    });

    // TODO: more tests
  });
});
