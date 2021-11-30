import { mocked } from 'ts-jest/utils';

import { errorEnvelope, itemEnvelope } from './responseEnvelope';
import { findQuestionnaire } from './questionnairesService';
import { loginExistingUser } from './loginHelpers';

jest.mock('./questionnairesService');

const mockFindQuestionnaire = mocked(findQuestionnaire);

describe('questionnairesRouter', () => {
  describe('GET /questionnaires/:id', () => {
    it('should respond with a bad request error if the given id is not an integer', done => {
      loginExistingUser(appAgent => {
        appAgent
          .get('/questionnaires/test')
          .expect(
            400,
            errorEnvelope('"test" is not a valid questionnaire id.'),
            done
          );
      }, done);
    });

    it('should respond with a bad request error if the given id less than 1', done => {
      loginExistingUser(appAgent => {
        appAgent
          .get('/questionnaires/0')
          .expect(
            400,
            errorEnvelope('"0" is not a valid questionnaire id.'),
            done
          );
      }, done);
    });

    it('should respond with an internal server error if there is a database error', done => {
      mockFindQuestionnaire.mockRejectedValueOnce(new Error());
      loginExistingUser(appAgent => {
        appAgent.get('/questionnaires/1').expect(500, done);
      }, done);
    });

    it('should respond with an not found error if there is no questionnaire with the given id', done => {
      mockFindQuestionnaire.mockResolvedValueOnce(null);
      loginExistingUser(appAgent => {
        appAgent
          .get('/questionnaires/1')
          .expect(
            404,
            errorEnvelope(
              'A questionnaire with the id "1" could not be found.'
            ),
            done
          );
      }, done);
    });

    it('should respond with the questionnaire with the given id', done => {
      mockFindQuestionnaire.mockResolvedValueOnce({ id: 1 });
      loginExistingUser(appAgent => {
        appAgent
          .get('/questionnaires/1')
          .expect(200, itemEnvelope({ id: 1 }), done);
      }, done);
    });
  });
});
