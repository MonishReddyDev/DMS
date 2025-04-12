import { Router } from "express";
import { UserController } from "../controllers/userController";
import { authenticateToken } from "../middlewares/authenticateToken";
import {
  loginUserSchemaValidation,
  registerSchemaValidation,
  updateUserSchemaValidation,
} from "../middlewares/validationMiddleware";

const router = Router();

const userController = new UserController();
// Public routes
router.post("/register", registerSchemaValidation, userController.register);
router.post("/login", loginUserSchemaValidation, userController.login);

// Protected routes
router.post("/logout", authenticateToken, userController.logout);
router.get("/users/:id", userController.getUserById); //add authenticateToken in future
router.get("/users", authenticateToken, userController.getAllUsers);
router.put(
  "/users/:id",
  updateUserSchemaValidation,
  authenticateToken,
  userController.updateUser
);
router.delete("/users/:id", authenticateToken, userController.deleteUser);

export default router;
