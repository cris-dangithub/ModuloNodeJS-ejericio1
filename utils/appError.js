class AppError extends Error {
  constructor(message, statusCode, extraInfo = {}) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'error' : 'fail';
    this.isOperational = true;
    this.extraInfo = extraInfo;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
