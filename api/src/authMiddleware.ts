import { Request, Response, NextFunction } from 'express';

import { UnauthorizedError } from './httpErrors';

declare module 'express-session' {
  interface Session {
    principalId: number;
  }
}

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
