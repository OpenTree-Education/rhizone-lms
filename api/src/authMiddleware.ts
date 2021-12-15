import express, { Request, Response, NextFunction } from 'express';
import session from 'express-session';
import { UnauthorizedError } from './httpErrors';

export const loggedIn = (req: Request, res: Response, next: NextFunction) => {
  if (req.session.principalId) {
    next();
    return;
  }
  next(
    new UnauthorizedError(
      'The request is not authenticated. Sign in to access this resource.'
    )
  );
};

export const getSessionMiddleware = (app: express.Application) =>
  session({
    secret: process.env.SESSION_SECRET || 'default session secret',
    name: 'session_id',
    resave: true,
    saveUninitialized: true,
    cookie: {
      sameSite: true,
      secure: app.get('secure'),
    },
  });
