import { agent, SuperAgentTest } from 'supertest';
import { createServer } from 'http';
import express, { NextFunction, Request, Response, Router } from 'express';
import expressSession from 'express-session';
import { findConfig } from './../services/configService';
import { Server } from 'socket.io';

const getPrincipalId = jest.fn();

export const mockPrincipalId = (principalId: number) => {
  getPrincipalId.mockReturnValue(principalId);
};

export const sessionDestroyMock = jest.fn();

export const createAppAgentForRouter = (router: Router): SuperAgentTest => {
  const app = express();

  const server = createServer(app);
  const io = new Server(server, {
    cors: {
      origin: [findConfig('WEBAPP_ORIGIN', '')],
      credentials: true,
    },
  });

  const sessionMiddleware = expressSession({
    resave: true,
    saveUninitialized: true,
    secret: 'secret',
  });
  app.use(express.json());
  app.use(sessionMiddleware);
  app.use((req, res, next) => {
    req.io = io;
    next();
  });
  app.use((req: Request, res: Response, next: NextFunction) => {
    req.session.destroy = sessionDestroyMock.mockImplementation(
      req.session.destroy
    );
    req.session.principalId = getPrincipalId();
    next();
  });
  app.use(router);
  return agent(app);
};
