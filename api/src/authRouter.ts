import querystring from 'querystring';
import request from 'superagent';
import { Router } from 'express';

import dbPool from './dbPool';

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
      redirect_uri: `${req.app.get('scheme')}://${req.app.get(
        'host'
      )}:${req.app.get('port')}/auth/github/callback`,
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
  const client = await dbPool.connect();
  let principalId;
  try {
    await client.query('BEGIN');
    const githubId = ghUserResponse.body.id;
    const findGhUser = await client.query(
      'SELECT principal_id FROM github_users WHERE github_id = $1',
      [githubId]
    );
    if (findGhUser.rows.length) {
      principalId = findGhUser.rows[0].principal_id;
    } else {
      const insertPrincipal = await client.query(
        'INSERT INTO principals(entity_type) VALUES($1) RETURNING id',
        ['user']
      );
      principalId = insertPrincipal.rows[0].id;
      await client.query(
        'INSERT INTO github_users(github_id, principal_id) VALUES($1, $2)',
        [githubId, principalId]
      );
    }
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
  req.session.principalId = principalId;
  res.redirect(process.env.WEBAPP_ORIGIN);
});

export default authRouter;
