import { Request, Response, NextFunction } from 'express';

import { errorEnvelope } from './responseEnvelope';

export const loggedIn = (req: Request, res: Response, next: NextFunction) => {
  if (req.session.principalId) {
    next();
    return;
  }
  res
    .status(401)
    .json(
      errorEnvelope('This session is not authenticated. Sign in to continue.')
    );
};
