const { CustomAPIError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    status: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong try again",
  };
  if (err instanceof CustomAPIError) {
    return res.status(err.statusCode).json({ msg: err.message });
  }
  if (err.name === "ValidationError") {
    (customError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(",")),
      (customError.statusCode = 400);
  }
  if (err.name === "CastError") {
    customError.msg = `No job with the ID: ${err.value}`;
    customError.StatusCodes = 404;
  }
  if (err.code && err.code === 11000) {
    (customError.status = 400),
      (customError.msg = `Duplicate value entered for ${Object.keys(
        err.keyValue
      )} field, please try another value`);
  }
  return res.status(customError.status).json({ msg: customError.msg });
  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err });
};

module.exports = errorHandlerMiddleware;
