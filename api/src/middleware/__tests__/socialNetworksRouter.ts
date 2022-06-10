import socialNetworksRouter from '../socialNetworksRouter';
import { listSocialNetworks } from '../../services/socialNetworksService';
import { createAppAgentForRouter } from '../routerTestUtils';

jest.mock('../../services/socialNetworksService');
const mockListSocialNetworks = jest.mocked(listSocialNetworks);

describe('socialNetworksRouter', () => {
  const appAgent = createAppAgentForRouter(socialNetworksRouter);

  describe('GET /', () => {
    it('should list all available social networks', done => {
      mockListSocialNetworks.mockResolvedValue([
        {
          id: 1,
          network_name: 'GitHub',
          protocol: '//',
          base_url: 'github.com/',
        },
      ]);
      appAgent.get('/').expect(200, () => {
        expect(listSocialNetworks).toHaveBeenCalled();
        done();
      });
    });
    it('should properly throw an error if it cannot talk to the database', done => {
      mockListSocialNetworks.mockRejectedValue(new Error());
      appAgent.get('/').expect(500, () => {
        expect(listSocialNetworks).toHaveBeenCalled();
        done();
      });
    });
  });
});
