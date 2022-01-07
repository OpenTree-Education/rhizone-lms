import { Knex } from 'knex';

import {
  countMeetings,
  findMeeting,
  findParticipantForPrincipalInMeeting,
  insertMeetingNote,
  listMeetings,
} from './meetingsService';
import db from '../db';
import { tracker } from '../mockDb';

describe('meetingsService', () => {
  describe('countMeetings', () => {
    describe('with valid state', () => {
      beforeEach(() => {
        tracker.on('query', ({ bindings, response, sql }) => {
          if (
            sql ===
            'select count(*) as `total_count` from `meetings` inner join `participants` on `participants`.`meeting_id` = `meetings`.`id` where `participants`.`principal_id` = ?'
          ) {
            expect(bindings).toEqual([2]);
            response([{ total_count: 3 }]);
          }
        });
      });

      it('should count the number of meetings that the principal is a participant in', async () => {
        expect(await countMeetings(2)).toEqual(3);
      });

      it('should use the provided query builder', async () => {
        const mockBuilder = jest.fn(db);
        await countMeetings(2, mockBuilder as unknown as Knex);
        expect(mockBuilder).toHaveBeenCalledWith('meetings');
      });
    });

    describe('when a database error occurs', () => {
      it('should reject with the database error', () => {
        const databaseError = new Error();
        tracker.on('query', ({ reject }) => {
          reject(databaseError);
        });
        return expect(countMeetings(2)).rejects.toBe(databaseError);
      });
    });
  });

  describe('listMeetings', () => {
    describe('with valid state', () => {
      beforeEach(() => {
        tracker.on('query', ({ bindings, response, sql }) => {
          if (
            sql ===
            'select `meetings`.`id` as `id`, `starts_at` from `meetings` inner join `participants` on `participants`.`meeting_id` = `meetings`.`id` where `participants`.`principal_id` = ? order by `starts_at` desc, `meetings`.`created_at` asc limit ? offset ?'
          ) {
            expect(bindings).toEqual([2, 3, 5]);
            response([{ id: 7, starts_at: '2000-01-01T12:00:00:00Z' }]);
          } else if (
            sql ===
            'select `id`, `meeting_id`, `principal_id` from `participants` where `meeting_id` in (?) order by `created_at` asc'
          ) {
            expect(bindings).toEqual([7]);
            response([
              { id: 11, meeting_id: 7, principal_id: 2 },
              { id: 13, meeting_id: 7, principal_id: 17 },
            ]);
          }
        });
      });

      it('should return meetings with nested participants', async () => {
        expect(await listMeetings(2, 3, 5)).toEqual([
          {
            id: 7,
            participants: [
              {
                id: 11,
                meeting_id: 7,
                principal_id: 2,
              },
              {
                id: 13,
                meeting_id: 7,
                principal_id: 17,
              },
            ],
            starts_at: '2000-01-01T12:00:00:00Z',
          },
        ]);
      });
    });

    describe('with zero meetings', () => {
      beforeEach(() => {
        tracker.on('query', ({ response, sql }) => {
          if (
            sql ===
            'select `meetings`.`id` as `id`, `starts_at` from `meetings` inner join `participants` on `participants`.`meeting_id` = `meetings`.`id` where `participants`.`principal_id` = ? order by `starts_at` desc, `meetings`.`created_at` asc limit ? offset ?'
          ) {
            response([]);
          } else {
            throw new Error(`Unexpected query: ${sql}`);
          }
        });
      });

      it('should not query participants if there are no meetings', async () => {
        expect(await listMeetings(2, 3, 5)).toEqual([]);
      });
    });

    describe('when a database error occurs', () => {
      it('should reject with the database error', () => {
        const databaseError = new Error();
        tracker.on('query', ({ reject }) => {
          reject(databaseError);
        });
        return expect(listMeetings(2, 3, 5)).rejects.toBe(databaseError);
      });
    });
  });

  describe('findMeeting', () => {
    describe('with valid state', () => {
      beforeEach(() => {
        tracker.on('query', ({ bindings, response, sql }) => {
          if (
            sql ===
            'select `meetings`.`id` as `id`, `starts_at` from `meetings` inner join `participants` on `participants`.`meeting_id` = `meetings`.`id` where `meetings`.`id` = ? and `participants`.`principal_id` = ?'
          ) {
            expect(bindings).toEqual([2, 3]);
            response([{ id: 2, starts_at: '2021-10-12T04:00:00.000Z' }]);
          } else if (
            sql ===
            'select `meeting_notes`.`id` as `id`, `note_text`, `sort_order`, `authoring_participant_id`, `agenda_owning_participant_id` from `meeting_notes` inner join `participants` on `participants`.`id` = `meeting_notes`.`authoring_participant_id` where `participants`.`meeting_id` = ? order by `agenda_owning_participant_id` desc, `sort_order` asc, `meeting_notes`.`created_at` asc'
          ) {
            expect(bindings).toEqual([2]);
            response([
              {
                note_text: 'test',
                sort_order: 1,
                id: 1,
                authoring_participant_id: 1,
                agenda_owning_participant_id: 2,
              },
            ]);
          } else if (
            sql ===
            'select `id`, `principal_id` from `participants` where `meeting_id` = ? order by `created_at` asc'
          ) {
            expect(bindings).toEqual([2]);
            response([
              {
                id: 1,
                principal_id: 3,
              },
              {
                id: 2,
                principal_id: 4,
              },
            ]);
          } else {
            throw new Error(`Unexpected query: ${sql}`);
          }
        });
      });

      it('should return meeting with nested participants and meeting notes', async () => {
        expect(await findMeeting(2, 3)).toEqual({
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
        });
      });
    });

    describe('when a database error occurs', () => {
      it('should reject with the database error', () => {
        const databaseError = new Error();
        tracker.on('query', ({ reject }) => {
          reject(databaseError);
        });
        return expect(findMeeting(2, 3)).rejects.toBe(databaseError);
      });
    });
  });

  describe('findParticipantIdForPrincipal', () => {
    it(`should return user's meeting participant id`, async () => {
      tracker.on('query', ({ bindings, response, sql }) => {
        if (
          sql ===
          'select `id` from `participants` where `meeting_id` = ? and `principal_id` = ?'
        ) {
          expect(bindings).toEqual([2, 3]);
          response([{ id: 3 }]);
        } else {
          throw new Error(`Unexpected query: ${sql}`);
        }
      });
      expect(await findParticipantForPrincipalInMeeting(2, 3)).toEqual(3);
    });

    it(`should return null if a meeting participant is not found`, async () => {
      tracker.on('query', ({ bindings, response, sql }) => {
        if (
          sql ===
          'select `id` from `participants` where `meeting_id` = ? and `principal_id` = ?'
        ) {
          expect(bindings).toEqual([2, 0]);
          response([]);
        } else {
          throw new Error(`Unexpected query: ${sql}`);
        }
      });
      expect(await findParticipantForPrincipalInMeeting(2, 0)).toEqual(null);
    });

    it('should reject with the database error', () => {
      const databaseError = new Error();
      tracker.on('query', ({ reject }) => {
        reject(databaseError);
      });
      return expect(findParticipantForPrincipalInMeeting(2, 3)).rejects.toBe(
        databaseError
      );
    });
  });

  describe('insertMeetingNote', () => {
    it(`should return inserted note id`, async () => {
      tracker.on('query', ({ bindings, response, sql }) => {
        if (
          sql ===
          'insert into `meeting_notes` (`agenda_owning_participant_id`, `authoring_participant_id`, `note_text`, `sort_order`) values (?, ?, ?, ?)'
        ) {
          expect(bindings).toEqual([2, 2, 'Hello', 2.5]);
          response([3]);
        } else {
          throw new Error(`Unexpected query: ${sql}`);
        }
      });
      expect(await insertMeetingNote(2, 2, 'Hello', 2.5)).toEqual(3);
    });

    it('should reject with the database error', () => {
      const databaseError = new Error();
      tracker.on('query', ({ reject }) => {
        reject(databaseError);
      });
      return expect(insertMeetingNote(2, 2, 'Hello', 2.5)).rejects.toBe(
        databaseError
      );
    });
  });
});
