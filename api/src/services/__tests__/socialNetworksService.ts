import {
  listSocialNetworks,
  getSocialNetworkID,
} from '../socialNetworksService';
import { mockQuery } from '../mockDb';

describe('socialNetworksService', () => {
  describe('listSocialNetworks', () => {
    it('should return a list of social networks', async () => {
      mockQuery(
        'select * from `social_networks`',
        [],
        [
          {
            id: 1,
            network_name: 'GitHub',
            protocol: '//',
            base_url: 'github.com/',
          },
        ]
      );
      expect(await listSocialNetworks()).toEqual([
        {
          id: 1,
          network_name: 'GitHub',
          protocol: '//',
          base_url: 'github.com/',
        },
      ]);
    });
  });

  describe('getSocialNetworkID', () => {
    it('should return an ID from `social_networks` for an existing social network', async () => {
      mockQuery(
        'select `id` from `social_networks` where `network_name` = ? limit ?',
        ['GitHub', 1],
        [
          {
            id: 1,
            network_name: 'GitHub',
            protocol: '//',
            base_url: 'github.com/',
          },
        ]
      );
      expect(await getSocialNetworkID('GitHub')).toEqual([
        {
          id: 1,
          network_name: 'GitHub',
          protocol: '//',
          base_url: 'github.com/',
        },
      ]);
    });

    it('should not return anything from `social_networks` for a non-existing social network', async () => {
      mockQuery(
        'select `id` from `social_networks` where `network_name` = ? limit ?',
        ['Hotmail', 1],
        []
      );
      expect(await getSocialNetworkID('Hotmail')).toEqual([]);
    });
  });
});
