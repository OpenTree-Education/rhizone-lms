import expressSession from 'express-session';
import express, { NextFunction, Request, Response, Router } from 'express';
import { agent, SuperAgentTest } from 'supertest';

const getPrincipalId = jest.fn();

export const mockPrincipalId = (principalId: number) => {
  getPrincipalId.mockReturnValue(principalId);
};

export const sessionDestroyMock = jest.fn();

export const createAppAgentForRouter = (router: Router): SuperAgentTest => {
  const app = express();
  app.use(
    expressSession({
      resave: true,
      saveUninitialized: true,
      secret: 'secret',
    })
  );
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
