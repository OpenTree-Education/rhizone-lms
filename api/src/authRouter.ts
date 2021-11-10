import querystring from 'querystring';
import { Router } from 'express';

import db from './db';
import { getGithubAccessToken, getGithubUser } from './githubApi';
import { itemEnvelope } from './responseEnvelope';

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
  res.redirect(
    `https://github.com/login/oauth/authorize?${querystring.stringify({
      client_id: process.env.GITHUB_CLIENT_ID,
      redirect_uri: process.env.GITHUB_REDIRECT_URI,
    })}`
  );
});

authRouter.get(`/auth/github/callback`, async (req, res) => {
  const { code } = req.query;
  if (!code) {
    res.sendStatus(400);
    return;
  }
  const accessToken = await getGithubAccessToken(String(code));
  const githubUser = await getGithubUser(accessToken);
  let principalId;
  const githubId = githubUser.id;
  const findGhUser = await db('github_users')
    .select('principal_id')
    .where({ github_id: githubId });
  if (findGhUser.length) {
    principalId = findGhUser[0].principal_id;
  } else {
    await db.transaction(async trx => {
      const insertPrincipal = await trx('principals').insert(
        { entity_type: 'user' },
        ['id']
      );
      principalId = insertPrincipal[0];
      await trx('github_users').insert({
        github_id: githubId,
        principal_id: principalId,
      });
    });
  }
  req.session.principalId = principalId;
  res.redirect(process.env.WEBAPP_ORIGIN);
});

export default authRouter;
