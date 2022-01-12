import { ErrorRequestHandler, RequestHandler } from 'express';

import { errorEnvelope } from './responseEnvelope';
import { HttpError, InternalServerError, NotFoundError } from './httpErrors';

export const handleErrors: ErrorRequestHandler = (err, req, res, next) => {
  // If headers have been sent, delegate to the default Express error handler.
  // See: https://expressjs.com/en/guide/error-handling.html#the-default-error-handler
  if (res.headersSent) {
    next(err);
    return;
  }
  // This call to console.log is required so that error details are printed to
  // the server logs.
  console.log(err);
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
