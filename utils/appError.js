class AppError extends Error {
    constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode;
      this.isOperational = true;
      this.status = `${statusCode}`.startsWith(4) ? 'error' : 'fail';
    }
  }

module.exports = AppError;