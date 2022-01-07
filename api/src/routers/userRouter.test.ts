import { itemEnvelope } from '../responseEnvelope';
import { loginExistingUser } from '../loginHelpers';

describe('userRouter', () => {
  describe('GET /user', () => {
    // it('should return an anonymous user object for an unauthenticated session', done => {
    //   agent(app)
    //     .get('/user')
    //     .expect(200, itemEnvelope({ principal_id: null }), done);
    // });

    it('should return a user object with the right principal id for an authenticated session', done => {
      loginExistingUser(appAgent => {
        appAgent
          .get('/user')
          .expect(
            200,
            itemEnvelope({ principal_id: process.env.MOCK_PRINCIPAL_ID }),
            done
          );
      }, done);
    });
  });
});
