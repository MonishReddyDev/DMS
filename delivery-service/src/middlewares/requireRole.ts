import { NextFunction, Request, Response } from "express";
import { Role } from "../types/roles";

export const requiredRole = (...allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;
    console.log(userRole);
    if (!userRole || !allowedRoles.includes(userRole)) {
      res.status(403).json({ message: "Access denied" });
      return;
    }

    next();
  };
};
