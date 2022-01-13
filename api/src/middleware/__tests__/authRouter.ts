import authRouter from '../authRouter';
import {
  createAppAgentForRouter,
  mockPrincipalId,
  sessionDestroyMock,
} from '../routerTestUtils';
import {
  createGithubUser,
  findGithubUserByGithubId,
} from '../../services/githubUsersService';
import {
  getGithubAccessToken,
  getGithubUser,
} from '../../services/githubApiService';
import { itemEnvelope } from '../responseEnvelope';

jest.mock('../../services/githubApiService');
const mockGetGithubAccessToken = jest.mocked(getGithubAccessToken);
const mockGetGithubUser = jest.mocked(getGithubUser);

jest.mock('../../services/githubUsersService');
const mockCreateGithubUser = jest.mocked(createGithubUser);
const mockFindGithubUserByGithubId = jest.mocked(findGithubUserByGithubId);

describe('authRouter', () => {
  const appAgent = createAppAgentForRouter(authRouter);

  describe('GET /auth/session', () => {
    it('should respond with an anonymous session if no principal has authenticated', done => {
      appAgent
        .get('/auth/session')
        .expect(200, itemEnvelope({ principal_id: null }), done);
    });

    it('should respond with session data for an authenticated user', done => {
      mockPrincipalId(1);
      appAgent
        .get('/auth/session')
        .expect(200, itemEnvelope({ principal_id: 1 }), done);
    });
  });

  describe('GET /auth/logout', () => {
    it('should redirect the user to the home page', done => {
      process.env.WEBAPP_ORIGIN = 'TEST_WEBAPP_ORIGIN';
      appAgent
        .get('/auth/logout')
        .expect('Location', process.env.WEBAPP_ORIGIN)
        .expect(302, () => {
          expect(sessionDestroyMock).toHaveBeenCalled();
          done();
        });
    });
  });

  describe('GET /auth/github/login', () => {
    it('should redirect to GitHub OAuth authorize endpoint with client ID and redirect URI', done => {
      process.env.GITHUB_CLIENT_ID = 'TEST_GITHUB_CLIENT_ID';
      process.env.GITHUB_REDIRECT_URI = 'TEST_GITHUB_REDIRECT_URI';
      appAgent
        .get('/auth/github/login')
        .expect(
          'Location',
          'https://github.com/login/oauth/authorize?client_id=TEST_GITHUB_CLIENT_ID&redirect_uri=TEST_GITHUB_REDIRECT_URI'
        )
        .expect(302, done);
    });
  });

  describe('GET /auth/github/callback', () => {
    it('should respond with a bad request error to requests without a code in the query string', done => {
      appAgent.get('/auth/github/callback').expect(400, done);
    });

    it('should redirect to the web app for a principal with a known GitHub user id', done => {
      mockGetGithubAccessToken.mockResolvedValue('MOCK_ACCESS_TOKEN');
      mockGetGithubUser.mockResolvedValue({ id: 1000 });
      mockFindGithubUserByGithubId.mockResolvedValue({ principal_id: 1 });
      appAgent
        .get('/auth/github/callback?code=MOCK_CODE')
        .expect('Location', process.env.WEBAPP_ORIGIN)
        .expect(302, () => {
          expect(getGithubAccessToken).toHaveBeenCalledWith('MOCK_CODE');
          expect(getGithubUser).toHaveBeenCalledWith('MOCK_ACCESS_TOKEN');
          expect(mockFindGithubUserByGithubId).toHaveBeenCalledWith(1000);
          expect(mockCreateGithubUser).not.toHaveBeenCalled();
          done();
        });
    });

    it('should insert a new principal and GitHub user and then redirect to the web app for a principal with an unknown GitHub user id', done => {
      mockGetGithubAccessToken.mockResolvedValue('MOCK_ACCESS_TOKEN');
      mockGetGithubUser.mockResolvedValue({ id: 1000 });
      mockFindGithubUserByGithubId.mockResolvedValue(null);
      mockCreateGithubUser.mockResolvedValue({
        id: 10,
        github_id: 1000,
        principal_id: 1,
      });
      appAgent
        .get('/auth/github/callback?code=MOCK_CODE')
        .expect('Location', process.env.WEBAPP_ORIGIN)
        .expect(302, () => {
          expect(getGithubAccessToken).toHaveBeenCalledWith('MOCK_CODE');
          expect(getGithubUser).toHaveBeenCalledWith('MOCK_ACCESS_TOKEN');
          expect(mockFindGithubUserByGithubId).toHaveBeenCalledWith(1000);
          expect(mockCreateGithubUser).toHaveBeenCalledWith(1000);
          done();
        });
    });

    it('should send an internal server error if the call to get an access token fails', done => {
      mockGetGithubAccessToken.mockRejectedValue(new Error());
      appAgent.get('/auth/github/callback?code=MOCK_CODE').expect(500, done);
    });

    it('should send an internal server error if the call to get the github user fails', done => {
      mockGetGithubAccessToken.mockResolvedValue('MOCK_ACCESS_TOKEN');
      mockGetGithubUser.mockRejectedValue(new Error());
      appAgent.get('/auth/github/callback?code=MOCK_CODE').expect(500, done);
    });

    it('should send an internal server error if the call to get the github user fails', done => {
      mockGetGithubAccessToken.mockResolvedValue('MOCK_ACCESS_TOKEN');
      mockGetGithubUser.mockResolvedValue({ id: 1000 });
      mockFindGithubUserByGithubId.mockRejectedValue(new Error());
      appAgent.get('/auth/github/callback?code=MOCK_CODE').expect(500, done);
    });

    it('should send an internal server error if the call to get the github user fails', done => {
      mockGetGithubAccessToken.mockResolvedValue('MOCK_ACCESS_TOKEN');
      mockGetGithubUser.mockResolvedValue({ id: 1000 });
      mockFindGithubUserByGithubId.mockResolvedValue(null);
      mockCreateGithubUser.mockRejectedValue(new Error());
      appAgent.get('/auth/github/callback?code=MOCK_CODE').expect(500, done);
    });
  });
});
