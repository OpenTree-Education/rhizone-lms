import request from 'supertest';

import app from './app';
import { loginExistingUser, loginFirstTime } from './loginHelpers';
import { tracker } from './mockDb';

jest.mock('./githubApi');

describe('authRouter', () => {
  describe('GET /auth/session', () => {
    it('should respond with false if the session is not authenticated', done => {
      request(app)
        .get('/auth/session')
        .expect(200, { data: { authenticated: false } }, done);
    });
  });

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

    it('should redirect to the web app with an authenticated session for a principal with a known GitHub user id', done => {
      loginExistingUser(appAgent => {
        appAgent
          .get('/auth/session')
          .expect(200, { data: { authenticated: true } }, done);
      }, done);
    });

    it('should insert a new principal and GitHub user and then redirect to the web app with an authenticated session for a principal with an unknown GitHub user id', done => {
      loginFirstTime(appAgent => {
        appAgent
          .get('/auth/session')
          .expect(200, { data: { authenticated: true } }, done);
      }, done);
    });
  });
});
