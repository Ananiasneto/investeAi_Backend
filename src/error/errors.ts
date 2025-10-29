export class NotFoundError extends Error {
  statusCode: number;

  constructor(message = "Resource not found") {
    super(message);
    this.name = "NotFoundError";
    this.statusCode = 404;
  }
}

export class UnauthorizedError extends Error {
  statusCode: number;

  constructor(message = "Unauthorized") {
    super(message);
    this.name = "UnauthorizedError";
    this.statusCode = 401;
  }
}

export class InvalidTokenError extends Error {
  statusCode: number;

  constructor(message = "Invalid token") {
    super(message);
    this.name = "InvalidTokenError";
    this.statusCode = 403;
  }
}

export class ConflictError extends Error {
  statusCode: number;

  constructor(message = "Conflict") {
    super(message);
    this.name = "ConflictError";
    this.statusCode = 409;
  }
}

export class UnprocessableEntityError extends Error {
  statusCode: number;

  constructor(message = "Unprocessable Entity") {
    super(message);
    this.name = "UnprocessableEntityError";
    this.statusCode = 422;
  }
 
}

export class BadRequestError extends Error {
  statusCode: number;

  constructor(message = "Bad request") {
    super(message);
    this.name = "BadRequestError";
    this.statusCode = 400;
  }
}
