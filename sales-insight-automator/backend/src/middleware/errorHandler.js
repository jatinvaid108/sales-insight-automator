/**
 * Centralized Error Handler Middleware
 *
 * Catches all errors passed via next(error) and returns
 * a consistent JSON error response.
 *
 * In production, hides internal error details from clients.
 */
const errorHandler = (err, req, res, next) => {
  const isDev = process.env.NODE_ENV !== 'production';

  // Log full error in server console
  console.error(`[Error] ${err.message}`);
  if (isDev && err.stack) {
    console.error(err.stack);
  }

  // Determine HTTP status code
  const statusCode = err.statusCode || err.status || 500;

  // Build response object
  const response = {
    success: false,
    message: err.message || 'An unexpected error occurred. Please try again.',
  };

  // Include stack trace only in development
  if (isDev && err.stack) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

module.exports = errorHandler;
