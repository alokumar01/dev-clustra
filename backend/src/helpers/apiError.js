class ApiError extends Error {
  constructor(status, message, code, details = null) {
    super(message);

    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default ApiError;