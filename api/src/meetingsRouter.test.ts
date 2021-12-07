import { mocked } from 'ts-jest/utils';

import { collectionEnvelope } from './responseEnvelope';
import { countMeetings, listMeetings } from './meetingsService';
import { loginExistingUser } from './loginHelpers';
import { tracker } from './mockDb';

jest.mock('./meetingsService');

const mockCountMeetings = mocked(countMeetings);
const mockListMeetings = mocked(listMeetings);

describe('meetingsRouter', () => {
  describe('GET /meetings', () => {
    describe('with valid data', () => {
      beforeEach(() => {
        tracker.on('query', ({ response, sql }) => {
          if (sql === 'BEGIN;' || sql === 'COMMIT;') {
            response(null);
          }
        });
      });

      it('should respond with the meetings for the current principal with the specified pagination values', done => {
        const meetings = [{ id: 1 }];
        mockListMeetings.mockResolvedValueOnce(meetings);
        mockCountMeetings.mockResolvedValueOnce(meetings.length);
        loginExistingUser(appAgent => {
          appAgent
            .get('/meetings?page=3&perpage=5')
            .expect(200, collectionEnvelope(meetings, meetings.length))
            .end(err => {
              if (err) {
                return done(err);
              }
              expect(mockCountMeetings).toHaveBeenCalledWith(
                process.env.MOCK_PRINCIPAL_ID,
                expect.anything()
              );
              expect(mockListMeetings).toHaveBeenCalledWith(
                process.env.MOCK_PRINCIPAL_ID,
                5,
                10,
                expect.anything()
              );
              return done();
            });
        }, done);
      });
    });

    describe('when the database transaction fails', () => {
      beforeEach(() => {
        tracker.on('query', ({ response, sql }) => {
          if (sql === 'BEGIN;' || sql === 'ROLLBACK') {
            response(null);
          }
        });
      });

      it('should respond with a 500 error if the cause was countMeetings', done => {
        mockListMeetings.mockResolvedValueOnce([]);
        mockCountMeetings.mockRejectedValueOnce(new Error());
        loginExistingUser(appAgent => {
          appAgent.get('/meetings').expect(500, done);
        }, done);
      });

      it('should respond with a 500 error if the cause was listMeetings', done => {
        mockListMeetings.mockRejectedValueOnce(new Error());
        mockCountMeetings.mockResolvedValueOnce(0);
        loginExistingUser(appAgent => {
          appAgent.get('/meetings').expect(500, done);
        }, done);
      });
    });
  });
});
