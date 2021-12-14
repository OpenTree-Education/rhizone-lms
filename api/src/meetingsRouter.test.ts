import { mocked } from 'ts-jest/utils';

import {
  collectionEnvelope,
  errorEnvelope,
  itemEnvelope,
} from './responseEnvelope';
import {
  countMeetings,
  findMeeting,
  findParticipantIdForPrincipal,
  insertMeetingNote,
  listMeetings,
} from './meetingsService';
import { loginExistingUser } from './loginHelpers';
import { tracker } from './mockDb';

jest.mock('./meetingsService');

const mockCountMeetings = mocked(countMeetings);
const mockListMeetings = mocked(listMeetings);
const mockFindMeeting = mocked(findMeeting);
const mockFindParticipantIdForPrincipal = mocked(findParticipantIdForPrincipal);
const mockInsertMeetingNote = mocked(insertMeetingNote);

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

  describe('POST /meetings/:id/notes', () => {
    describe('with valid data', () => {
      beforeEach(() => {
        tracker.on('query', ({ sql, response }) => {
          if (sql === 'BEGIN;' || sql === 'COMMIT;') {
            response(null);
          }
        });
      });

      it('should create a meeting note,', done => {
        mockFindParticipantIdForPrincipal.mockResolvedValueOnce([{ id: 1 }]);
        mockInsertMeetingNote.mockResolvedValueOnce([2]);
        loginExistingUser(appAgent => {
          appAgent
            .post('/meetings/2/notes')
            .send({
              agenda_owning_participant_id: 1,
              note_text: 'Hello',
              sort_order: 2.5,
            })
            .expect(201, itemEnvelope({ id: 2 }), done);
        }, done);
      });

      it('should create a meeting note if agenda_owning_participant_id is not assigned,', done => {
        mockFindParticipantIdForPrincipal.mockResolvedValueOnce([{ id: 1 }]);
        mockInsertMeetingNote.mockResolvedValueOnce([3]);
        loginExistingUser(appAgent => {
          appAgent
            .post('/meetings/2/notes')
            .send({
              agenda_owning_participant_id: null,
              note_text: 'Hello',
              sort_order: 2.5,
            })
            .expect(201, itemEnvelope({ id: 3 }), done);
        }, done);
      });

      it('should respond with an error when a user posting the note is not a meeting participant,', done => {
        mockFindParticipantIdForPrincipal.mockResolvedValueOnce([]);
        loginExistingUser(appAgent => {
          appAgent
            .post('/meetings/2/notes')
            .send({
              agenda_owning_participant_id: 1,
              note_text: 'Hello',
              sort_order: 2.5,
            })
            .expect(
              404,
              errorEnvelope(`Participant for meeting 2 is not found.`),
              done
            );
        }, done);
      });
    });

    describe('with invalid data', () => {
      beforeEach(() => {
        tracker.on('query', ({ sql, response }) => {
          if (sql === 'BEGIN;' || sql === 'COMMIT;') {
            response(null);
          }
        });
      });
      it('should respond with error message if agenda_owning_participant_id is of the wrong type', done => {
        mockFindParticipantIdForPrincipal.mockResolvedValueOnce([{ id: 1 }]);
        loginExistingUser(appAgent => {
          appAgent
            .post('/meetings/2/notes')
            .send({
              agenda_owning_participant_id: '1',
              note_text: 'Hello',
              sort_order: 2.5,
            })
            .expect(
              422,
              errorEnvelope(
                'agenda_owning_participant_id must be a positive integer or null.'
              ),
              done
            );
        }, done);
      });

      it('should respond with error message if note_text is of the wrong type', done => {
        mockFindParticipantIdForPrincipal.mockResolvedValueOnce([{ id: 1 }]);
        loginExistingUser(appAgent => {
          appAgent
            .post('/meetings/2/notes')
            .send({
              agenda_owning_participant_id: 1,
              note_text: null,
              sort_order: 2.5,
            })
            .expect(
              422,
              errorEnvelope('note_text must be of type string.'),
              done
            );
        }, done);
      });

      it('should respond with error message if if sort_order is of the wrong type', done => {
        mockFindParticipantIdForPrincipal.mockResolvedValueOnce([{ id: 1 }]);
        loginExistingUser(appAgent => {
          appAgent
            .post('/meetings/2/notes')
            .send({
              agenda_owning_participant_id: 1,
              note_text: 'Hello',
              sort_order: '2.5',
            })
            .expect(
              422,
              errorEnvelope(
                'sort_order must be of type number and neither positive Infinity, negative Infinity, nor NaN'
              ),
              done
            );
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

      it('should respond with a 500 error if the cause was InsertMeetingNote,', done => {
        mockFindParticipantIdForPrincipal.mockResolvedValueOnce([{ id: 1 }]);
        mockInsertMeetingNote.mockRejectedValueOnce(new Error());
        loginExistingUser(appAgent => {
          appAgent
            .post('/meetings/2/notes')
            .send({
              agenda_owning_participant_id: 1,
              note_text: 'Hello',
              sort_order: 2.5,
            })
            .expect(500, done);
        }, done);
      });
    });
  });
});
