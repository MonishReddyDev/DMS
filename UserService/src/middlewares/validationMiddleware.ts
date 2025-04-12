import { Request, Response, NextFunction } from "express";
import {
  createUserSchema,
  loginSchema,
  updateUserSchema,
} from "../utils/userValidationSchema";

export const registerSchemaValidation = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error, value } = createUserSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errorMessages,
    });
    return;
  }

  req.body = value;
  next();
};

export const updateUserSchemaValidation = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error, value } = updateUserSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errorMessages,
    });
    return;
  }

  req.body = value;
  next();
};

export const loginUserSchemaValidation = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error, value } = loginSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errorMessages,
    });
    return;
  }

  req.body = value;
  next();
};
