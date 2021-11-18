import { loginExistingUser } from './loginHelpers';
import {
  collectionEnvelope,
} from './responseEnvelope';
import { tracker } from './mockDb';
import { InternalServerError } from './httpErrors';

const responseObj = {
  property: 'default_questionnaire_id',
  content: '1',
};


const trackerHelper = (done: jest.DoneCallback, totalCount: number) => {
  tracker.on('query', ({ bindings, sql, response }) => {
    if (
      sql ===
      'select `property`, `content` from `settings` where `category` = ?'
    ) {
      expect(bindings).toEqual(['webapp']);
      totalCount === 1 ? response([responseObj]) : response([responseObj, responseObj]);
    } else if (
      sql ===
      'select count(*) as `total_count` from `settings` where `category` = ?'
    ) {
      expect(bindings).toEqual(['webapp']);
      response([{ total_count: totalCount === 1 ? 1 : 2 }]);
    } else {
      done(`Unexpected sql statement. Recieved: ${sql}`);
    }
  });
};
describe('settings router', () => {
  describe('get /settings/:category', () => {
    it('should return the existing entry in the settings table', done => {
      loginExistingUser(appAgent => {
				trackerHelper(done, 1)
        appAgent.get('/settings/webapp').expect(
          200,
          collectionEnvelope(
            [
              responseObj,
            ],
            1
          ),
          done
        );
      }, done);
    });

		it('should return multiple entries from the settings table', done => {
			loginExistingUser(appAgent => {
				trackerHelper(done, 2)
				appAgent.get('/settings/webapp')
				.expect(200, collectionEnvelope([responseObj, responseObj], 2), done)
			}, done)
		})
    it('should catch the internal server error, and response with appropriate code', done => {
      loginExistingUser(appAgent => {
        tracker.on('query', ({ reject }) => {
          reject(new InternalServerError());
        });
        appAgent
          .get('/settings/webapp')
          .expect(InternalServerError.prototype.status, done);
      }, done);
    });
  });
});
