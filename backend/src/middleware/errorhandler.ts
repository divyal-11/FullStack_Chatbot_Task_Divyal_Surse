import { Request, Response, NextFunction } from "express";

export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Known operational errors (e.g. 404 Not Found, 400 Bad Request)
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: err.message,
    });
    return;
  }

  // Prisma record not found error (P2025)
  if ((err as any).code === "P2025") {
    res.status(404).json({
      error: "The requested enquiry does not exist",
    });
    return;
  }

  // Server error: Log full details on server, conceal raw DB details from client
  console.error("🔥 Internal Server Error:", err);

  res.status(500).json({
    error: "An unexpected error occurred. Please try again later.",
  });
};
