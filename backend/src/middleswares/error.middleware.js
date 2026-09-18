import ApiError from "../helpers/apiError.js";

const normalizeError = (err) => {
  if (err instanceof ApiError) return err;

  if (err?.name === "ApiError" && Number.isInteger(err.status)) {
    return new ApiError(err.status, err.message, err.code, err.errors);
  }

  if (err?.name === "TokenExpiredError") {
    return new ApiError(401, "Token expired, please login again.", "TOKEN_EXPIRED");
  }

  if (err?.name === "JsonWebTokenError") {
    return new ApiError(401, "Invalid token.", "INVALID_TOKEN");
  }

  if (err?.name === "CastError") {
    return new ApiError(400, "Invalid id.", "INVALID_ID");
  }

  if (err?.name === "MongooseServerSelectionError" || err?.name === "MongoServerSelectionError") {
    return new ApiError(503, "Database unavailable. Please try again later.", "DATABASE_UNAVAILABLE");
  }

  if (err?.code === 11000) {
    return new ApiError(409, "Resource already exists.", "DUPLICATE_RESOURCE");
  }

  return err;
};

const errorMiddleware = (err, req, res, _next) => {
  void _next;
  console.error("====== ERROR ======");
  console.error(err);

  const normalizedError = normalizeError(err);

  if (normalizedError instanceof ApiError) {
    const status = Number.isInteger(normalizedError.status) ? normalizedError.status : 500;

    return res.status(status).json({
      success: false,
      message: normalizedError.message,
      code: normalizedError.code,
      errors: normalizedError.errors,
    });
  }

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
    code: "INTERNAL_SERVER_ERROR",
    errors: [],
  });
};

export default errorMiddleware;
