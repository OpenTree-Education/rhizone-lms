import { loginExistingUser } from './loginHelpers';
import { errorEnvelope, itemEnvelope } from './responseEnvelope';
import { tracker } from './mockDb';
import {
  BadRequestError,
  InternalServerError,
  ValidationError,
} from './httpErrors';

const MOCK_REFLECTION_ID = 2;
const MOCK_JOURNAL_ENTRY_ID = 3;
const MOCK_OPTION_ID = 12;
const MOCK_RESPONSE_ID = 1;

function trackerHelper(done: jest.DoneCallback) {
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
    } else if (
      sql ===
      'insert into `responses` (`option_id`, `principal_id`, `reflection_id`) values (?, ?, ?)'
    ) {
      expect(bindings).toEqual([
        MOCK_OPTION_ID,
        process.env.MOCK_PRINCIPAL_ID,
        MOCK_REFLECTION_ID,
      ]);
      expect(transacting).toEqual(true);
      response([MOCK_RESPONSE_ID]);
    } else if (
      sql ===
      'insert into `responses` (`option_id`, `principal_id`, `reflection_id`) values (?, ?, ?), (?, ?, ?)'
    ) {
      expect(bindings).toEqual([
        MOCK_OPTION_ID,
        process.env.MOCK_PRINCIPAL_ID,
        MOCK_REFLECTION_ID,
        MOCK_OPTION_ID + 1,
        process.env.MOCK_PRINCIPAL_ID,
        MOCK_REFLECTION_ID,
      ]);
      expect(transacting).toEqual(true);
      response([MOCK_RESPONSE_ID]);
    } else if (
      sql ===
      'select count(`id`) as `option_id_count` from `options` where `id` in (?)'
    ) {
      expect(bindings).toEqual([MOCK_OPTION_ID]);
      response([{ option_id_count: 1 }]);
    } else if (
      sql ===
      'select count(`id`) as `option_id_count` from `options` where `id` in (?, ?)'
    ) {
      expect(bindings).toEqual([MOCK_OPTION_ID, MOCK_OPTION_ID + 1]);
      response([{ option_id_count: 2 }]);
    } else if (
      sql ===
      'select count(`id`) as `option_id_count` from `options` where `id` in (?, ?, ?)'
    ) {
      expect(bindings).toEqual([
        MOCK_OPTION_ID,
        MOCK_OPTION_ID + 1,
        MOCK_OPTION_ID + 2,
      ]);
      response([{ option_id_count: 1 }]);
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
  return;
}

describe('reflectionsRouter', () => {
  describe('POST /reflections', () => {
    it('should respond with error message if both raw text and option(s) are not provided', done => {
      loginExistingUser(appAgent => {
        appAgent
          .post('/reflections')
          .send({ raw_text: '', options: [] })
          .expect(
            BadRequestError.prototype.status,
            errorEnvelope(
              'At least one option or journal entry must be present to complete this request'
            ),
            done
          );
      }, done);
    });

    it('should create a reflection, a response, associated to the reflection, and associate both with the principal, and respond with an envelope containing the id of the newly created reflection.', done => {
      loginExistingUser(appAgent => {
        trackerHelper(done);
        appAgent
          .post('/reflections')
          .send({ options: [{ id: MOCK_OPTION_ID }] })
          .expect(201, itemEnvelope({ id: MOCK_REFLECTION_ID }), done);
      }, done);
    });

    it('should create a reflection, a journal entry, associate the journal entry to the reflection, and associate both with the principal, and respond with an envelope containing the id of the newly created reflection.', done => {
      loginExistingUser(appAgent => {
        trackerHelper(done);
        appAgent
          .post('/reflections')
          .send({
            raw_text: 'Hello! I feel good today',
          })
          .expect(201, itemEnvelope({ id: MOCK_REFLECTION_ID }), done);
      }, done);
    });

    it('should create a reflection,', done => {
      loginExistingUser(appAgent => {
        trackerHelper(done);
        appAgent
          .post('/reflections')
          .send({
            raw_text: 'Hello! I feel good today',
            options: [{ id: MOCK_OPTION_ID }],
          })
          .expect(201, itemEnvelope({ id: MOCK_REFLECTION_ID }), done);
      }, done);
    });

    it('should create a reflection with multiple database insertion to the responses table', done => {
      loginExistingUser(appAgent => {
        trackerHelper(done);
        appAgent
          .post('/reflections')
          .send({
            raw_text: 'Hello! I feel good today',
            options: [{ id: MOCK_OPTION_ID }, { id: MOCK_OPTION_ID + 1 }],
          })
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
          .send({
            raw_text: 'some text',
          })
          .expect(InternalServerError.prototype.status, done);
      }, done);
    });

    it('should respond with a validation error message if the option ids provided are not ids in the options table', done => {
      loginExistingUser(appAgent => {
        trackerHelper(done);
        appAgent
          .post('/reflections')
          .send({
            raw_text: 'Hello! I feel good today',
            options: [
              { id: MOCK_OPTION_ID },
              { id: MOCK_OPTION_ID + 1 },
              { id: MOCK_OPTION_ID + 2 },
            ],
          })
          .expect(
            ValidationError.prototype.status,
            errorEnvelope('The provided data does not meet requirements.'),
            done
          );
      }, done);
    });
  });
});
