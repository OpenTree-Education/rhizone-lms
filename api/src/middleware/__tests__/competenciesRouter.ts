import { collectionEnvelope, itemEnvelope } from '../responseEnvelope';
import {
  countCompetencies,
  listCompetencies,
  createCompetency,
} from '../../services/competenciesService';
import { createAppAgentForRouter, mockPrincipalId } from '../routerTestUtils';
import competenciesRouter from '../competenciesRouter';

jest.mock('../../services/competenciesService.ts');
const mockCountCompetencies = jest.mocked(countCompetencies);
const mockListCompetencies = jest.mocked(listCompetencies);
const mockCreateCompetency = jest.mocked(createCompetency);

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

    it('should respond with an internal server error if an error was thrown while counting competencies', done => {
      mockCountCompetencies.mockRejectedValue(new Error());
      mockListCompetencies.mockResolvedValue([]);
      appAgent.get('/').expect(500, done);
    });

    it('should respond with an internal server error if an error was thrown while listing competencies', done => {
      mockCountCompetencies.mockResolvedValue(0);
      mockListCompetencies.mockRejectedValue(new Error());
      appAgent.get('/').expect(500, done);
    });
  });

  describe('POST /', () => {
    it('should create a competency with given label and description', done => {
      const principalId = 2;
      const label = 'label';
      const description = 'description';
      const competencyId = 4;
      const competency = { id: competencyId };
      mockPrincipalId(principalId);
      mockCreateCompetency.mockResolvedValue(competency);
      appAgent
        .post('/')
        .send({
          label: label,
          description: description,
        })
        .expect(201, itemEnvelope(competency), err => {
          expect(mockCreateCompetency).toHaveBeenCalledWith(
            principalId,
            label,
            description
          );
          done(err);
        });
    });

    it('should respond with a validation error if label is not a string', done => {
      appAgent
        .post('/')
        .send({ label: null, description: '' })
        .expect(422, done);
    });

    it('should respond with a validation error if description is not a string', done => {
      appAgent
        .post('/')
        .send({ label: '', description: null })
        .expect(422, done);
    });

    it('should respond with an internal server error if an error is thrown when creating a competency', done => {
      mockCreateCompetency.mockRejectedValue(new Error());
      appAgent
        .post('/')
        .send({
          label: 'test',
          description: 'test',
        })
        .expect(500, done);
    });
  });
});
