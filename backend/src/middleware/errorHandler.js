/**
 * Centralized API error handling middleware
 */
function errorHandler(err, req, res, next) {
  console.error('[API ERROR]', req.method, req.originalUrl, err);

  const statusCode = err.statusCode || (res.statusCode !== 200 ? res.statusCode : 500);

  res.status(statusCode).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {})
  });
}

module.exports = errorHandler;
