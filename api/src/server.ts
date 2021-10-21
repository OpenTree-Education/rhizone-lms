import dotenv from 'dotenv';
dotenv.config();

import bodyParser from 'body-parser';
import express from 'express';
import helmet from 'helmet';
import session from 'express-session';

import authRouter from './authRouter';
import journalEntriesRouter from "./journalEntriesRouter";

declare module 'express-session' {
  interface Session {
    principalId: number;
  }
}

const app = express();

app.set('host', process.env.HOST || 'api.development.rhizone');

app.set('port', process.env.PORT || 8491);

app.set('scheme', process.env.SCHEME || 'http');

app.use(helmet());

app.use(bodyParser.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'default session secret',
    name: 'session_id',
    resave: true,
    saveUninitialized: true,
    cookie: {
      sameSite: true,
      secure: true,
    },
  })
);

app.use(authRouter);
app.use('/journalentries', journalEntriesRouter);

app.get('/', (_, res) => {
  res.json({});
});

app.listen(app.get('port'), app.get('host'), () => {
  const scheme = app.get('scheme');
  const host = app.get('host');
  const port = app.get('port');
  console.log(`api listening on port ${scheme}://${host}:${port}`);
});
