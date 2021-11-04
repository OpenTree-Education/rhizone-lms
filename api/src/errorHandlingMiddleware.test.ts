import { Request, Response } from 'express';

import {
  BadRequestError,
  HttpError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from './httpErrors';
import { handleErrors, handleNotFound } from './errorHandlingMiddleware';

describe('errorHandlingMiddleware.ts', () => {
  describe('handleErrors', () => {
    it('should delegate to the next handler if response headers have been sent', () => {
      const err = new Error();
      const next = jest.fn();
      const status = jest.fn();
      handleErrors(
        err,
        {} as Request,
        { headersSent: true, status } as unknown as Response,
        next
      );
      expect(next).toHaveBeenCalledWith(err);
      expect(status).not.toHaveBeenCalled();
    });

    it('should send a generic internal server error response for errors that are not HTTP errors', () => {
      const err = new Error();
      const next = jest.fn();
      const status = jest.fn();
      const json = jest.fn();
      handleErrors(
        err,
        {} as Request,
        { status, json } as unknown as Response,
        next
      );
      expect(next).not.toHaveBeenCalled();
      expect(status).toHaveBeenCalledWith(InternalServerError.prototype.status);
      expect(json).toHaveBeenCalledWith({
        error: { message: InternalServerError.prototype.message },
      });
    });

    [
      HttpError,
      BadRequestError,
      InternalServerError,
      NotFoundError,
      UnauthorizedError,
      ValidationError,
    ].forEach(HttpErrorConstructor => {
      it(`should send a response with the configured status and message for ${HttpErrorConstructor.name} errors`, () => {
        const err = new HttpErrorConstructor();
        const next = jest.fn();
        const status = jest.fn();
        const json = jest.fn();
        handleErrors(
          err,
          {} as Request,
          { status, json } as unknown as Response,
          next
        );
        expect(next).not.toHaveBeenCalled();
        expect(status).toHaveBeenCalledWith(
          HttpErrorConstructor.prototype.status
        );
        expect(json).toHaveBeenCalledWith({
          error: { message: HttpErrorConstructor.prototype.message },
        });
      });

      it(`should send a response with a custom message for ${HttpErrorConstructor.name} errors`, () => {
        const customErrorMessage = 'Custom error message.';
        const err = new HttpErrorConstructor(customErrorMessage);
        const next = jest.fn();
        const status = jest.fn();
        const json = jest.fn();
        handleErrors(
          err,
          {} as Request,
          { status, json } as unknown as Response,
          next
        );
        expect(json).toHaveBeenCalledWith({
          error: { message: customErrorMessage },
        });
      });
    });
  });
  describe('handleNotFound', () => {
    it('should send a response with a default not found error', () => {
      const status = jest.fn();
      const json = jest.fn();
      const next = jest.fn();
      handleNotFound(
        {} as Request,
        { status, json } as unknown as Response,
        next
      );
      expect(next).not.toHaveBeenCalled();
      expect(status).toHaveBeenCalledWith(NotFoundError.prototype.status);
      expect(json).toHaveBeenCalledWith({
        error: { message: NotFoundError.prototype.message },
      });
    });
  });
});
