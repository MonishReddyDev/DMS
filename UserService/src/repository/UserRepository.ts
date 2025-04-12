import { Role, User } from "@prisma/client";

import prisma from "../config/prismaClient";
import { prismaOperation } from "../utils/ExceptionWrappers/PrismaOperationWrapper";


type UserUpdateInput = Partial<
  Pick<
    User,
    "email" | "password" | "name" | "phone" | "role" | "isActive" | "token"
  >
>;

export class UserRepository {
  private prisma = prisma;

  async create(data: {
    email: string;
    password?: string;
    name?: string;
    role?: Role;
  }): Promise<User> {
    return prismaOperation(
      () =>
        this.prisma.user.create({
          data,
        }),
      "UserRepository.create"
    );
  }

  async findById(id: string): Promise<User | null> {
    return prismaOperation(
      () => this.prisma.user.findUnique({ where: { id } }),
      "UserRepository.findById"
    );
  }

  async findByEmail(email: string): Promise<User | null> {
    return prismaOperation(
      () => this.prisma.user.findUnique({ where: { email } }),
      "UserRepository.findByEmail"
    );
  }

  async update(id: string, updates: UserUpdateInput): Promise<User> {
    return prismaOperation(
      () =>
        this.prisma.user.update({
          where: { id },
          data: updates,
        }),
      "UserRepository.update"
    );
  }

  async findActiveUsers(): Promise<User[]> {
    return prismaOperation(
      () => this.prisma.user.findMany({ where: { isActive: true } }),
      "UserRepository.findActiveUsers"
    );
  }

  async findAll(skip = 0, take = 10): Promise<User[]> {
    return prismaOperation(
      () => this.prisma.user.findMany({ skip, take }),
      "UserRepository.findAll"
    );
  }

  async delete(id: string): Promise<void> {
    return prismaOperation(
      () => this.prisma.user.delete({ where: { id } }).then(() => undefined),
      "UserRepository.delete"
    );
  }
}
