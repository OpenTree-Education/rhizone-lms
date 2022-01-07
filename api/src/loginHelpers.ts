import { agent, SuperAgentTest } from 'supertest';
import express from 'express';

import { getGithubAccessToken, getGithubUser } from './githubApi';
import { tracker } from './mockDb';

// FIXME Replaced app with this fake one in preparation for a big refactor
const app = express();

export const loginFirstTime = (
  onLogin: (appAgent: SuperAgentTest) => unknown,
  done: (error?: unknown) => unknown
) => {
  tracker.on('query', ({ bindings, response, sql, transacting }) => {
    if (
      sql === 'select `principal_id` from `github_users` where `github_id` = ?'
    ) {
      expect(bindings).toEqual([process.env.MOCK_GITHUB_USER_ID]);
      response([]);
    } else if (sql === 'insert into `principals` (`entity_type`) values (?)') {
      expect(bindings).toEqual(['user']);
      expect(transacting).toEqual(true);
      response([process.env.MOCK_PRINCIPAL_ID]);
    } else if (
      sql ===
      'insert into `github_users` (`github_id`, `principal_id`) values (?, ?)'
    ) {
      expect(bindings).toEqual([
        process.env.MOCK_GITHUB_USER_ID,
        process.env.MOCK_PRINCIPAL_ID,
      ]);
      expect(transacting).toEqual(true);
      response([process.env.MOCK_PRINCIPAL_ID]);
    } else if (sql === 'BEGIN;') {
      response(null);
    } else if (sql === 'COMMIT;') {
      response(null);
    }
  });
  const appAgent = agent(app);
  appAgent
    .get('/auth/github/callback?code=MOCK_CODE')
    .expect('Location', process.env.WEBAPP_ORIGIN)
    .expect(302, err => {
      if (err) return done(err);
      expect(getGithubAccessToken).toBeCalledWith('MOCK_CODE');
      expect(getGithubUser).toBeCalledWith(process.env.MOCK_ACCESS_TOKEN);
      onLogin(appAgent);
    });
};

export const loginExistingUser = (
  onLogin: (appAgent: SuperAgentTest) => unknown,
  done: (error?: unknown) => unknown
) => {
  tracker.on('query', ({ bindings, response, sql }) => {
    if (
      sql === 'select `principal_id` from `github_users` where `github_id` = ?'
    ) {
      expect(bindings).toEqual([process.env.MOCK_GITHUB_USER_ID]);
      response([{ principal_id: process.env.MOCK_PRINCIPAL_ID }]);
    }
  });
  const appAgent = agent(app);
  appAgent
    .get('/auth/github/callback?code=MOCK_CODE')
    .expect('Location', process.env.WEBAPP_ORIGIN)
    .expect(302, err => {
      if (err) return done(err);
      expect(getGithubAccessToken).toBeCalledWith('MOCK_CODE');
      expect(getGithubUser).toBeCalledWith(process.env.MOCK_ACCESS_TOKEN);
      onLogin(appAgent);
    });
};
