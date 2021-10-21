import querystring from 'querystring';
import request from 'superagent';
import Router from 'express';

const authRouter = Router();

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
  res.json(ghUserResponse.body);
});

export default authRouter;
