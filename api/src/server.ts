// istanbul ignore file
/* eslint-disable @typescript-eslint/ban-ts-comment */
import RedisStore from 'connect-redis';
import cors from 'cors';
import { createClient as createRedisClient } from 'redis';
import { createServer } from 'http';
import express from 'express';
import session, { Session, SessionData } from 'express-session';
import helmet from 'helmet';
import Rollbar from 'rollbar';
import { Server } from 'socket.io';

import assessmentsRouter from './middleware/assessmentsRouter.ts.old';
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
import assessmentsDummyRouter from './middleware/assessmentsDummyRouter';
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

  app.set('trust proxy', 1);

  app.use(helmet());
  app.use(express.json());

  // Session information is stored in Redis for retrieval by both the
  // webapp front-end and the api back-end.
  const redisHost = findConfig('REDIS_HOST', 'localhost');
  const redisClient = createRedisClient({
    url: `redis://${redisHost}`,
  });

  // Try connecting to Redis. If we can't, notify the user and fall back
  // to in-memory session store, if possible.
  try {
    await redisClient.connect();

    if (!redisClient.isOpen) {
      throw new Error('trouble connecting to redis.');
    } else {
      console.info('redis client connected');
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sessionStore = new (RedisStore as any)({ client: redisClient });

    const sessionMiddleware = session({
      cookie: { sameSite: true, secure },
      name: 'session_id',
      resave: true,
      saveUninitialized: true,
      secret: findConfig('SESSION_SECRET', ''),
      store: sessionStore,
    });

    app.use(sessionMiddleware);
  } catch (err) {
    console.error(`redis client error: ${err}`);
    console.error("Have you run 'docker compose up' yet?");

    const sessionMiddleware = session({
      cookie: { sameSite: true, secure },
      name: 'session_id',
      resave: true,
      saveUninitialized: true,
      secret: findConfig('SESSION_SECRET', ''),
    });

    app.use(sessionMiddleware);
  }

  redisClient.on('error', console.error);

  app.use((req, res, next) => {
    req.io = io;
    next();
  });
  const withCors = cors({
    credentials: true,
    origin: findConfig('WEBAPP_ORIGIN', ''),
  });
  app.use(withCors, authRouter);
  app.use('/assessments', withCors, loggedIn, assessmentsRouter);
  app.use('/competencies', withCors, loggedIn, competenciesRouter);
  app.use('/docs', withCors, docsRouter);
  app.use('/meetings', withCors, loggedIn, meetingsRouter);
  app.use('/programs', withCors, loggedIn, programsRouter);
  app.use('/assessmentsDummy', withCors, loggedIn, assessmentsDummyRouter);
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
