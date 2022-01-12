export class HttpError extends Error {
  status: number;
}
HttpError.prototype.message = 'An error occurred while processing the request.';
HttpError.prototype.status = 500;

export class BadRequestError extends HttpError {}
BadRequestError.prototype.message =
  'The request could not be completed with the given parameters.';
BadRequestError.prototype.status = 400;

export class InternalServerError extends HttpError {}

export class NotFoundError extends HttpError {}
NotFoundError.prototype.message = 'The requested resource does not exist.';
NotFoundError.prototype.status = 404;

export class UnauthorizedError extends HttpError {}
UnauthorizedError.prototype.message =
  'The requester does not have access to the resource.';
UnauthorizedError.prototype.status = 401;

export class ValidationError extends HttpError {}
ValidationError.prototype.message =
  'The provided data does not meet requirements.';
ValidationError.prototype.status = 422;
