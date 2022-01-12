import { collectionEnvelope, itemEnvelope } from '../responseEnvelope';
import {
  countReflections,
  createReflection,
  listReflections,
} from '../../services/reflectionsService';
import { createAppAgentForRouter, mockPrincipalId } from '../routerTestUtils';
import reflectionsRouter from '../reflectionsRouter';

jest.mock('../../services/reflectionsService');
const mockCountReflections = jest.mocked(countReflections);
const mockCreateReflection = jest.mocked(createReflection);
const mockListReflections = jest.mocked(listReflections);

describe('reflectionsRouter', () => {
  const appAgent = createAppAgentForRouter(reflectionsRouter);

  describe('GET /', () => {
    it('should respond with a paginated list of the current principals reflections', done => {
      const principalId = 2;
      const reflections = [{ id: 3 }];
      const reflectionsCount = reflections.length;
      mockPrincipalId(principalId);
      mockCountReflections.mockResolvedValue(reflectionsCount);
      mockListReflections.mockResolvedValue(reflections);
      appAgent
        .get('/?page=2&perpage=1')
        .expect(200, collectionEnvelope(reflections, reflectionsCount), err => {
          expect(mockCountReflections).toHaveBeenCalledWith(principalId);
          expect(mockListReflections).toHaveBeenCalledWith(principalId, 1, 1);
          done(err);
        });
    });

    it('should respond with an internal server error if an error was thrown while counting reflections', done => {
      mockCountReflections.mockRejectedValue(new Error());
      mockListReflections.mockResolvedValue([]);
      appAgent.get('/').expect(500, done);
    });

    it('should respond with an internal server error if an error was thrown while listing reflections', done => {
      mockCountReflections.mockResolvedValue(0);
      mockListReflections.mockRejectedValue(new Error());
      appAgent.get('/').expect(500, done);
    });
  });

  describe('POST /', () => {
    it('should create a reflection with the given text and responses', done => {
      const principalId = 2;
      const rawText = 'test';
      const reflectionId = 3;
      const reflection = { id: reflectionId };
      const selectedOptionIds = [4];
      mockPrincipalId(principalId);
      mockCreateReflection.mockResolvedValue(reflection);
      appAgent
        .post('/')
        .send({ raw_text: rawText, selected_option_ids: selectedOptionIds })
        .expect(201, itemEnvelope(reflection), err => {
          expect(mockCreateReflection).toHaveBeenCalledWith(
            rawText,
            selectedOptionIds,
            principalId
          );
          done(err);
        });
    });

    it('should respond with a bad request error if no text or responses are given', done => {
      appAgent
        .post('/')
        .send({ raw_text: '', selected_option_ids: [] })
        .expect(400, done);
    });

    it('should respond with a validation error if an option id is not an integer', done => {
      appAgent
        .post('/')
        .send({ raw_text: '', selected_option_ids: ['invalid'] })
        .expect(422, done);
    });

    it('should respond with a validation error if an option id is less than 1', done => {
      appAgent
        .post('/')
        .send({ raw_text: '', selected_option_ids: [0] })
        .expect(422, done);
    });

    it('should respond with an internal server error if an error is thrown when creating the reflection', done => {
      mockCreateReflection.mockRejectedValue(new Error());
      appAgent.post('/').send({ raw_text: 'test' }).expect(500, done);
    });
  });
});
