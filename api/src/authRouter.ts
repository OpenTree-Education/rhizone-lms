import querystring from 'querystring';
import request from 'superagent';
import { Router } from 'express';

import db from './db';

const authRouter = Router();

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
  if (!req.query.code) {
    res.sendStatus(400);
    return;
  }
  const accessTokenResponse = await request.post(
    `https://github.com/login/oauth/access_token?${querystring.stringify({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code: String(req.query.code),
    })}`
  );
  const ghUserResponse = await request
    .get('https://api.github.com/user')
    .set('User-Agent', 'Rhizone LMS')
    .set('Authorization', `token ${accessTokenResponse.body.access_token}`);
  let principalId;
  await db.transaction(async trx => {
    const githubId = ghUserResponse.body.id;
    const findGhUser = await trx('github_users')
      .select('principal_id')
      .where({ github_id: githubId });
    if (findGhUser.length) {
      principalId = findGhUser[0].principal_id;
    } else {
      const insertPrincipal = await trx('principals').insert(
        { entity_type: 'user' },
        ['id']
      );
      principalId = insertPrincipal[0];
      await trx('github_users').insert({
        github_id: githubId,
        principal_id: principalId,
      });
    }
  });
  req.session.principalId = principalId;
  res.redirect(process.env.WEBAPP_ORIGIN);
});

export default authRouter;
