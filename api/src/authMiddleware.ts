import { Request, Response, NextFunction } from 'express';

export const loggedIn = (req: Request, res: Response, next: NextFunction) => {
  if (req.session.principalId) {
    next();
    return;
  }
  res.sendStatus(401);
};
