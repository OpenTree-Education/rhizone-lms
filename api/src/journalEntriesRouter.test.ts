import { BadRequestError } from './httpErrors';
import { loginExistingUser } from './loginHelpers';
import { tracker } from './mockDb';
import { errorEnvelope, itemEnvelope } from './responseEnvelope';

const MOCK_JOURNAL_ENTRY_ID = 1;
const MOCK_REFLECTION_ID = 2;

describe('journalEntriesRouter', () => {
  it('it should post a journal entry with the principal id when the user is logged in', done => {
    loginExistingUser(appAgent => {
      tracker.on('query', ({ bindings, response, sql, transacting }) => {
        if (
          sql ===
          'insert into `journal_entries` (`principal_id`, `raw_text`, `reflection_id`) values (?, ?, ?)'
        ) {
          expect(bindings).toEqual([
            process.env.MOCK_PRINCIPAL_ID,
            'Hello',
            MOCK_REFLECTION_ID,
          ]);
          expect(transacting).toEqual(true);
          response([MOCK_JOURNAL_ENTRY_ID]);
        } else if (
          sql === 'insert into `reflections` (`principal_id`) values (?)'
        ) {
          expect(bindings).toEqual([process.env.MOCK_PRINCIPAL_ID]);
          expect(transacting).toEqual(true);
          response([MOCK_REFLECTION_ID]);
        } else if (sql === 'BEGIN;') {
          response(null);
        } else if (sql === 'COMMIT;') {
          response(null);
        } else if (sql === 'ROLLBACK') {
          response(null);
        } else {
          done(
            `Didn't match any known SQL statement cases. Recieved SQL statement: ${sql}`
          );
        }
      });

      appAgent
        .post('/journalentries')
        .send({
          raw_text: 'Hello',
        })
        .expect(201, itemEnvelope({ id: MOCK_JOURNAL_ENTRY_ID }), done);
    }, done);
  });

  it('it should give an error if there was no raw text provided in the post call', done => {
    loginExistingUser(appAgent => {
      appAgent
        .post('/journalentries')
        .send({
          raw_text: '',
        })
        .expect(
          BadRequestError.prototype.status,
          errorEnvelope(
            'At least one option or journal entry must be present to complete this request'
          ),
          done
        );
    }, done);
  });
});
