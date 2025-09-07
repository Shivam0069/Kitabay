class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  if (err.name === "JsonWebTokenError") {
    const message = "JSON Web Token is invalid. Try Again!!!";
    const statusCode = 400;
    err = new ErrorHandler(message, statusCode);
  }

  if (err.name === "TokenExpiredError") {
    const message = "JSON Web Token is expired. Try Again!!!";
    const statusCode = 400;
    err = new ErrorHandler(message, statusCode);
  }

  if (err.code && err.code === 11000) {
    const field = Object.keys(err.keyValue);
    const message = `Duplicate value for field: ${field}`;
    const statusCode = 400;
    err = new ErrorHandler(message, statusCode);
  }

  if (err.name === "CastError") {
    const message = `Resource not found. Invalid: ${err.path}`;
    const statusCode = 400;
    err = new ErrorHandler(message, statusCode);
  }

  const errorMessage = err.errors
    ? Object.values(err.errors).map((value) => value.message)
    : err.message;

  return res.status(err.statusCode).json({
    success: false,
    message: errorMessage,
  });
};

export default ErrorHandler;
