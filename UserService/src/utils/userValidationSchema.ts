import Joi from "joi";

// Updated Role Enum
const roleEnum = ["USER", "DRIVER", "ADMIN"] as const;

// Create User Validation Schema
export const createUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(128).required(),
  name: Joi.string().min(2).max(100).optional(),
  phone: Joi.string()
    .pattern(/^[0-9]{10,15}$/)
    .optional(),
  role: Joi.string()
    .valid(...roleEnum)
    .optional(),
  isActive: Joi.boolean().optional(),
});

// Update User Schema
export const updateUserSchema = Joi.object({
  email: Joi.string().email().optional(),
  password: Joi.string().min(6).max(128).optional(),
  name: Joi.string().min(2).max(100).optional(),
  phone: Joi.string()
    .pattern(/^[0-9]{10,15}$/)
    .optional(),
  role: Joi.string()
    .valid(...roleEnum)
    .optional(),
  isActive: Joi.boolean().optional(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(128).required(),
});
