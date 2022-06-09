import {
  createGithubUser,
  findGithubUserByGithubId,
  findGithubUsersByPrincipalId,
} from '../githubUsersService';
import { mockQuery } from '../mockDb';

describe('githubUsersService', () => {
  describe('findGithubUserByGithubId', () => {
    it('should return the github user with the given github id', async () => {
      const githubId = 1000;
      const principalId = 10;
      const otherFields = '';
      mockQuery(
        'select `github_id`, `username`, `full_name`, `bio`, `avatar_url`, `principal_id` from `github_users` where `github_id` = ? limit ?',
        [githubId, 1],
        [
          {
            github_id: githubId,
            username: otherFields,
            full_name: otherFields,
            bio: otherFields,
            avatar_url: otherFields,
            principal_id: principalId,
          },
        ]
      );
      expect(await findGithubUserByGithubId(githubId)).toEqual({
        github_id: githubId,
        username: '',
        full_name: '',
        avatar_url: '',
        bio: '',
        principal_id: principalId,
      });
    });

    it('should return an error if no github user exists with the given github id', async () => {
      const githubId = 1001;
      mockQuery(
        'select `github_id`, `username`, `full_name`, `bio`, `avatar_url`, `principal_id` from `github_users` where `github_id` = ? limit ?',
        [githubId, 1],
        []
      );
      await findGithubUserByGithubId(githubId).catch(err => {
        expect(err.message).toMatch("Can't find any data for GitHub ID 1001")
      });
    });
  });

  describe('findGithubUsersByPrincipalId', () => {
    it('should return all github users linked to the given principal ID', async () => {
      const githubId = 1000;
      const principalId = 10;
      const otherFields = '';
      mockQuery(
        'select `github_id`, `username`, `full_name`, `bio`, `avatar_url`, `principal_id` from `github_users` where `principal_id` = ?',
        [principalId],
        [
          {
            github_id: githubId,
            username: otherFields,
            full_name: otherFields,
            bio: otherFields,
            avatar_url: otherFields,
            principal_id: principalId,
          },
        ]
      );
      expect(await findGithubUsersByPrincipalId(principalId)).toEqual([
        {
          github_id: githubId,
          username: '',
          full_name: '',
          avatar_url: '',
          bio: '',
          principal_id: principalId,
        },
      ]);
    });

    it('should return an error if no github user exists with the given principal ID', async () => {
      const principalId = 11;
      mockQuery(
        'select `github_id`, `username`, `full_name`, `bio`, `avatar_url`, `principal_id` from `github_users` where `principal_id` = ?',
        [principalId],
        []
      );
      await findGithubUsersByPrincipalId(principalId).catch(err => {
        expect(err.message).toMatch("Can't find any data for principal ID 11")
      });
    });
  });

  describe('createGithubUser', () => {
    it('should insert a new principal and github user in a transaction', async () => {
      const githubId = 1001;
      const principalId = 2;
      mockQuery('BEGIN;');
      mockQuery(
        'insert into `principals` (`entity_type`) values (?)',
        ['user'],
        [principalId]
      );
      mockQuery(
        'insert into `github_users` (`avatar_url`, `bio`, `full_name`, `github_id`, `principal_id`, `username`) values (?, ?, ?, ?, ?, ?)',
        ['', '', '', githubId, principalId, ''],
        [githubId]
      );
      mockQuery(
        'insert into `principal_social` (`data`, `network_id`, `principal_id`, `public`) values (?, ?, ?, ?)',
        ['', 1, principalId, true],
        [1]
      );
      mockQuery('COMMIT;');
      expect(
        await createGithubUser({
          github_id: githubId,
          username: '',
          full_name: '',
          avatar_url: '',
          bio: '',
          principal_id: principalId,
        })
      ).toEqual({
        github_id: githubId,
        username: '',
        full_name: '',
        avatar_url: '',
        bio: '',
        principal_id: principalId,
      });
    });

    it('should throw an error if it cannot insert principal into table', async () => {
      const githubId = 1001;
      const principalId = 2;
      mockQuery('BEGIN;');
      mockQuery(
        'insert into `principals` (`entity_type`) values (?)',
        ['user'],
        new Error("An error occurred.")
      );
      
      await createGithubUser({
          github_id: githubId,
          username: '',
          full_name: '',
          avatar_url: '',
          bio: '',
          principal_id: principalId,
        }).catch((err) => {
          expect(err.message).toMatch("ROLLBACK");
        });
    });
  });
});
