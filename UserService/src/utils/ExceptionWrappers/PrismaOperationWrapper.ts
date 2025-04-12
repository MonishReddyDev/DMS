import { Prisma } from "@prisma/client";
import { DatabaseError, NotFoundError } from "./customError";

// Prisma operation wrapper
export async function prismaOperation<T>(
  operation: () => Promise<T>,
  operationName: string
): Promise<T> {
  try {
    return await operation();
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        throw new NotFoundError(`${operationName}: Record not found`);
      }
      throw new DatabaseError(
        `${operationName}: Database error (Code: ${error.code}) - ${error.message}`
      );
    } else if (error instanceof Prisma.PrismaClientUnknownRequestError) {
      throw new DatabaseError(`${operationName}: Unknown database error`);
    } else if (error instanceof Error) {
      throw new DatabaseError(`${operationName}: ${error.message}`);
    }
    throw new DatabaseError(`${operationName}: Unknown error occurred`);
  }
}
