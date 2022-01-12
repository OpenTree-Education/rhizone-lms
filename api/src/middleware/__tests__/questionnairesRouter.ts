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
  });
});
