export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export class Unauthorized extends Error {
  constructor(message: string) {
    super(message);
    this.name = "Unauthorized";
  }
}
