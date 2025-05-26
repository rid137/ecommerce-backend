import { NextFunction, Request, Response } from "express";
import CustomError from "../errors/customError";
import { getErrorMessage } from "../utils/getErrorMessage";

export default function errorHandler(
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {
//   if (res.headersSent || process.env.APP_DEBUG) {
  if (res.headersSent) {
    next(error);
    return;
  }

  if (error instanceof CustomError) {
    res.status(error.statusCode).json({
      error: {
        message: error.message,
        statusCode: error.statusCode,
        code: error.code,
      },
    });
    return;
  }

  res.status(500).json({
    error: {
      message:
        getErrorMessage(error) ||
        "An error occurred. Please view logs for more details",
    },
  });
}