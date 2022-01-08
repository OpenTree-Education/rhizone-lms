import bodyParser from 'body-parser';
import connectRedis from 'connect-redis';
import cors from 'cors';
import { createClient as createRedisClient } from 'redis';
import express from 'express';
import expressSession from 'express-session';
import helmet from 'helmet';

import authRouter from './routers/authRouter';
import {
  handleErrors,
  handleNotFound,
} from './middleware/errorHandlingMiddleware';
import { loggedIn } from './middleware/authMiddleware';
import meetingsRouter from './routers/meetingsRouter';
import questionnairesRouter from './routers/questionnairesRouter';
import reflectionsRouter from './routers/reflectionsRouter';
import settingsRouter from './routers/settingsRouter';

const start = async () => {
  const host = process.env.HOST || 'localhost';
  const port = Number(process.env.PORT) || 8491;
  const secure = process.env.SECURE === 'true';
  const app = express();

  app.set('trust proxy', 1);

  app.use(helmet());
  app.use(bodyParser.json());

  const RedisStore = connectRedis(expressSession);
  const redisClient = createRedisClient({
    url: 'redis://redis',
    // The connect-redis module currently expects the redis@3 api, but redis@4
    // is the latest client release. Once connect-redis supports the redix@4 api
    // this can be removed.
    legacyMode: true,
  });
  redisClient.on('connect', () => console.log(`redis client connected`));
  redisClient.on('error', error => console.log(`redis client error: ${error}`));
  await redisClient.connect();
  app.use(
    expressSession({
      cookie: { sameSite: true, secure },
      name: 'session_id',
      resave: true,
      saveUninitialized: true,
      secret: process.env.SESSION_SECRET || 'default session secret',
      store: new RedisStore({ client: redisClient }),
    })
  );

  const withCors = cors({
    credentials: true,
    origin: process.env.WEBAPP_ORIGIN,
  });
  app.use(withCors, authRouter);
  app.use('/meetings', withCors, loggedIn, meetingsRouter);
  app.use('/questionnaires', withCors, loggedIn, questionnairesRouter);
  app.use('/reflections', withCors, loggedIn, reflectionsRouter);
  app.use('/settings', withCors, loggedIn, settingsRouter);
  app.get('/', (_, res) => {
    res.json({});
  });

  // This must come after all route handling middleware so that it can deal with
  // requests for routes that aren't defined.
  app.use(handleNotFound);

  // This error handler must come after all other middleware so that errors in
  // all middlewares and request handlers are handled consistently.
  await app.use(handleErrors);

  app.listen(port, host, () => {
    console.log(`api listening on ${host}:${port}`);
  });
};

start();
