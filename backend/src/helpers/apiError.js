class ApiError extends Error {
  constructor(status, message, code, details = null) {
    super(message);
    this.status = status || 500;
    this.code = code;
    this.details = details;

    Error.captureStackTrace(this, this.contructor);
  }
}

export default ApiError;
