import {
  parsePutSubmission,
  compareAndUpdatePrincipals,
  addSocialProfile,
  modifySocialProfile,
  deleteSocialProfile,
  modifyBio,
  modifyFullName,
  modifyAvatarURL,
  modifyEmailAddress,
} from '../principalsService';
import { mockQuery } from '../mockDb';
import { BadRequestError, ForbiddenError } from '../../middleware/httpErrors';
import { ISocialNetwork } from '../../models/user_models';

describe('principalsService', () => {
  const existing_principal_id = 1;
  const alternate_principal_id = 2;
  const existing_bio = '';
  const alternate_bio = 'OpenTree Education';
  const existing_email = '';
  const alternate_email = 'no-reply@example.org';
  const existing_full_name = '';
  const alternate_full_name = 'OpenTree Education';
  const existing_github_user = 'OpenTree-Education';
  const existing_github_url = '';
  const existing_github_public = false;
  const alternate_github_public = true;
  const existing_avatar_url = '';
  const alternate_avatar_url = 'http://opentree.education';
  const null_string: string = null;

  const malformed_user_bad_id = {};
  const malformed_user_bad_strings = {
    id: existing_principal_id,
    bio: existing_principal_id,
    email_address: existing_principal_id,
    full_name: existing_principal_id,
    avatar_url: existing_principal_id,
    social_profiles: [
      {
        network_name: 'GitHub',
        user_name: existing_github_user,
        profile_url: existing_github_url,
        public: existing_github_public,
      },
    ],
  };
  const malformed_user_wonky_social = {
    id: existing_principal_id,
    bio: existing_bio,
    email_address: existing_email,
    full_name: existing_full_name,
    avatar_url: existing_avatar_url,
    social_profiles: [
      {
        network_name: null_string,
        user_name: null_string,
        profile_url: null_string,
        public: existing_github_public,
      },
    ],
  };
  const well_formed_user_self_unchanged = {
    id: existing_principal_id,
    bio: existing_bio,
    email_address: existing_email,
    full_name: existing_full_name,
    avatar_url: existing_avatar_url,
    social_profiles: [
      {
        network_name: 'GitHub',
        user_name: existing_github_user,
        profile_url: existing_github_url,
        public: existing_github_public,
      },
    ],
  };
  const well_formed_user_self_changed_id = {
    id: alternate_principal_id,
    bio: existing_bio,
    email_address: existing_email,
    full_name: existing_full_name,
    avatar_url: existing_avatar_url,
    social_profiles: [
      {
        network_name: 'GitHub',
        user_name: existing_github_user,
        profile_url: existing_github_url,
        public: existing_github_public,
      },
    ],
  };
  const well_formed_user_self_changed = {
    id: existing_principal_id,
    bio: alternate_bio,
    email_address: existing_email,
    full_name: alternate_full_name,
    avatar_url: alternate_avatar_url,
    social_profiles: [
      {
        network_name: 'GitHub',
        user_name: alternate_full_name,
        profile_url: existing_github_url,
        public: alternate_github_public,
      },
      {
        network_name: 'email',
        user_name: alternate_email,
        profile_url: `mailto:${existing_email}`,
        public: alternate_github_public,
      },
    ],
  };
  const well_formed_user_self_changed_one_social = {
    id: existing_principal_id,
    bio: alternate_bio,
    email_address: existing_email,
    full_name: alternate_full_name,
    avatar_url: alternate_avatar_url,
    social_profiles: [
      {
        network_name: 'GitHub',
        user_name: alternate_full_name,
        profile_url: existing_github_url,
        public: alternate_github_public,
      },
    ],
  };
  const well_formed_user_self_changed_email = {
    id: existing_principal_id,
    bio: alternate_bio,
    email_address: alternate_email,
    full_name: alternate_full_name,
    avatar_url: alternate_avatar_url,
    social_profiles: [
      {
        network_name: 'GitHub',
        user_name: alternate_full_name,
        profile_url: existing_github_url,
        public: alternate_github_public,
      },
      {
        network_name: 'email',
        user_name: existing_email,
        profile_url: `mailto:${alternate_email}`,
        public: alternate_github_public,
      },
    ],
  };
  const well_formed_user_self_changed_fixed_email = {
    id: existing_principal_id,
    bio: alternate_bio,
    email_address: alternate_email,
    full_name: alternate_full_name,
    avatar_url: alternate_avatar_url,
    social_profiles: [
      {
        network_name: 'GitHub',
        user_name: alternate_full_name,
        profile_url: existing_github_url,
        public: alternate_github_public,
      },
      {
        network_name: 'email',
        user_name: alternate_email,
        profile_url: '',
        public: alternate_github_public,
      },
    ],
  };

  const all_social_network_data: ISocialNetwork[] = [
    {
      id: 1,
      network_name: 'GitHub',
      protocol: '//',
      base_url: 'github.com/',
    },
    {
      id: 5,
      network_name: 'website',
      protocol: '//',
      base_url: '',
    },
    {
      id: 7,
      network_name: 'email',
      protocol: 'mailto:',
      base_url: '',
    },
  ];

  describe('parsePutSubmission', () => {
    it('should not modify a well-formed object', () => {
      expect(
        parsePutSubmission(
          well_formed_user_self_changed_fixed_email,
          existing_principal_id
        )
      ).toStrictEqual(well_formed_user_self_changed_fixed_email);
    });

    it('should reject malformed object IDs', () => {
      expect(() => {
        parsePutSubmission(malformed_user_bad_id, existing_principal_id);
      }).toThrow(BadRequestError);
    });

    it('should reject mismatched path ID with object ID', () => {
      expect(() => {
        parsePutSubmission(
          well_formed_user_self_unchanged,
          alternate_principal_id
        );
      }).toThrow(ForbiddenError);
    });

    it('should gracefully handle malformed object strings', () => {
      expect(
        parsePutSubmission(malformed_user_bad_strings, existing_principal_id)
      ).toStrictEqual(well_formed_user_self_unchanged);
    });

    it('should update top-level email from socials', () => {
      expect(
        parsePutSubmission(well_formed_user_self_changed, existing_principal_id)
      ).toStrictEqual(well_formed_user_self_changed_fixed_email);
    });

    it('should reject requests with wonky socials', () => {
      expect(() => {
        parsePutSubmission(malformed_user_wonky_social, existing_principal_id);
      }).toThrow(BadRequestError);
    });
  });
  describe('compareAndUpdatePrincipals', () => {
    it('should throw an error if ids being compared do not match', () => {
      expect.hasAssertions();
      return expect(
        compareAndUpdatePrincipals(
          well_formed_user_self_unchanged,
          well_formed_user_self_changed_id
        )
      ).rejects.toThrow(BadRequestError);
    });

    it('should not update anything if nothing has changed', async () => {
      mockQuery('select * from `social_networks`', [], all_social_network_data);
      await compareAndUpdatePrincipals(
        well_formed_user_self_unchanged,
        well_formed_user_self_unchanged
      ).then(result => {
        expect(result).toEqual(false);
      });
    });
    it('should update when data has changed', async () => {
      mockQuery('select * from `social_networks`', [], all_social_network_data);
      mockQuery(
        'update `principals` set `bio` = ? where `id` = ?',
        [alternate_bio, existing_principal_id],
        []
      );
      mockQuery(
        'update `principals` set `email_address` = ? where `id` = ?',
        [alternate_email, existing_principal_id],
        []
      );
      mockQuery(
        'update `principals` set `full_name` = ? where `id` = ?',
        [alternate_full_name, existing_principal_id],
        []
      );
      mockQuery(
        'update `principals` set `avatar_url` = ? where `id` = ?',
        [alternate_avatar_url, existing_principal_id],
        []
      );
      mockQuery(
        'update `principal_social` set `data` = ?, `public` = ? where `principal_id` = ? and `network_id` = ?',
        [
          existing_github_user,
          alternate_github_public,
          existing_principal_id,
          1,
        ],
        []
      );
      mockQuery(
        'insert into `principal_social` (`data`, `network_id`, `principal_id`, `public`) values (?, ?, ?, ?)',
        [alternate_email, 7, existing_principal_id, alternate_github_public],
        []
      );
      await compareAndUpdatePrincipals(
        well_formed_user_self_unchanged,
        well_formed_user_self_changed
      ).then(result => {
        expect(result).toEqual(true);
      });
    });

    it('should update email in principals when the social profile is updated', async () => {
      mockQuery('select * from `social_networks`', [], all_social_network_data);
      mockQuery(
        'update `principals` set `email_address` = ? where `id` = ?',
        [existing_email, existing_principal_id],
        []
      );
      mockQuery(
        'update `principal_social` set `data` = ?, `public` = ? where `principal_id` = ? and `network_id` = ?',
        [existing_email, alternate_github_public, existing_principal_id, 7],
        []
      );
      await compareAndUpdatePrincipals(
        well_formed_user_self_changed,
        well_formed_user_self_changed_email
      ).then(result => {
        expect(result).toEqual(true);
      });
    });

    it('should remove a social network', async () => {
      mockQuery('select * from `social_networks`', [], all_social_network_data);
      mockQuery(
        'update `principals` set `email_address` = ? where `id` = ?',
        [existing_email, existing_principal_id],
        []
      );
      mockQuery(
        'delete from `principal_social` where `id` = ? and `network_id` = ?',
        [existing_principal_id, 7],
        []
      );
      await compareAndUpdatePrincipals(
        well_formed_user_self_changed,
        well_formed_user_self_changed_one_social
      ).then(result => {
        expect(result).toEqual(true);
      });
    });
  });
  describe('addSocialProfile', () => {
    it('should add a social profile', async () => {
      mockQuery(
        'insert into `principal_social` (`data`, `network_id`, `principal_id`, `public`) values (?, ?, ?, ?)',
        [alternate_email, 7, existing_principal_id, alternate_github_public],
        [
          {
            id: 2,
            data: alternate_email,
            network_id: 7,
            principal_id: existing_principal_id,
            public: alternate_github_public,
          },
        ]
      );
      expect(
        await addSocialProfile(existing_principal_id, 7, {
          network_name: 'email',
          user_name: alternate_email,
          profile_url: `mailto:${existing_email}`,
          public: alternate_github_public,
        })
      ).toEqual([
        {
          id: 2,
          data: alternate_email,
          network_id: 7,
          principal_id: existing_principal_id,
          public: alternate_github_public,
        },
      ]);
    });

    it('should add a social profile even with malformed user name', async () => {
      mockQuery(
        'insert into `principal_social` (`data`, `network_id`, `principal_id`, `public`) values (?, ?, ?, ?)',
        ['', 7, existing_principal_id, alternate_github_public],
        [
          {
            id: 2,
            data: '',
            network_id: 7,
            principal_id: existing_principal_id,
            public: alternate_github_public,
          },
        ]
      );
      expect(
        await addSocialProfile(existing_principal_id, 7, {
          network_name: 'email',
          user_name: null,
          profile_url: `mailto:${existing_email}`,
          public: alternate_github_public,
        })
      ).toEqual([
        {
          id: 2,
          data: '',
          network_id: 7,
          principal_id: existing_principal_id,
          public: alternate_github_public,
        },
      ]);
    });
  });
  describe('modifySocialProfile', () => {
    it('should modify a social profile', async () => {
      mockQuery(
        'update `principal_social` set `data` = ?, `public` = ? where `principal_id` = ? and `network_id` = ?',
        [
          existing_github_user,
          alternate_github_public,
          existing_principal_id,
          1,
        ],
        [
          {
            id: 1,
            data: existing_github_user,
            network_id: 1,
            principal_id: existing_principal_id,
            public: alternate_github_public,
          },
        ]
      );
      expect(
        await modifySocialProfile(existing_principal_id, 1, {
          network_name: 'GitHub',
          user_name: existing_github_user,
          profile_url: `//github.com/${existing_github_user}`,
          public: alternate_github_public,
        })
      ).toEqual([
        {
          id: 1,
          data: existing_github_user,
          network_id: 1,
          principal_id: existing_principal_id,
          public: alternate_github_public,
        },
      ]);
    });

    it('should modify a social profile even with malformed username', async () => {
      mockQuery(
        'update `principal_social` set `data` = ?, `public` = ? where `principal_id` = ? and `network_id` = ?',
        ['', alternate_github_public, existing_principal_id, 1],
        [
          {
            id: 1,
            data: '',
            network_id: 1,
            principal_id: existing_principal_id,
            public: alternate_github_public,
          },
        ]
      );
      expect(
        await modifySocialProfile(existing_principal_id, 1, {
          network_name: 'GitHub',
          user_name: null,
          profile_url: `//github.com/${existing_github_user}`,
          public: alternate_github_public,
        })
      ).toEqual([
        {
          id: 1,
          data: '',
          network_id: 1,
          principal_id: existing_principal_id,
          public: alternate_github_public,
        },
      ]);
    });
  });
  describe('deleteSocialProfile', () => {
    it('should remove a social profile', async () => {
      mockQuery(
        'delete from `principal_social` where `id` = ? and `network_id` = ?',
        [existing_principal_id, 7],
        [
          {
            id: 2,
            data: alternate_email,
            network_id: 7,
            principal_id: existing_principal_id,
            public: alternate_github_public,
          },
        ]
      );
      expect(await deleteSocialProfile(existing_principal_id, 7)).toEqual([
        {
          id: 2,
          data: alternate_email,
          network_id: 7,
          principal_id: existing_principal_id,
          public: alternate_github_public,
        },
      ]);
    });
  });
  describe('modifyBio', () => {
    it('should update a bio for an existing user', async () => {
      const principalId = 1;
      const test_bio = 'OpenTree Education';
      mockQuery(
        'update `principals` set `bio` = ? where `id` = ?',
        [test_bio, principalId],
        [principalId]
      );
      expect(await modifyBio(principalId, test_bio)).toEqual([principalId]);
    });

    it('should update a bio for an existing user even with malformed bio', async () => {
      const principalId = 1;
      const test_bio: string = null;
      mockQuery(
        'update `principals` set `bio` = ? where `id` = ?',
        ['', principalId],
        [principalId]
      );
      expect(await modifyBio(principalId, test_bio)).toEqual([principalId]);
    });

    it('should not update a bio for a non-existent user', async () => {
      const principalId = 2;
      const test_bio = 'OpenTree Education';
      mockQuery(
        'update `principals` set `bio` = ? where `id` = ?',
        [test_bio, principalId],
        []
      );
      expect(await modifyBio(principalId, test_bio)).toEqual([]);
    });
  });
  describe('modifyFullName', () => {
    it('should update a full name for an existing user', async () => {
      const principalId = 1;
      const test_fname = 'OpenTree Education';
      mockQuery(
        'update `principals` set `full_name` = ? where `id` = ?',
        [test_fname, principalId],
        [principalId]
      );
      expect(await modifyFullName(principalId, test_fname)).toEqual([
        principalId,
      ]);
    });

    it('should update a full name for an existing user even with malformed full name', async () => {
      const principalId = 1;
      const test_fname: string = null;
      mockQuery(
        'update `principals` set `full_name` = ? where `id` = ?',
        ['', principalId],
        [principalId]
      );
      expect(await modifyFullName(principalId, test_fname)).toEqual([
        principalId,
      ]);
    });

    it('should not update a full name for a non-existent user', async () => {
      const principalId = 2;
      const test_fname = 'OpenTree Education';
      mockQuery(
        'update `principals` set `full_name` = ? where `id` = ?',
        [test_fname, principalId],
        []
      );
      expect(await modifyFullName(principalId, test_fname)).toEqual([]);
    });
  });
  describe('modifyAvatarURL', () => {
    it('should update an avatar URL for an existing user', async () => {
      const principalId = 1;
      const test_avatar = 'http://example.org';
      mockQuery(
        'update `principals` set `avatar_url` = ? where `id` = ?',
        [test_avatar, principalId],
        [principalId]
      );
      expect(await modifyAvatarURL(principalId, test_avatar)).toEqual([
        principalId,
      ]);
    });

    it('should update an avatar URL for an existing user even with malformed URL', async () => {
      const principalId = 1;
      const test_avatar: string = null;
      mockQuery(
        'update `principals` set `avatar_url` = ? where `id` = ?',
        ['', principalId],
        [principalId]
      );
      expect(await modifyAvatarURL(principalId, test_avatar)).toEqual([
        principalId,
      ]);
    });

    it('should not update an avatar URL for a non-existent user', async () => {
      const principalId = 2;
      const test_avatar = 'http://example.org';
      mockQuery(
        'update `principals` set `avatar_url` = ? where `id` = ?',
        [test_avatar, principalId],
        []
      );
      expect(await modifyAvatarURL(principalId, test_avatar)).toEqual([]);
    });
  });
  describe('modifyEmailAddress', () => {
    it('should update an email address for an existing user', async () => {
      const principalId = 1;
      const test_email = 'test@example.org';
      mockQuery(
        'update `principals` set `email_address` = ? where `id` = ?',
        [test_email, principalId],
        [principalId]
      );
      expect(await modifyEmailAddress(principalId, test_email)).toEqual([
        principalId,
      ]);
    });

    it('should update an email address for an existing user even with malformed email address', async () => {
      const principalId = 1;
      const test_email: string = null;
      mockQuery(
        'update `principals` set `email_address` = ? where `id` = ?',
        ['', principalId],
        [principalId]
      );
      expect(await modifyEmailAddress(principalId, test_email)).toEqual([
        principalId,
      ]);
    });

    it('should not update an email address for a non-existent user', async () => {
      const principalId = 2;
      const test_email = 'test@example.org';
      mockQuery(
        'update `principals` set `email_address` = ? where `id` = ?',
        [test_email, principalId],
        []
      );
      expect(await modifyEmailAddress(principalId, test_email)).toEqual([]);
    });
  });
});
