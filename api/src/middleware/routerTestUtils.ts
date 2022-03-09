import { agent, SuperAgentTest } from 'supertest';
import { createServer } from 'http';
import express, { NextFunction, Request, Response, Router } from 'express';
import expressSession from 'express-session';
import { Server, Socket } from 'socket.io';
import { SuperAgent, SuperAgentRequest } from 'superagent';

declare module 'supertest' {
  interface SuperTest<T extends SuperAgentRequest> extends SuperAgent<T> {
    io: Socket;
  }
}
const getPrincipalId = jest.fn();

export const mockPrincipalId = (principalId: number) => {
  getPrincipalId.mockReturnValue(principalId);
};

export const sessionDestroyMock = jest.fn();

export const createAppAgentForRouter = (router: Router): SuperAgentTest => {
  const app = express();

  const server = createServer(app);
  const io = new Server(server);

  app.use(express.json());
  app.use(
    expressSession({
      resave: true,
      saveUninitialized: true,
      secret: 'secret',
    })
  );
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
  return agent(server);
};
