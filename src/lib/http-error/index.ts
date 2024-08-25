interface HTTPErrorOptions {
  status?: number;
  message: string;
  details: any;
}

export class HTTPError extends Error {
  status: number;
  details: any;

  constructor(options: HTTPErrorOptions) {
    super(options.message);
    this.status = options.status ?? 500;
    this.details = options.details;
  }
}

export class BadRequestError extends HTTPError {
  constructor(options: HTTPErrorOptions) {
    super({ status: 400, ...options });
  }
}

export class UnauthorizedError extends HTTPError {
  constructor(options: HTTPErrorOptions) {
    super({ status: 401, ...options });
  }
}

export class ForbiddenError extends HTTPError {
  constructor(options: HTTPErrorOptions) {
    super({ status: 403, ...options });
  }
}

export class NotFoundError extends HTTPError {
  constructor(options: HTTPErrorOptions) {
    super({ status: 404, ...options });
  }
}
