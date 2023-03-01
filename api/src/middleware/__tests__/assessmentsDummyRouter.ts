import { itemEnvelope } from '../responseEnvelope';
import { createAppAgentForRouter } from '../routerTestUtils';

import assessmentsDummyRouter
 from '../assessmentsDummyRouter';

 describe('assessmentsDummyRouter', () => {
  const appAgent = createAppAgentForRouter(assessmentsDummyRouter);
  const programId = 1;
  const principalId = 3;
  const roleId = 1;
  describe('GET /', () => {
    it('should return program ID and  principal Id for program_participants', done => {
      const response = { behaviour: 'Shows a list of all assessments' };
      appAgent.get('/').expect(200, itemEnvelope(response), err => {
        done(err);
      });
    });
  });
});