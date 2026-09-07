import { Request, Response, NextFunction } from "express";
import { env } from "../config/env";

/**
 * Admin authentication middleware:
 * - Authorization: Bearer <correct-token> -> allowed
 * - x-admin-token: <correct-token> -> allowed
 * - Missing token -> 401 Unauthorized
 * - Wrong token -> 401 Unauthorized
 * Response does NOT expose internal details.
 */
export const requireAdminAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  const tokenHeader = req.headers["x-admin-token"] as string | undefined;

  let providedToken: string | undefined;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    providedToken = authHeader.slice(7).trim();
  } else if (tokenHeader) {
    providedToken = tokenHeader.trim();
  }

  if (!providedToken || providedToken !== env.ADMIN_TOKEN) {
    res.status(401).json({
      error: "Unauthorized",
    });
    return;
  }

  next();
};
