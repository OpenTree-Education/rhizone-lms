import { itemEnvelope } from './responseEnvelope';
import { loginExistingUser } from './loginHelpers';
import { tracker } from './mockDb';

describe('settingsRouter', () => {
  describe('GET /settings/:category', () => {
    it('should return an object with setting properties as keys and content as values', done => {
      loginExistingUser(appAgent => {
        tracker.on('query', ({ bindings, response, sql }) => {
          if (
            sql ===
            'select `property`, `content` from `settings` where `category` = ? order by `property` asc'
          ) {
            expect(bindings).toEqual(['test-category']);
            response([
              { property: 'setting1', content: 'value 1' },
              { property: 'setting2', content: 'value 2' },
            ]);
          } else {
            throw new Error(`Unrecognized query: ${sql}`);
          }
        });
        appAgent.get('/settings/test-category').expect(
          200,
          itemEnvelope({
            id: 'test-category',
            setting1: 'value 1',
            setting2: 'value 2',
          }),
          done
        );
      }, done);
    });

    it('should not send a database error message in the response when one occurs', done => {
      loginExistingUser(appAgent => {
        const databaseErrorMessage =
          'database error that should not be sent in response';
        tracker.on('query', ({ reject }) => {
          reject(new Error(databaseErrorMessage));
        });
        appAgent
          .get('/settings/webapp')
          .expect(500)
          .expect(res => {
            expect(res.body.error).toHaveProperty('message');
            expect(res.body.error.message).not.toBe(databaseErrorMessage);
          })
          .end(done);
      }, done);
    });
  });
});
