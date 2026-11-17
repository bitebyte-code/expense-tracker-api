const errorHandler = (error, req, res, next) => {
  let statusCode = error.statusCode || 500;
  let message = error.message || "Internal server error";

  if (error.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(error.errors).map((item) => item.message).join(", ");
  }

  if (error.name === "CastError") {
    statusCode = 400;
    message = "Invalid value provided";
  }

  if (error.code === 11000) {
    statusCode = 409;
    message = "A record with these details already exists";
  }

  res.status(statusCode).json({
    success: false,
    message
  });
};

module.exports = errorHandler;
