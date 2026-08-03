import { Request, Response, NextFunction } from "express"
import { ZodError } from "zod"
import { AppError } from "../utils/AppError"
import { logger } from "../lib/logger"

export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ZodError) {
    res.status(400).json({ error: "Validation error", details: err.issues })
    return
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message })
    return
  }

  logger.error({ err }, "Unhandled error")
  res.status(500).json({ error: "Internal server error" })
}
