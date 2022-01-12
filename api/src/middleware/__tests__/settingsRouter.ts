import { createAppAgentForRouter } from '../routerTestUtils';
import { findSettings } from '../../services/settingsService';
import { itemEnvelope } from '../responseEnvelope';
import settingsRouter from '../settingsRouter';

jest.mock('../../services/settingsService');
const mockFindSettings = jest.mocked(findSettings);

describe('settingsRouter', () => {
  const appAgent = createAppAgentForRouter(settingsRouter);

  describe('GET /:category', () => {
    it('should respond with the settings for the given category as a single object', done => {
      const category = 'test';
      const settings = { id: category, setting: 'value' };
      mockFindSettings.mockResolvedValue(settings);
      appAgent.get(`/${category}`).expect(200, itemEnvelope(settings), err => {
        expect(mockFindSettings).toHaveBeenCalledWith(category);
        done(err);
      });
    });

    it('should respond with and internal server error if the query errs', done => {
      mockFindSettings.mockRejectedValue(new Error());
      appAgent.get('/test').expect(500, done);
    });
  });
});
