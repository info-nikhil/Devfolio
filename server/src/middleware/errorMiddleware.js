function resolveStatusCode(error, res) {
  if (Number.isInteger(error?.statusCode) && error.statusCode >= 400) {
    return error.statusCode;
  }

  if (Number.isInteger(error?.status) && error.status >= 400) {
    return error.status;
  }

  if (error?.type === "entity.too.large") {
    return 413;
  }

  if (["entity.parse.failed", "request.aborted", "request.size.invalid"].includes(error?.type)) {
    return 400;
  }

  if (res.statusCode && res.statusCode !== 200) {
    return res.statusCode;
  }

  return 500;
}

function errorMiddleware(error, req, res, next) {
  console.error(error);
  const statusCode = resolveStatusCode(error, res);
  res.status(statusCode).json({
    message: error.message || "Server error"
  });
}

module.exports = errorMiddleware;
