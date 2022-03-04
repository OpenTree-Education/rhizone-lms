import { ErrorRequestHandler, RequestHandler } from 'express';

import { errorEnvelope } from './responseEnvelope';
import { HttpError, InternalServerError, NotFoundError } from './httpErrors';

export const handleErrors: (
  logError: (...logData: unknown[]) => void
) => ErrorRequestHandler = logError => (err, req, res, next) => {
  logError(err);
  // If headers have been sent, delegate to the default Express error handler.
  // See: https://expressjs.com/en/guide/error-handling.html#the-default-error-handler
  if (res.headersSent) {
    next(err);
    return;
  }
  if (err instanceof HttpError) {
    res.status(err.status);
    res.json(errorEnvelope(err.message));
  } else {
    res.status(InternalServerError.prototype.status);
    res.json(
      // Use a generic error message for unknown errors to prevent sensitive
      // implementation details from being leaked. Use instances of `HttpError`
      // to customize error messages.
      errorEnvelope(InternalServerError.prototype.message)
    );
  }
};

export const handleNotFound: RequestHandler = (req, res) => {
  res.status(NotFoundError.prototype.status);
  res.json(errorEnvelope(NotFoundError.prototype.message));
};
