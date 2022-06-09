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
  const twUsername = "opentree_ed"
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
  const socialProfileData = {
    network_name: 'GitHub',
    user_name: ghUsername,
    profile_url: `//github.com/${ghUsername}`,
    public: true,
  };
  const socialProfileDataDB = {
    network_name: 'GitHub',
    user_name: ghUsername,
    profile_url: `//github.com/${ghUsername}`,
    public: 'true',
  };
  const socialProfilePrivateData = {
    network_name: 'Twitter',
    user_name: twUsername,
    profile_url: `//twitter.com/${ghUsername}`,
    public: false,
  };
  const socialProfilePrivateDataDB = {
    network_name: 'Twitter',
    user_name: twUsername,
    profile_url: `//twitter.com/${ghUsername}`,
    public: 'false',
  };

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
        'select `social_networks`.`network_name` as network_name, `principal_social`.`data` as user_name, CONCAT(`social_networks`.`protocol`, `social_networks`.`base_url`, `principal_social`.`data`) AS profile_url, IF(`principal_social`.`public`, "true", "false") as public from `principal_social` left join `social_networks` on `principal_social`.`network_id` = `social_networks`.`id` where `principal_id` = ? and `public` = ? and `data` is not null',
        [principalId, "*"],
        [socialProfileDataDB]
      );
      mockFindGithubUsersByPrincipalId.mockResolvedValue(githubUserData);

      expect(await getUserProfileData(principalId, principalId)).toEqual({
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
        social_profiles: [socialProfileData],
        full_name: otherFields,
        email_address: otherFields,
        bio: otherFields,
      });
    });

    it('should throw an error if no user exists for a given principal ID', async () => {
      const principalId = 2;
      mockQuery(
        'select `id`, `full_name`, `email_address`, `bio` from `principals` where `id` = ? limit ?',
        [principalId, 1],
        []
      );

      await getUserProfileData(principalId, 1).catch((err) => {
        expect(err.message).toMatch("Cannot find principal ID 2");
      })
    });
  });

  describe('getUserSocials', () => {
    it('should return public social profiles for a user in the database', async () => {
      const principalId = 2;
      mockQuery(
        'select `social_networks`.`network_name` as network_name, `principal_social`.`data` as user_name, CONCAT(`social_networks`.`protocol`, `social_networks`.`base_url`, `principal_social`.`data`) AS profile_url, IF(`principal_social`.`public`, "true", "false") as public from `principal_social` left join `social_networks` on `principal_social`.`network_id` = `social_networks`.`id` where `principal_id` = ? and `public` = ? and `data` is not null',
        [principalId, "true"],
        [socialProfileDataDB]
      );
      expect(await getUserSocials(principalId, false)).toEqual([socialProfileData]);
    });

    it('should return public and private social profiles for own profile of authenticated user', async () => {
      const principalId = 2;
      mockQuery(
        'select `social_networks`.`network_name` as network_name, `principal_social`.`data` as user_name, CONCAT(`social_networks`.`protocol`, `social_networks`.`base_url`, `principal_social`.`data`) AS profile_url, IF(`principal_social`.`public`, "true", "false") as public from `principal_social` left join `social_networks` on `principal_social`.`network_id` = `social_networks`.`id` where `principal_id` = ? and `public` = ? and `data` is not null',
        [principalId, "*"],
        [socialProfileDataDB, socialProfilePrivateDataDB]
      );
      expect(await getUserSocials(principalId, true)).toEqual([socialProfileData, socialProfilePrivateData]);
    });

    it('should return null for a user without socials in the database', async () => {
      const principalId = 2;
      mockQuery(
        'select `social_networks`.`network_name` as network_name, `principal_social`.`data` as user_name, CONCAT(`social_networks`.`protocol`, `social_networks`.`base_url`, `principal_social`.`data`) AS profile_url, IF(`principal_social`.`public`, "true", "false") as public from `principal_social` left join `social_networks` on `principal_social`.`network_id` = `social_networks`.`id` where `principal_id` = ? and `public` = ? and `data` is not null',
        [principalId, "true"],
        []
      );
      expect(await getUserSocials(principalId, false)).toEqual(null);
    });
  });
});
