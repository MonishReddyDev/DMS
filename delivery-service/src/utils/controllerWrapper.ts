import { Request, Response, NextFunction } from "express";

export const controllerWrapper = (
  fn: (req: Request) => Promise<{ data: any; status: number; message?: string }>
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { data, status, message } = await fn(req);
      res.status(status).json({ success: true, data, message });
    } catch (error) {
      next(error);
    }
  };
};
