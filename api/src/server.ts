// istanbul ignore file
import connectRedis from 'connect-redis';
import cors from 'cors';
import { createClient as createRedisClient } from 'redis';
import express from 'express';
import expressSession from 'express-session';
import helmet from 'helmet';

import authRouter from './middleware/authRouter';
import {
  handleErrors,
  handleNotFound,
} from './middleware/errorHandlingMiddleware';
import { loggedIn } from './middleware/authMiddleware';
import meetingsRouter from './middleware/meetingsRouter';
import questionnairesRouter from './middleware/questionnairesRouter';
import reflectionsRouter from './middleware/reflectionsRouter';
import settingsRouter from './middleware/settingsRouter';

declare module 'express-session' {
  interface Session {
    principalId: number;
  }
}

declare module 'express-serve-static-core' {
  interface Request {
    pagination: {
      limit: number;
      offset: number;
    };
  }
}

const start = async () => {
  const host = process.env.API_HOST || 'localhost';
  const port = 8491;
  const secure = process.env.SECURE === 'true';
  const app = express();

  app.set('trust proxy', 1);

  app.use(helmet());
  app.use(express.json());

  const RedisStore = connectRedis(expressSession);
  const redisClient = createRedisClient({
    host: process.env.REDIS_HOST || 'localhost',
  });
  redisClient.on('connect', () => console.log(`redis client connected`));
  redisClient.on('error', error => console.log(`redis client error: ${error}`));
  app.use(
    expressSession({
      cookie: { sameSite: true, secure },
      name: 'session_id',
      resave: true,
      saveUninitialized: true,
      secret: process.env.SESSION_SECRET,
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
  app.use('/settings', withCors, settingsRouter);
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
