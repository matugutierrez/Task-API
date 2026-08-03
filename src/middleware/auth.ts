import { Request, Response, NextFunction } from "express"
import { verifyToken } from "../utils/jwt"
import { AppError } from "../utils/AppError"

export interface AuthenticatedRequest extends Request {
  userId?: string
}

export function requireAuth(req: AuthenticatedRequest, _res: Response, next: NextFunction) {
  const header = req.headers.authorization

  if (!header || !header.startsWith("Bearer ")) {
    next(new AppError(401, "Missing or invalid authorization header"))
    return
  }

  const token = header.slice("Bearer ".length)

  try {
    const payload = verifyToken(token)
    req.userId = payload.userId
    next()
  } catch {
    next(new AppError(401, "Invalid or expired token"))
  }
}
