import ApiError from "../helpers/apiError.js";

const errorMiddleware = (err, req, res, next) => {
  console.error("====== ERROR ======");
  console.error(err);

  if (err instanceof ApiError) {
    const status = Number.isInteger(err.status) ? err.status : 500;

    return res.status(status).json({
      success: false,
      message: err.message,
      code: err.code,
      errors: err.errors,
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
