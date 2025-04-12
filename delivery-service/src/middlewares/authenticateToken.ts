import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { Role } from "../types/roles";

const JWT_SECRET = process.env.JWT_SECRET as string;

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "No token provided" });
    return;
  }

  try {
    console.log("checking");
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      email: string;
      role: Role;
    };
    console.log("Decoded user:", decoded);

    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid token" });
    return;
  }
};
