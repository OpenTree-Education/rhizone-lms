import {
  getUserProfileData,
  getUserSocials,
} from '../getUserProfileDataService';
import { mockQuery } from '../mockDb';
import { findGithubUsersByPrincipalId } from '../githubUsersService';

jest.mock('../githubUsersService');
const mockFindGithubUsersByPrincipalId = jest.mocked(
  findGithubUsersByPrincipalId
);

describe('getUserProfileDataService', () => {
  const githubId = 2000;
  const principalId = 2;
  const ghUsername = 'OpenTree-Education';
  const otherFields = '';
  const githubUserData = [
    {
      github_id: githubId,
      username: ghUsername,
      full_name: otherFields,
      bio: otherFields,
      principal_id: principalId,
      avatar_url: otherFields,
    },
  ];
  const socialProfileData = [
    {
      network_name: 'GitHub',
      user_name: ghUsername,
      profile_url: `//github.com/${ghUsername}`,
      public: true,
    },
  ];
  const socialProfileDataDB = [
    {
      network_name: 'GitHub',
      user_name: ghUsername,
      profile_url: `//github.com/${ghUsername}`,
      public: 'true',
    },
  ];

  describe('getUserProfileData', () => {
    it('should return a valid UserProfile object for an existing user', async () => {
      mockQuery(
        'select `id`, `full_name`, `email_address`, `bio` from `principals` where `id` = ? limit ?',
        [principalId, 1],
        [
          {
            id: principalId,
            full_name: otherFields,
            email_address: otherFields,
            bio: otherFields,
          },
        ]
      );
      mockQuery(
        'select `social_networks`.`network_name` as network_name, `principal_social`.`data` as user_name, CONCAT(`social_networks`.`protocol`, `social_networks`.`base_url`, `principal_social`.`data`) AS profile_url, IF(`principal_social`.`public`, "true", "false") as public from `principal_social` left join `social_networks` on `principal_social`.`network_id` = `social_networks`.`id` where `principal_id` = ? and `data` is not null',
        [principalId],
        socialProfileDataDB
      );
      mockFindGithubUsersByPrincipalId.mockResolvedValue(githubUserData);

      expect(await getUserProfileData(principalId)).toEqual({
        id: principalId,
        github_accounts: [
          {
            github_id: githubId,
            username: ghUsername,
            full_name: otherFields,
            bio: otherFields,
            principal_id: principalId,
            avatar_url: otherFields,
          },
        ],
        social_profiles: [
          {
            network_name: 'GitHub',
            user_name: ghUsername,
            profile_url: `//github.com/${ghUsername}`,
            public: true,
          },
        ],
        full_name: otherFields,
        email_address: otherFields,
        bio: otherFields,
      });
    });

    it('should return null if no user exists for a given principal ID', async () => {
      const principalId = 2;
      mockQuery(
        'select `id`, `full_name`, `email_address`, `bio` from `principals` where `id` = ? limit ?',
        [principalId, 1],
        []
      );

      expect(await getUserProfileData(principalId)).toEqual(null);
    });
  });

  describe('getUserSocials', () => {
    it('should return social profiles for a user in the database', async () => {
      const principalId = 2;
      mockQuery(
        'select `social_networks`.`network_name` as network_name, `principal_social`.`data` as user_name, CONCAT(`social_networks`.`protocol`, `social_networks`.`base_url`, `principal_social`.`data`) AS profile_url, IF(`principal_social`.`public`, "true", "false") as public from `principal_social` left join `social_networks` on `principal_social`.`network_id` = `social_networks`.`id` where `principal_id` = ? and `data` is not null',
        [principalId],
        socialProfileDataDB
      );
      expect(await getUserSocials(principalId)).toEqual(socialProfileData);
    });

    it('should return null for a user not in the database', async () => {
      const principalId = 2;
      mockQuery(
        'select `social_networks`.`network_name` as network_name, `principal_social`.`data` as user_name, CONCAT(`social_networks`.`protocol`, `social_networks`.`base_url`, `principal_social`.`data`) AS profile_url, IF(`principal_social`.`public`, "true", "false") as public from `principal_social` left join `social_networks` on `principal_social`.`network_id` = `social_networks`.`id` where `principal_id` = ? and `data` is not null',
        [principalId],
        []
      );
      expect(await getUserSocials(principalId)).toEqual(null);
    });
  });
});
