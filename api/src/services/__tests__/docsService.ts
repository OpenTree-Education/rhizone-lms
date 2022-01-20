import { findDocBySlug } from '../docsService';
import { mockQuery } from '../mockDb';

describe('docsService', () => {
  describe('findDocBySlug', () => {
    it('should query for the doc with the given slug', async () => {
      const slug = 'test';
      const doc = { id: 1 };
      mockQuery(
        'select `id`, `slug`, `title`, `content` from `docs` where `slug` = ?',
        [slug],
        [doc]
      );
      expect(await findDocBySlug(slug)).toEqual(doc);
    });

    it('should resolve to null if no doc exists with the given slug', async () => {
      const slug = 'test';
      mockQuery(
        'select `id`, `slug`, `title`, `content` from `docs` where `slug` = ?',
        [slug],
        []
      );
      expect(await findDocBySlug(slug)).toEqual(null);
    });
  });
});
