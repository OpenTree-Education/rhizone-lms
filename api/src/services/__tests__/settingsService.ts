import { findSettings } from '../settingsService';
import { mockQuery } from '../mockDb';

describe('settingsService', () => {
  describe('findSettings', () => {
    it('should resolve to an object constructed for the settings in the given category', async () => {
      const category = 'test';
      const property = 'setting';
      const content = 'value';
      mockQuery(
        'select `content`, `property` from `settings` where `category` = ? order by `property` asc',
        [category],
        [{ content, property }]
      );
      expect(await findSettings(category)).toEqual({
        id: category,
        [property]: content,
      });
    });
  });
});
