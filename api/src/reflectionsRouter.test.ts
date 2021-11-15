import { loginExistingUser } from './loginHelpers';
import { errorEnvelope, itemEnvelope } from './responseEnvelope';
import { tracker } from './mockDb';
import { BadRequestError, InternalServerError } from './httpErrors';

const MOCK_REFLECTION_ID = 2;
const MOCK_JOURNAL_ENTRY_ID = 3;

describe('reflectionsRouter', () => {
  describe('POST /reflections', () => {
    it('should respond with error message if raw text is not provided', done => {
      loginExistingUser(appAgent => {
        appAgent
          .post('/reflections')
          .send({ raw_text: '' })
          .expect(
            BadRequestError.prototype.status,
            errorEnvelope(
              'At least one option or journal entry must be present to complete this request'
            ),
            done
          );
      }, done);
    });

    it('should create a reflection, a journal entry, associate the journal entry to the reflection, and associate both with the principal, and respond with an envelope containing the id of the newly created reflection.', done => {
      loginExistingUser(appAgent => {
        tracker.on('query', ({ bindings, sql, transacting, response }) => {
          if (sql === 'insert into `reflections` (`principal_id`) values (?)') {
            expect(bindings).toEqual([process.env.MOCK_PRINCIPAL_ID]);
            expect(transacting).toEqual(true);
            response([MOCK_REFLECTION_ID]);
          } else if (
            sql ===
            'insert into `journal_entries` (`principal_id`, `raw_text`, `reflection_id`) values (?, ?, ?)'
          ) {
            expect(bindings).toEqual([
              process.env.MOCK_PRINCIPAL_ID,
              'Hello! I feel good today',
              MOCK_REFLECTION_ID,
            ]);
            expect(transacting).toEqual(true);
            response([MOCK_JOURNAL_ENTRY_ID]);
          } else if (sql === 'BEGIN;') {
            response(null);
          } else if (sql === 'COMMIT;') {
            response(null);
          } else if (sql === 'ROLLBACK') {
            done(`Something went wrong, transaction failed`);
          } else {
            done(
              `Didn't match any known SQL statement cases. Recieved SQL statement: ${sql}`
            );
          }
        });
        appAgent
          .post('/reflections')
          .send({ raw_text: 'Hello! I feel good today' })
          .expect(201, itemEnvelope({ id: MOCK_REFLECTION_ID }), done);
      }, done);
    });

    it('should throw 500 error if something goes wrong in the server', done => {
      loginExistingUser(appAgent => {
        tracker.on('query', ({ reject }) => {
          reject(new InternalServerError());
        });

        appAgent
          .post('/reflections')
          .send({ raw_text: 'some text' })
          .expect(InternalServerError.prototype.status, done);
      }, done);
    });
  });
});
