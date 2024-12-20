import { ApiError } from "../utils/ApiError.js";

const errorHandler = (err, req, res, next) => {
  let formattedError;

  if (err instanceof ApiError) {
    // If the error is already an ApiError, use it as is
    formattedError = err;
  } else {
    // Wrap other errors (like ReferenceError) into an ApiError
    formattedError = ApiError.fromError(err, 500);
  }

  // Return formatted JSON response
  return res.status(formattedError.statusCode).json({
    success: formattedError.success,
    message: formattedError.message,
    errors: formattedError.errors,
    errorType: err.name || "Error", // Include error type (like ReferenceError)
    stack:
      process.env.NODE_ENV === "development" ? formattedError.stack : undefined, // Include stack only in development
  });
};

export default errorHandler;
