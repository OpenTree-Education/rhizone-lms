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
import { IGitHubUser } from '../models/user_models';

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
    console.log(err)
    next(err);
    return;
  }
  let githubApiUser;
  try {
    githubApiUser = await getGithubUser(accessToken);
  } catch (err) {
    console.log(err)
    next(err);
    return;
  }

  const githubUserData: IGitHubUser = {
    github_id: githubApiUser.id,
    username: githubApiUser.login,
    full_name: githubApiUser.name,
    email: githubApiUser.email,
    bio: githubApiUser.bio,
    avatar_url: githubApiUser.avatar_url
  };

  // Check to see if user already exists; if it doesn't, create it.
  const principal_id = findGithubUserByGithubId(githubUserData.github_id).then(async (gitHubUser) => {
    if (!gitHubUser || Object.keys(gitHubUser).length == 0) {
      gitHubUser = await createGithubUser(githubUserData);
    }
    return gitHubUser.principal_id;
  }).catch((err) => {
    console.log(err);
    return -1;
  });

  const principalId = await principal_id;

  if (principalId !== -1) {
    req.session.principalId = principalId;
  }

  res.redirect(findConfig('WEBAPP_ORIGIN', ''));
});

export default authRouter;
