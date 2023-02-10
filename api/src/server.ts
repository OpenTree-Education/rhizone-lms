// istanbul ignore file
/* eslint-disable @typescript-eslint/ban-ts-comment */
import connectRedis from 'connect-redis';
import cors from 'cors';
import { createClient as createRedisClient } from 'redis';
import { createServer } from 'http';
import express from 'express';
import expressSession, { Session, SessionData } from 'express-session';
import helmet from 'helmet';
import Rollbar from 'rollbar';
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
import { participantExists } from './services/meetingsService';
import programsRouter from './middleware/programsRouter';
import questionnairesRouter from './middleware/questionnairesRouter';
import reflectionsRouter from './middleware/reflectionsRouter';
import settingsRouter from './middleware/settingsRouter';
import { findConfig } from './services/configService';

declare module 'express-session' {
  interface Session {
    principalId: number;
  }
}

declare module 'http' {
  interface IncomingMessage {
    session: Session & Partial<SessionData>;
  }
}

declare module 'express-serve-static-core' {
  interface Request {
    io: Server;
    pagination: {
      limit: number;
      offset: number;
    };
  }
}

const logger =
  process.env.NODE_ENV === 'production'
    ? new Rollbar({
        accessToken: findConfig('ROLLBAR_SERVER_ACCESS_TOKEN', ''),
        captureUncaught: true,
        captureUnhandledRejections: true,
        payload: { environment: 'production' },
      })
    : console;

const start = async () => {
  const host = findConfig('API_HOST', '0.0.0.0');
  const port = findConfig('API_PORT', '8491');
  const secure = findConfig('SECURE', 'false') === 'true';
  const app = express();

  const server = createServer(app);
  const io = new Server(server, {
    cors: {
      origin: [findConfig('WEBAPP_ORIGIN', '')],
      credentials: true,
    },
  });

  io.on('connection', socket => {
    socket.on('meeting:join', async meetingId => {
      const { principalId } = socket.request.session;
      if (await participantExists(meetingId, principalId)) {
        socket.join(`meeting:${meetingId}`);
        socket.emit('meeting:joined', meetingId);
      }
    });
    socket.on('meeting:leave', meetingId => {
      socket.leave(`meeting:${meetingId}`);
      socket.emit('meeting:left', meetingId);
    });
  });

  const RedisStore = connectRedis(expressSession);
  const redisClient = createRedisClient({
    host: findConfig('REDIS_HOST', 'localhost'),
  });
  redisClient.on('connect', () => console.log(`redis client connected`));
  redisClient.on('error', error => console.log(`redis client error: ${error}`));

  const sessionMiddleware = expressSession({
    cookie: { sameSite: true, secure },
    name: 'session_id',
    resave: true,
    saveUninitialized: true,
    secret: findConfig('SESSION_SECRET', ''),
    store: new RedisStore({ client: redisClient }),
  });

  io.use((socket, next) => {
    // This code was taken from the documentation for using Socket.IO with express-session:
    // https://socket.io/docs/v4/faq/#usage-with-express-session
    // This was not designed with typescript in mind so it shows that the types are incompatible
    // @ts-ignore
    sessionMiddleware(socket.request, {}, next);
  });

  app.set('trust proxy', 1);

  app.use(helmet());
  app.use(express.json());
  app.use(sessionMiddleware);
  app.use((req, res, next) => {
    req.io = io;
    next();
  });
  const withCors = cors({
    credentials: true,
    origin: findConfig('WEBAPP_ORIGIN', ''),
  });
  app.use(withCors, authRouter);
  app.use('/competencies', withCors, loggedIn, competenciesRouter);
  app.use('/docs', withCors, docsRouter);
  app.use('/meetings', withCors, loggedIn, meetingsRouter);
  app.use('/programs', withCors, loggedIn, programsRouter);
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
  app.use(handleErrors(logger.error.bind(logger)));

  server.listen(Number(port), host, () => {
    console.log(
      `api listening on ${host}:${port} in ${
        process.env.NODE_ENV || 'development'
      } mode`
    );
  });
};

start();
