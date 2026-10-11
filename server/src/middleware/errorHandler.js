export function errorHandler(err, req, res, next) {
  console.error('[Error Handler]:', err);

  // Zod validation error handling
  if (err.name === 'ZodError') {
    const formattedErrors = err.errors.map(e => ({
      field: e.path.join('.'),
      message: e.message
    }));
    return res.status(400).json({
      error: 'Validation failed',
      details: formattedErrors
    });
  }

  // SQLite duplicate key error
  if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
    return res.status(409).json({
      error: 'A record with this information already exists.'
    });
  }

  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
}

export function notFoundHandler(req, res) {
  res.status(404).json({ error: `Not Found: ${req.method} ${req.originalUrl}` });
}
