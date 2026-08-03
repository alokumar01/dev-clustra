class ApiError extends Error {
  constructor(status, message, code = "ERROR", errors = []) {
    super(message);

    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.errors = Array.isArray(errors) ? errors : [];

    Error.captureStackTrace(this, this.constructor);
  }
}

export default ApiError;
