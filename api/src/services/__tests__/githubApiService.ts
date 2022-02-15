import { getGithubAccessToken, getGithubUser } from '../githubApiService';
import request from '../request';
import { Response, SuperAgentRequest } from 'superagent';

jest.mock('../request');
const mockRequestPost = jest.mocked(request.post);
const mockRequestGet = jest.mocked(request.get);

describe('githubApiService', () => {
  describe('getGithubAccessToken', () => {
    it('should request an access token from the github api with the given code', async () => {
      const accessToken = 'test_access_token';
      const code = 'test_code';
      mockRequestPost.mockResolvedValue({
        body: { access_token: accessToken },
      } as Response);
      expect(await getGithubAccessToken(code)).toEqual(accessToken);
      expect(mockRequestPost).toHaveBeenCalledWith(
        `https://github.com/login/oauth/access_token?client_id=&client_secret=&code=${code}`
      );
    });

    it('throws an error if the response from github described an error response', async () => {
      mockRequestPost.mockResolvedValue({
        body: { error: 'bad_verification_code' },
      } as Response);
      await expect(getGithubAccessToken('bad_code')).rejects.toThrow();
    });
  });

  describe('getGithubUser', () => {
    it('should request the user details from the github api with the given access token', async () => {
      const accessToken = 'test_access_token';
      const mockSet = jest.fn();
      const mockRequest = { set: mockSet } as unknown as SuperAgentRequest;
      mockRequestGet.mockReturnValue(mockRequest);
      mockSet.mockReturnValueOnce(mockRequest);
      mockSet.mockReturnValueOnce({ body: { id: 1000 } } as Response);
      expect(await getGithubUser(accessToken)).toEqual({ id: 1000 });
      expect(mockRequestGet).toHaveBeenCalledWith(
        'https://api.github.com/user'
      );
      expect(mockSet).toHaveBeenCalledWith('User-Agent', 'Rhizone LMS');
      expect(mockSet).toHaveBeenCalledWith(
        'Authorization',
        `token ${accessToken}`
      );
    });
  });
});
