import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import session from 'express-session';

import authRouter from './authRouter';
import { handleErrors, handleNotFound } from './errorHandlingMiddleware';
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

const withCors = cors({ credentials: true, origin: process.env.WEBAPP_ORIGIN });

app.use(withCors, authRouter);

app.use('/journalentries', withCors, loggedIn, journalEntriesRouter);

app.get('/', (_, res) => {
  res.json({});
});

// This must come after all route handling middleware so that it can deal with
// requests for routes that aren't defined.
app.use(handleNotFound);

// This error handler must come after all other middleware so that errors in all
// middlewares and request handlers are handled consistently.
app.use(handleErrors);

export default app;
