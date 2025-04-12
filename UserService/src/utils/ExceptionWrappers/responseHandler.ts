import { Response } from "express";
import { CustomError } from "./customError";

export class ResponseHandler {
  static success<T>(
    res: Response,
    data: T,
    message: string,
    status: number = 200
  ) {
    return res.status(status).json({
      success: true,
      data,
      message,
      status,
    });
  }

  static error(res: Response, error: Error) {
    if (error instanceof CustomError) {
      return res.status(error.status).json({
        success: false,
        message: error.message,
      });
    }
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
