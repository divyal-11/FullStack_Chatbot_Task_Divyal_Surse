import { Request, Response, NextFunction } from "express";
import { env } from "../config/env";

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

  if (providedToken !== env.ADMIN_TOKEN) {
    res.status(401).json({
      error: "Unauthorized",
    });
    return;
  }

  next();
};
