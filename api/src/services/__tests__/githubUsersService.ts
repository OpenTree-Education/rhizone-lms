import {
  createGithubUser,
  findGithubUserByGithubId,
} from '../githubUsersService';
import { mockQuery } from '../mockDb';

describe('githubUsersService', () => {
  describe('findGithubUserByGithubId', () => {
    it('should return the github user with the given github id', async () => {
      const githubId = 1000;
      const githubUserId = 1;
      const principalId = 2;
      mockQuery(
        'select `id`, `principal_id` from `github_users` where `github_id` = ?',
        [githubId],
        [{ id: githubUserId, principal_id: principalId }]
      );
      expect(await findGithubUserByGithubId(githubId)).toEqual({
        id: githubUserId,
        principal_id: principalId,
      });
    });

    it('should return null if no github user exists with the given github id', async () => {
      const githubId = 1000;
      mockQuery(
        'select `id`, `principal_id` from `github_users` where `github_id` = ?',
        [githubId],
        []
      );
      expect(await findGithubUserByGithubId(githubId)).toEqual(null);
    });
  });

  describe('createGithubUser', () => {
    it('should insert a new principal and github user in a transaction', async () => {
      const githubId = 1000;
      const githubUserId = 1;
      const principalId = 2;
      mockQuery('BEGIN;');
      mockQuery(
        'insert into `principals` (`entity_type`) values (?)',
        ['user'],
        [principalId]
      );
      mockQuery(
        'insert into `github_users` (`github_id`, `principal_id`) values (?, ?)',
        [githubId, principalId],
        [githubUserId]
      );
      mockQuery('COMMIT;');
      expect(await createGithubUser(githubId)).toEqual({
        id: githubUserId,
        github_id: githubId,
        principal_id: principalId,
      });
    });
  });
});
