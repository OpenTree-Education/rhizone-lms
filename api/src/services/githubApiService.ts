import { findConfig } from './configService';
import request from './request';

export const getGithubAccessToken = async (code: string) => {
  const params = new URLSearchParams();
  params.set('client_id', findConfig('GITHUB_CLIENT_ID', ''));
  params.set('client_secret', findConfig('GITHUB_CLIENT_SECRET', ''));
  params.set('code', code);
  const response = await request.post(
    `https://github.com/login/oauth/access_token?${params.toString()}`
  );
  if (response.body.error) {
    throw new Error(response.body.error);
  }
  return response.body.access_token;
};

export const getGithubUser = async (accessToken: string) => {
  const response = await request
    .get('https://api.github.com/user')
    .set('User-Agent', 'Rhizone LMS')
    .set('Authorization', `token ${accessToken}`);
  return response.body;
};
