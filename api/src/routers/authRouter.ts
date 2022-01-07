import { Router } from 'express';

import {
  createGithubUser,
  findGithubUserByGithubId,
} from '../services/githubUsersService';
import {
  getGithubAccessToken,
  getGithubUser,
} from '../services/githubApiService';
import { itemEnvelope } from '../responseEnvelope';

const authRouter = Router();

authRouter.get('/auth/session', (req, res) => {
  res.json(itemEnvelope({ authenticated: !!req.session.principalId }));
});

authRouter.get('/auth/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect(process.env.WEBAPP_ORIGIN);
  });
});

authRouter.get('/auth/github/login', (req, res) => {
  const params = new URLSearchParams();
  params.set('client_id', process.env.GITHUB_CLIENT_ID);
  params.set('redirect_uri', process.env.GITHUB_REDIRECT_URI);
  res.redirect(`https://github.com/login/oauth/authorize?${params.toString()}`);
});

authRouter.get(`/auth/github/callback`, async (req, res) => {
  const { code } = req.query;
  if (!code) {
    res.sendStatus(400);
    return;
  }
  const accessToken = await getGithubAccessToken(String(code));
  const githubApiUser = await getGithubUser(accessToken);
  const githubId = githubApiUser.id;
  let githubUser = await findGithubUserByGithubId(githubId);
  if (!githubUser) {
    githubUser = await createGithubUser(githubId);
  }
  req.session.principalId = githubUser.principal_id;
  res.redirect(process.env.WEBAPP_ORIGIN);
});

export default authRouter;
