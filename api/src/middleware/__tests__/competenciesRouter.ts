import { collectionEnvelope, itemEnvelope } from '../responseEnvelope';
import {
  authorizeCompetencyUpdate,
  countCompetencies,
  listCompetencies,
  createCompetency,
  updateCompetency,
} from '../../services/competenciesService';
import { createAppAgentForRouter, mockPrincipalId } from '../routerTestUtils';
import competenciesRouter from '../competenciesRouter';

jest.mock('../../services/competenciesService.ts');
const mockCountCompetencies = jest.mocked(countCompetencies);
const mockListCompetencies = jest.mocked(listCompetencies);
const mockCreateCompetency = jest.mocked(createCompetency);
const mockUpdateCompetency = jest.mocked(updateCompetency);
const mockAuthorizeCompetencyUpdate = jest.mocked(authorizeCompetencyUpdate);

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

  describe('PUT /:id', () => {
    it('should update a competency of user who authored it', done => {
      const principalId = 2;
      const competencyId = 3;
      const label = 'label';
      const description = 'description';
      const competency = {
        id: competencyId,
      };
      mockPrincipalId(principalId);
      mockAuthorizeCompetencyUpdate.mockResolvedValue(true);
      mockUpdateCompetency.mockResolvedValue();
      appAgent
        .put('/3')
        .send({
          label: label,
          description: description,
        })
        .expect(200, itemEnvelope(competency), err => {
          expect(mockAuthorizeCompetencyUpdate).toHaveBeenCalledWith(
            principalId,
            competencyId
          );
          expect(mockUpdateCompetency).toHaveBeenCalledWith(
            competencyId,
            label,
            description
          );
          done(err);
        });
    });

    it('should respond with a validation error if given id is less than 1', done => {
      mockAuthorizeCompetencyUpdate.mockResolvedValue(true);
      appAgent.put('/0').send({ label: '', description: '' }).expect(400, done);
    });

    it('should respond with an internal server error if an error was thrown while authorising a competency update', done => {
      mockAuthorizeCompetencyUpdate.mockRejectedValue(new Error());
      appAgent.put('/3').send({ label: '', description: '' }).expect(500, done);
    });

    it('should respond with a bad request error if user can not be authorised', done => {
      mockAuthorizeCompetencyUpdate.mockResolvedValue(false);
      appAgent.put('/3').send({ label: '', description: '' }).expect(404, done);
    });

    it('should respond with a validation error if label is not a string', done => {
      mockAuthorizeCompetencyUpdate.mockResolvedValue(true);
      appAgent
        .put('/3')
        .send({ label: null, description: '' })
        .expect(422, done);
    });

    it('should respond with a validation error if description is not a string', done => {
      mockAuthorizeCompetencyUpdate.mockResolvedValue(true);
      appAgent
        .put('/3')
        .send({ label: '', description: null })
        .expect(422, done);
    });

    it('should respond with an internal server error if an error is thrown when updating the competency', done => {
      mockAuthorizeCompetencyUpdate.mockResolvedValue(true);
      mockUpdateCompetency.mockRejectedValue(new Error());
      appAgent
        .put('/3')
        .send({
          label: 'test',
          description: 'test',
        })
        .expect(500, done);
    });
  });
});
