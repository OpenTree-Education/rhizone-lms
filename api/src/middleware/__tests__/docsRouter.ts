import { createAppAgentForRouter } from '../routerTestUtils';
import docsRouter from '../docsRouter';
import { findDocBySlug } from '../../services/docsService';
import { itemEnvelope } from '../responseEnvelope';

jest.mock('../../services/docsService');
const mockFindDocBySlug = jest.mocked(findDocBySlug);

describe('docsRouter', () => {
  const appAgent = createAppAgentForRouter(docsRouter);

  describe('GET /:slug', () => {
    it('should respond with the doc with the given slug', done => {
      const slug = 'test';
      const doc = { id: 1, slug, title: 'doc title', content: 'doc content' };
      mockFindDocBySlug.mockResolvedValue(doc);
      appAgent.get(`/${slug}`).expect(200, itemEnvelope(doc), err => {
        expect(mockFindDocBySlug).toHaveBeenCalledWith(slug);
        done(err);
      });
    });

    it('should respond with a not found error if no doc exists with the given slug', done => {
      mockFindDocBySlug.mockResolvedValue(null);
      appAgent.get(`/test`).expect(404, done);
    });

    it('should respond with and internal server error if the query errs', done => {
      mockFindDocBySlug.mockRejectedValue(new Error());
      appAgent.get('/test').expect(500, done);
    });
  });
});
