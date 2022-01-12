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
      const reflections = [{ id: 3 }];
      const principalId = 2;
      mockPrincipalId(principalId);
      mockCountReflections.mockResolvedValue(0);
      mockListReflections.mockResolvedValue(reflections);
      appAgent
        .get('/?page=2&perpage=1')
        .expect(200, collectionEnvelope(reflections, 0), err => {
          expect(mockCountReflections).toHaveBeenCalledWith(principalId);
          expect(mockListReflections).toHaveBeenCalledWith(principalId, 1, 1);
          done(err);
        });
    });
  });
});
