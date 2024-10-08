const httpStatus = require("http-status");
const ApiError = require("../../errors/ApiError");
const handleValidationError = require("../../errors/handleValidationError");

const globalErrorHandler = (error, req, res, next) => {
  let statusCode = 500;
  let message = "Something went wrong";
  let errorMessages = [];

  if (error?.name === "ValidationError") {
    const simplifiedError = handleValidationError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  } else if (error?.name === "TokenExpiredError") {
    statusCode = httpStatus.UNAUTHORIZED;
    message = "Session Expired";
    (message = error?.message),
      (errorMessages = error?.message
        ? [
            {
              path: "",
              message: "Session Expired,Please login again then continue.",
            },
          ]
        : []);
  } else if (error instanceof Error) {
    (message = error?.message),
      (errorMessages = error?.message
        ? [
            {
              path: "",
              message: error?.message,
            },
          ]
        : []);
  } else if (error instanceof ApiError) {
    statusCode = error?.statusCode;
    (message = error?.message),
      (errorMessages = error?.message
        ? [
            {
              path: "",
              message: error?.message,
            },
          ]
        : []);
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorMessages,
    stack: process.env.NODE_ENV === "development" ? error?.stack : undefined,
  });
};

module.exports = globalErrorHandler;
