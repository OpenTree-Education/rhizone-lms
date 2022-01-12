import { itemEnvelope } from '../responseEnvelope';
import { findQuestionnaire } from '../../services/questionnairesService';
import { createAppAgentForRouter } from '../routerTestUtils';
import questionnairesRouter from '../questionnairesRouter';

jest.mock('../../services/questionnairesService');
const mockFindQuestionnaire = jest.mocked(findQuestionnaire);

describe('questionnairesRouter', () => {
  const appAgent = createAppAgentForRouter(questionnairesRouter);

  describe('GET /:id', () => {
    it('should respond with the questionnaire with the given id', done => {
      const questionnaireId = 3;
      const questionnaire = { id: questionnaireId };
      mockFindQuestionnaire.mockResolvedValue(questionnaire);
      appAgent
        .get(`/${questionnaireId}`)
        .expect(200, itemEnvelope(questionnaire), err => {
          expect(mockFindQuestionnaire).toHaveBeenCalledWith(questionnaireId);
          done(err);
        });
    });

    it('should respond with a bad request error if the given id is not an integer', done => {
      appAgent.get('/invalid').expect(400, done);
    });

    it('should respond with a bad request error if the given id is less than 1', done => {
      appAgent.get('/0').expect(400, done);
    });

    it('should respond with a not found error if no questionnaire with the given id exists', done => {
      mockFindQuestionnaire.mockResolvedValue(null);
      appAgent.get('/1').expect(404, done);
    });

    it('should respond with an internal server error if an error was thrown while finding the questionnaire', done => {
      mockFindQuestionnaire.mockRejectedValue(new Error());
      appAgent.get('/1').expect(500, done);
    });
  });
});
