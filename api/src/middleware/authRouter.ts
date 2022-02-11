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
  const githubId = githubApiUser.id;
  let githubUser;
  try {
    githubUser = await findGithubUserByGithubId(githubId);
  } catch (err) {
    next(err);
    return;
  }
  if (!githubUser) {
    try {
      githubUser = await createGithubUser(githubId);
    } catch (err) {
      next(err);
      return;
    }
  }
  req.session.principalId = githubUser.principal_id;
  res.redirect(findConfig('WEBAPP_ORIGIN', ''));
});

export default authRouter;
