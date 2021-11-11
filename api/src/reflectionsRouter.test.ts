import { loginExistingUser } from './loginHelpers';
import { errorEnvelope, itemEnvelope } from './responseEnvelope';
import { tracker } from './mockDb';

describe('reflectionsRouter', () => {
  describe('POST /reflections', () => {
    it('should respond with error message if raw text is not provided', done => {
      loginExistingUser(appAgent => {
        appAgent
          .post('/reflections')
          .send({ raw_text: '' })
          .expect(
            400,
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
            response([process.env.MOCK_PRINCIPAL_ID]);
          } else if (
            sql ===
            'insert into `journal_entries` (`principal_id`, `raw_text`) values (?, ?)'
          ) {
            expect(bindings).toEqual([
              process.env.MOCK_PRINCIPAL_ID,
              'Hello! I feel good today',
              process.env.MOCK_REFLECTION_ID,
            ]);
            expect(transacting).toEqual(true);
            response([process.env.MOCK_REFLECTION_ID]);
          } else if (sql === 'BEGIN;') {
            response(null);
          } else if (sql === 'COMMIT;') {
            response(null);
          } else {
            done(
              `Didn't match any known SQL statement cases. Recieved SQL statement: ${sql}`
            );
          }
        });
        appAgent
          .post('/reflections')
          .send({ raw_text: 'Hello! I feel good today' })
          .expect(
            201,
            itemEnvelope({ id: process.env.MOCK_REFLECTION_ID }),
            done
          );
      }, done);
    });
  });
});
