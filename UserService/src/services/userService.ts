import { UserRepository } from "../repository/UserRepository";
import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import {
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from "../utils/ExceptionWrappers/customError";
import { generateToken } from "../utils/helpers";
import { Role } from "../types/roles";

const JWT_SECRET = process.env.JWT_SECRET || "your-very-secure-secret-key";

export class UserService {
  private userRepository = new UserRepository();

  async register(
    email: string,
    password?: string,
    name?: string,
    role?: Role
  ): Promise<User> {
    if (!email) throw new ValidationError("Email is required");

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) throw new ValidationError("Email already in use");

    const hashedPassword = password
      ? await bcrypt.hash(password, 10)
      : undefined;
    return this.userRepository.create({
      email,
      password: hashedPassword,
      name,
      role,
    });
  }

  async login(
    email: string,
    password?: string
  ): Promise<{ user: User; token: string }> {
    if (!email) throw new ValidationError("Email is required");

    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new UnauthorizedError("Invalid email or password");

    if (password && user.password) {
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) throw new UnauthorizedError("Invalid email or password");
    } else if (password && !user.password) {
      throw new UnauthorizedError(
        "This account uses OAuth; no password login available"
      );
    }

    const token = await generateToken(user);

    const updatedUser = await this.userRepository.update(user.id, { token });

    return { user: updatedUser, token };
  }

  async logout(userId: string): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundError("User not found");

    await this.userRepository.update(userId, { token: null });
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async updateUser(
    id: string,
    updates: Partial<Pick<User, "email" | "password" | "name" | "role">>
  ): Promise<User> {
    const user = await this.getUserById(id);
    if (updates.email && updates.email !== user.email) {
      const emailExists = await this.userRepository.findByEmail(updates.email);
      if (emailExists) {
        throw new ValidationError("Email already in use");
      }
    }
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }
    return this.userRepository.update(id, updates);
  }

  async deleteUser(id: string): Promise<void> {
    await this.getUserById(id);
    const deletedUser = await this.userRepository.delete(id);
    return deletedUser;
  }
}
