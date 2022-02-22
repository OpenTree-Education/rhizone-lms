// istanbul ignore file
import connectRedis from 'connect-redis';
import cors from 'cors';
import { createClient as createRedisClient } from 'redis';
import { createServer } from 'http';
import express from 'express';
import expressSession from 'express-session';
import helmet from 'helmet';
import { Server } from 'socket.io';

import authRouter from './middleware/authRouter';
import competenciesRouter from './middleware/competenciesRouter';
import docsRouter from './middleware/docsRouter';
import {
  handleErrors,
  handleNotFound,
} from './middleware/errorHandlingMiddleware';
import { loggedIn } from './middleware/authMiddleware';
import meetingsRouter from './middleware/meetingsRouter';
import questionnairesRouter from './middleware/questionnairesRouter';
import reflectionsRouter from './middleware/reflectionsRouter';
import settingsRouter from './middleware/settingsRouter';
import { findConfig } from './services/configService';

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
  const host = findConfig('API_HOST', 'localhost');
  const port = findConfig('API_PORT', '8491');
  const secure = findConfig('SECURE', 'false') === 'true';
  const app = express();

  const server = createServer(app);
  const io = new Server(server, {
    cors: {
      origin: [findConfig('WEBAPP_ORIGIN', '')],
    },
  });

  io.on('connection', socket => {
    console.log(`Connection for ${socket.id}`);
  });

  app.set('trust proxy', 1);

  app.use(helmet());
  app.use(express.json());

  const RedisStore = connectRedis(expressSession);
  const redisClient = createRedisClient({
    host: findConfig('REDIS_HOST', 'localhost'),
  });
  redisClient.on('connect', () => console.log(`redis client connected`));
  redisClient.on('error', error => console.log(`redis client error: ${error}`));
  app.use(
    expressSession({
      cookie: { sameSite: true, secure },
      name: 'session_id',
      resave: true,
      saveUninitialized: true,
      secret: findConfig('SESSION_SECRET', ''),
      store: new RedisStore({ client: redisClient }),
    })
  );

  const withCors = cors({
    credentials: true,
    origin: findConfig('WEBAPP_ORIGIN', ''),
  });
  app.use(withCors, authRouter);
  app.use('/competencies', withCors, loggedIn, competenciesRouter);
  app.use('/docs', withCors, docsRouter);
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

  server.listen(Number(port), host, () => {
    console.log(`api listening on ${host}:${port}`);
  });
};

start();
