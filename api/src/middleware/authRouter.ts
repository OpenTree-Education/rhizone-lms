import { Router } from 'express';

import { BadRequestError } from './httpErrors';
import {
  createGithubUser,
  findGithubUserByGithubId,
} from '../services/githubUsersService';
import { findConfig } from '../services/configService';
import {
  getGithubAccessToken,
  getGithubUser,
} from '../services/githubApiService';
import { itemEnvelope } from './responseEnvelope';
import { Interface } from 'readline';
import { stringify } from 'querystring';



export interface IUserData {
  id: number;
  fullname?: string;
  email?: string;
  bio?: string;
  avatarUrl?: string;
  twitterUsername?: string;
  githubUsername?: string;
}

const authRouter = Router();

authRouter.get('/auth/session', (req, res) => {
  const { principalId } = req.session;
  res.json(itemEnvelope({ principal_id: principalId || null }));
});

authRouter.get('/auth/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect(findConfig('WEBAPP_ORIGIN', ''));
  });
});

authRouter.get('/auth/github/login', (req, res) => {
  const params = new URLSearchParams();
  params.set('client_id', findConfig('GITHUB_CLIENT_ID', ''));
  params.set('redirect_uri', findConfig('GITHUB_REDIRECT_URI', ''));
  res.redirect(`https://github.com/login/oauth/authorize?${params.toString()}`);
});

authRouter.get(`/auth/github/callback`, async (req, res, next) => {
  const { code } = req.query;
  if (!code) {
    next(new BadRequestError('A "code" query string parameter is required.'));
    return;
  }
  let accessToken;
  try {
    accessToken = await getGithubAccessToken(String(code));
  } catch (err) {
    next(err);
    return;
  }
  let githubApiUser;
  try {
    githubApiUser = await getGithubUser(accessToken);
  } catch (err) {
    next(err);
    return;
  }



  const githubUserData : IUserData = {
    id: githubApiUser.id,
    fullname: githubApiUser.name,
    email: githubApiUser.email,
    bio: githubApiUser.bio,
    avatarUrl: githubApiUser.avatar_url,
    twitterUsername: githubApiUser.twitter_username,
    githubUsername: githubApiUser.login

  } ;

  console.log(githubApiUser, "githubUser");
  let githubUser;
  try {
    githubUser = await findGithubUserByGithubId(githubUserData.id);
  } catch (err) {
    next(err);
    return;
  }
  if (!githubUser) {
    try {
      githubUser = await createGithubUser(githubUserData);
    } catch (err) {
      next(err);
      return;
    }
  }
  req.session.principalId = githubUser.principal_id;
  res.redirect(findConfig('WEBAPP_ORIGIN', ''));
});

export default authRouter;
