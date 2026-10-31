/**
 * Centralized API error handling middleware with multilingual error keys
 * and sanitized messages (never exposes raw SQL or stack traces).
 */
function errorHandler(err, req, res, next) {
  console.error('[API ERROR]', req.method, req.originalUrl, err);

  const statusCode = err.statusCode || (res.statusCode !== 200 ? res.statusCode : 500);
  const locale = req.headers['accept-language'] || req.query?.locale || 'en';

  const isInternal = statusCode >= 500;
  const safeMessage = isInternal
    ? 'An unexpected error occurred. Please try again later.'
    : (err.message || 'Request failed.');

  res.status(statusCode).json({
    success: false,
    code: err.code || (isInternal ? 'INTERNAL_SERVER_ERROR' : 'REQUEST_ERROR'),
    messageKey: err.messageKey || (isInternal ? 'serverError' : 'requestError'),
    locale,
    error: safeMessage
  });
}

module.exports = errorHandler;
