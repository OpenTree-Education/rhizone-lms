import { mocked } from 'ts-jest/utils';

import { collectionEnvelope, itemEnvelope } from './responseEnvelope';
import { countMeetings, listMeetings, findMeeting } from './meetingsService';
import { loginExistingUser } from './loginHelpers';
import { tracker } from './mockDb';

jest.mock('./meetingsService');

const mockCountMeetings = mocked(countMeetings);
const mockListMeetings = mocked(listMeetings);
const mockFindMeeting = mocked(findMeeting);

const meeting = {
  id: 2,
  participants: [
    {
      id: 1,
      principal_id: 3,
    },
    {
      id: 2,
      principal_id: 4,
    },
  ],
  starts_at: '2021-10-12T04:00:00.000Z',
  meeting_notes: [
    {
      note_text: 'test',
      sort_order: 1,
      id: 1,
      authoring_participant_id: 1,
      agenda_owning_participant_id: 2,
    },
  ],
};

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

  describe('GET /meetings/:id', () => {
    describe('with valid data', () => {
      beforeEach(() => {
        tracker.on('query', ({ sql, response }) => {
          if (sql === 'BEGIN;' || sql === 'COMMIT;') {
            response(null);
          }
        });
      });

      it('should return meeting with nested participants and meeting_notes', done => {
        mockFindMeeting.mockResolvedValueOnce(meeting);
        loginExistingUser(appAgent => {
          appAgent
            .get('/meetings/2')
            .expect(200, itemEnvelope(meeting))
            .end(err => {
              if (err) {
                done(err);
              }
              expect(mockFindMeeting).toHaveBeenCalledWith(
                2,
                process.env.MOCK_PRINCIPAL_ID,
                expect.anything()
              );
              return done();
            });
        }, done);
      });
    });

    describe('when the database transaction fails', () => {
      beforeEach(() => {
        tracker.on('query', ({ sql, response }) => {
          if (sql === 'ROLLBACK' || sql === 'BEGIN;') {
            response(null);
          }
        });
      });

      it('should respond with 500 error', done => {
        mockFindMeeting.mockRejectedValueOnce(new Error());
        loginExistingUser(appAgent => {
          appAgent.get('/meetings/2').expect(500, done);
        }, done);
      });
    });
  });
});
