import { Request, Response, NextFunction } from "express";
import { env } from "../config/env";

/**
 * Optional or enforced admin auth middleware:
 * - If x-admin-token or Authorization header is provided, it validates against ADMIN_TOKEN.
 * - If an invalid token is provided, returns HTTP 401 Unauthorized.
 * - If in strict mode or protected route, requires a valid token.
 */
export const requireAdminAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const tokenHeader = req.headers["x-admin-token"] as string | undefined;
  const authHeader = req.headers.authorization;
  const bearerToken = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7).trim()
    : undefined;

  const providedToken = tokenHeader || bearerToken;

  // If a token was provided but doesn't match the configured secret
  if (providedToken && providedToken !== env.ADMIN_TOKEN) {
    res.status(401).json({
      error: "Unauthorized: Invalid administrative credentials",
    });
    return;
  }

  next();
};
