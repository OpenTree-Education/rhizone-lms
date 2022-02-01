import { collectionEnvelope } from '../responseEnvelope';
import {
  countCompetencies,
  listCompetencies,
} from '../../services/competenciesService';
import { createAppAgentForRouter } from '../routerTestUtils';
import competenciesRouter from '../competenciesRouter';

jest.mock('../../services/competenciesService.ts');
const mockCountCompetencies = jest.mocked(countCompetencies);
const mockListCompetencies = jest.mocked(listCompetencies);

describe('competenciesRouter', () => {
  const appAgent = createAppAgentForRouter(competenciesRouter);

  describe('GET /', () => {
    it('should respond with a paginated list of all the competencies', done => {
      const competencies = [
        {
          id: 3,
          label: 'label',
          description: 'description',
        },
      ];
      const competenciesCount = competencies.length;
      mockCountCompetencies.mockResolvedValue(competenciesCount);
      mockListCompetencies.mockResolvedValue(competencies);

      appAgent
        .get('/?page=2&perpage=1')
        .expect(
          200,
          collectionEnvelope(competencies, competenciesCount),
          err => {
            expect(mockCountCompetencies).toHaveBeenCalled();
            expect(mockListCompetencies).toHaveBeenCalledWith(1, 1);
            done(err);
          }
        );
    });

    it('should respond with an internal server error if an error was thrown while listing competencies', done => {
      mockListCompetencies.mockRejectedValue(new Error());
      appAgent.get('/').expect(500, done);
    });
  });
});
