import { Request, Response } from "express";
import { UserService } from "../services/userService";
import { controllerWrapper } from "../utils/ExceptionWrappers/controllerWrapper";

const JWT_SECRET = process.env.JWT_SECRET || "your-very-secure-secret-key";

export class UserController {
  private userService = new UserService();

  register = controllerWrapper(async (req: Request) => {
    const { email, password, name, role } = req.body;
    const user = await this.userService.register(email, password, name, role);
    return { data: user, message: "User created successfully", status: 201 };
  });

  login = controllerWrapper(async (req: Request) => {
    const { email, password } = req.body;
    const { user } = await this.userService.login(email, password);
    return { data: user, message: "Login successful", status: 200 };
  });

  logout = controllerWrapper(async (req: Request) => {
    const user = (req as any).user; // Extracted from middleware
    await this.userService.logout(user.id);
    return { data: null, message: "Logged out successfully", status: 200 };
  });

  getUserById = controllerWrapper(async (req: Request) => {
    const id = req.params.id;
    const user = await this.userService.getUserById(id);
    return { data: user, message: "User fetched successfully", status: 200 };
  });

  getAllUsers = controllerWrapper(async (req: Request) => {
    const users = await this.userService.getAllUsers();
    return { data: users, message: "Users fetched successfully", status: 200 };
  });

  updateUser = controllerWrapper(async (req: Request) => {
    const id = req.params.id;
    const updates = req.body;
    const user = await this.userService.updateUser(id, updates);
    return { data: user, message: "User updated successfully", status: 200 };
  });

  deleteUser = controllerWrapper(async (req: Request) => {
    const id = req.params.id;
    const deletedUser = await this.userService.deleteUser(id);
    return {
      data: null,
      message: "User deleted successfully",
      status: 200,
    };
  });
}
