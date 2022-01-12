import { collectionEnvelope } from '../responseEnvelope';
import {
  countReflections,
  listReflections,
} from '../../services/reflectionsService';
import { createAppAgentForRouter, mockPrincipalId } from '../routerTestUtils';
import reflectionsRouter from '../reflectionsRouter';

jest.mock('../../services/reflectionsService');
const mockCountReflections = jest.mocked(countReflections);
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
  });
});
