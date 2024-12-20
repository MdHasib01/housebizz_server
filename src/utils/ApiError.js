class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong",
    errors = [],
    stack = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.success = false;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  static fromError(err, statusCode = 500) {
    return new ApiError(
      statusCode,
      err.message || "Internal Server Error",
      [],
      err.stack
    );
  }
}

export { ApiError };
