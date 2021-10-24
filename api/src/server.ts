import dotenv from 'dotenv';
dotenv.config();

import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import session from 'express-session';

import authRouter from './authRouter';
import journalEntriesRouter from './journalEntriesRouter';
import { loggedIn } from './authMiddleware';

declare module 'express-session' {
  interface Session {
    principalId: number;
  }
}

const app = express();

app.set('host', process.env.HOST || 'api.rhi.zone-development');

app.set('port', process.env.PORT || 8491);

app.set('secure', process.env.SECURE === 'true');

app.use(helmet());

app.use(bodyParser.json());

app.set('trust proxy', 1);

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'default session secret',
    name: 'session_id',
    resave: true,
    saveUninitialized: true,
    cookie: {
      sameSite: true,
      secure: app.get('secure'),
    },
  })
);

app.use(authRouter);

const withCors = cors({ credentials: true, origin: process.env.WEBAPP_ORIGIN });

app.use('/journalentries', withCors, loggedIn, journalEntriesRouter);

app.get('/', (_, res) => {
  res.json({});
});

app.listen(app.get('port'), app.get('host'), () => {
  const host = app.get('host');
  const port = app.get('port');
  console.log(`api listening on port ${host}:${port}`);
});
