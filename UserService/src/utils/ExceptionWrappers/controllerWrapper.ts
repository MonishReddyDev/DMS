import { Response, Request, NextFunction } from "express";
import { ResponseHandler } from "./responseHandler";

export function controllerWrapper<T>(
  fn: (req: Request) => Promise<{ data: T; message: string; status?: number }>
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { data, message, status } = await fn(req);
      ResponseHandler.success(res, data, message, status);
    } catch (error) {
      next(error);
    }
  };
}
