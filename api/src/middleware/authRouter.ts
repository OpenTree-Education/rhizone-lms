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

    if (!accessToken) {
      throw new Error('could not get an access token for GitHub.');
    }
  } catch (err) {
    next(err);
    return;
  }

  let githubApiUser;
  try {
    githubApiUser = await getGithubUser(accessToken);

    if (!githubApiUser) {
      throw new Error('could not get GitHub user with access token.');
    }
  } catch (err) {
    next(err);
    return;
  }

  const githubUserData: IGitHubUser = {
    github_id: githubApiUser.id,
    username: githubApiUser.login,
    full_name: githubApiUser.name,
    bio: githubApiUser.bio,
    avatar_url: githubApiUser.avatar_url,
  };

  let principal_id = null;

  try {
    // Check to see if user already exists; if it doesn't, create it.
    principal_id = await findGithubUserByGithubId(
      githubUserData.github_id
    ).then(
      async gitHubUser => {
        return gitHubUser.principal_id;
      },
      async () => {
        const gitHubUser = await createGithubUser(githubUserData);
        return gitHubUser.principal_id;
      }
    );

    if (typeof principal_id === 'number' && !isNaN(principal_id)) {
      req.session.principalId = Number(principal_id);
    }

    res.redirect(findConfig('WEBAPP_ORIGIN', ''));
  } catch (err) {
    next(err);
    return;
  }
});

export default authRouter;
