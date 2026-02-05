import logger from "../config/logger.js";

export const errorHandler = (err, req, res, next) => {
  logger.error(err.message);
  return res.status(400).json({
    success: false,
    errors: err.errors.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    })),
  });

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      success: false,
      message: `${field} already exists.`,
    });
  }
  return res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};
