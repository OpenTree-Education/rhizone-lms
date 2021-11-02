import { MockedFunction } from 'ts-jest/dist/utils/testing';
import request from 'supertest';
import mockKnex from 'mock-knex';

import app from './app';
import db from './db';
import { getGithubAccessToken, getGithubUser } from './githubApi';

mockKnex.mock(db);
const tracker = mockKnex.getTracker();

jest.mock('./githubApi', () => ({
  __esModule: true,
  getGithubAccessToken: jest.fn(() => 'MOCK_ACCESS_TOKEN'),
  getGithubUser: jest.fn(() => ({ id: 1000 })),
}));

const mockGetGithubAccessToken = getGithubAccessToken as MockedFunction<
  typeof getGithubAccessToken
>;
const mockGetGithubUser = getGithubUser as MockedFunction<typeof getGithubUser>;

describe('authRouter', () => {
  describe('GET /auth/github/login', () => {
    it('should redirect to GitHub OAuth authorize endpoint with client ID and redirect URI', done => {
      request(app)
        .get('/auth/github/login')
        .expect(
          'Location',
          'https://github.com/login/oauth/authorize?client_id=TEST_GITHUB_CLIENT_ID&redirect_uri=TEST_GITHUB_REDIRECT_URI'
        )
        .expect(302, done);
    });
  });

  describe('GET /auth/logout', () => {
    it('should redirect to the web app', done => {
      request(app)
        .get('/auth/logout')
        .expect('Location', 'TEST_WEBAPP_ORIGIN')
        .expect(302, done);
    });
  });

  describe('GET /auth/github/callback', () => {
    beforeEach(() => {
      tracker.install();
    });

    afterEach(() => {
      tracker.uninstall();
    });

    it('should respond to requests without a code in the query string with Bad Request', done => {
      request(app).get('/auth/github/callback').expect(400, done);
    });

    it('should redirect to the web app for a principal with a known GitHub user id', done => {
      tracker.on('query', ({ bindings, response, sql }) => {
        if (
          sql ===
          'select `principal_id` from `github_users` where `github_id` = ?'
        ) {
          expect(bindings).toEqual([1000]);
          response([{ principal_id: 1 }]);
        } else if (sql === 'BEGIN;') {
          response(null);
        } else if (sql === 'COMMIT;') {
          response(null);
        } else {
          done(new Error(`Unrecognized query "${sql}"`));
        }
      });
      request(app)
        .get('/auth/github/callback?code=MOCK_CODE')
        .expect('Location', 'TEST_WEBAPP_ORIGIN')
        .expect(302, () => {
          expect(mockGetGithubAccessToken).toBeCalledWith('MOCK_CODE');
          expect(mockGetGithubUser).toBeCalledWith('MOCK_ACCESS_TOKEN');
          done();
        });
    });

    it('should insert a new principal and GitHub user and then redirect to the web app for a principal with an unknown GitHub user id', done => {
      tracker.on('query', ({ bindings, response, sql, transacting }) => {
        if (
          sql ===
          'select `principal_id` from `github_users` where `github_id` = ?'
        ) {
          expect(bindings).toEqual([1000]);
          expect(transacting).toEqual(true);
          response([]);
        } else if (
          sql === 'insert into `principals` (`entity_type`) values (?)'
        ) {
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
        } else {
          done(new Error(`Unrecognized query "${sql}"`));
        }
      });
      request(app)
        .get('/auth/github/callback?code=MOCK_CODE')
        .expect('Location', 'TEST_WEBAPP_ORIGIN')
        .expect(302, () => {
          expect(mockGetGithubAccessToken).toBeCalledWith('MOCK_CODE');
          expect(mockGetGithubUser).toBeCalledWith('MOCK_ACCESS_TOKEN');
          done();
        });
    });
  });
});
