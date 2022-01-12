import { Request, Response } from 'express';

import { loggedIn } from '../authMiddleware';
import { UnauthorizedError } from '../httpErrors';

describe('authMiddleware', () => {
  describe('loggedIn', () => {
    it('should delegate to the next handler if the principal is authenticated', () => {
      const next = jest.fn();
      loggedIn(
        { session: { principalId: 1 } } as Request,
        {} as Response,
        next
      );
      expect(next).toHaveBeenCalledWith();
    });

    it('should delegate to the error handler with an UnauthorizedError with a custom message if the principal is not authenticated', () => {
      const next = jest.fn();
      loggedIn({ session: {} } as Request, {} as Response, next);
      expect(next.mock.calls[0][0]).toBeInstanceOf(UnauthorizedError);
      expect(next.mock.calls[0][0].message).toEqual(
        'The request is not authenticated. Sign in to access this resource.'
      );
    });
  });
});
