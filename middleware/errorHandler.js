const DEBUG_MODE = process.env.DEBUG_MODE;
const { ValidationError } = require("joi");
const CustomErrorhandler = require("../services/CustomErrorHandler");

const errorHandler = (err, req, res, next) => {
  let statusCode = 500;
  let data = {
    msg: "internal server error",
    ...(DEBUG_MODE === "true" && { originalError: err.message }),
  };

  if (err instanceof ValidationError) {
    statusCode: 422,
      (data = {
        message: err.message,
      });
  }

  if (err instanceof CustomErrorhandler) {
    statusCode = err.status;
    data = {
      message: err.message,
    };
  }

  return res.status(statusCode).json(data);
};
module.exports = errorHandler;
