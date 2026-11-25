export function notFound(req, res, next) {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.status = 404;
  next(error);
}

export function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);

  const status = error.status || (error.name === "ValidationError" ? 400 : 500);
  if (status >= 500) console.error(error);

  res.status(status).json({
    success: false,
    message: status >= 500 ? "Internal server error" : error.message
  });
}
