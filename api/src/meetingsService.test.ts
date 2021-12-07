import { Knex } from 'knex';

import { countMeetings, listMeetings } from './meetingsService';
import db from './db';
import { tracker } from './mockDb';

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
            'select `meetings`.`id` as `id`, `starts_at` from `meetings` inner join `participants` on `participants`.`meeting_id` = `meetings`.`id` where `participants`.`principal_id` = ? order by `starts_at` desc, `created_at` asc limit ? offset ?'
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
            'select `meetings`.`id` as `id`, `starts_at` from `meetings` inner join `participants` on `participants`.`meeting_id` = `meetings`.`id` where `participants`.`principal_id` = ? order by `starts_at` desc, `created_at` asc limit ? offset ?'
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
});
