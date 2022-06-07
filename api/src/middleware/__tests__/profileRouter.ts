import profileRouter from '../profileRouter';
import { createAppAgentForRouter } from '../routerTestUtils';

describe('profileRouter', () => {
  const appAgent = createAppAgentForRouter(profileRouter);

  describe('GET /', () => {
    it('should reject requests for profiles without specifying a principal ID', done => {
      appAgent.get('/').expect(500, done);
    });
  });

  describe('GET /:id', () => {
    const appAgent = createAppAgentForRouter(profileRouter);

    it('should respond with a valid response for a principal ID that exists', done => {
      appAgent.get('/').expect(500, done);
    });

    // TODO: more tests
  });

  describe('PUT /:id', () => {
    const appAgent = createAppAgentForRouter(profileRouter);

    it('should reject requests for profiles without specifying a principal ID', done => {
      appAgent.get('/').expect(500, done);
    });

    // TODO: more tests
  });
});
