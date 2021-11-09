import { agent, SuperAgentTest } from 'supertest';
import { MockedFunction } from 'ts-jest/dist/utils/testing';

import app from './app';
import { getGithubAccessToken, getGithubUser } from './githubApi';
import { tracker } from './mockDb';

jest.mock('./githubApi', () => ({
  __esModule: true,
  getGithubAccessToken: jest.fn(() => 'MOCK_ACCESS_TOKEN'),
  getGithubUser: jest.fn(() => ({ id: 1000 })),
}));

const mockGetGithubAccessToken = getGithubAccessToken as MockedFunction<
  typeof getGithubAccessToken
>;
const mockGetGithubUser = getGithubUser as MockedFunction<typeof getGithubUser>;

export const loginFirstTime = (
  onLogin: (appAgent: SuperAgentTest) => unknown,
  done: (error?: unknown) => unknown
) => {
  tracker.on('query', ({ bindings, response, sql, transacting }) => {
    if (
      sql === 'select `principal_id` from `github_users` where `github_id` = ?'
    ) {
      expect(bindings).toEqual([1000]);
      response([]);
    } else if (sql === 'insert into `principals` (`entity_type`) values (?)') {
      expect(bindings).toEqual(['user']);
      expect(transacting).toEqual(true);
      response([1]);
    } else if (
      sql ===
      'insert into `github_users` (`github_id`, `principal_id`) values (?, ?)'
    ) {
      expect(bindings).toEqual([1000, 1]);
      expect(transacting).toEqual(true);
      response([1]);
    } else if (sql === 'BEGIN;') {
      response(null);
    } else if (sql === 'COMMIT;') {
      response(null);
    }
  });
  const appAgent = agent(app);
  appAgent
    .get('/auth/github/callback?code=MOCK_CODE')
    .expect('Location', 'TEST_WEBAPP_ORIGIN')
    .expect(302, err => {
      if (err) return done(err);
      expect(mockGetGithubAccessToken).toBeCalledWith('MOCK_CODE');
      expect(mockGetGithubUser).toBeCalledWith('MOCK_ACCESS_TOKEN');
      onLogin(appAgent);
    });
};
