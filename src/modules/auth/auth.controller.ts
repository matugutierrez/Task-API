import { Request, Response, NextFunction } from "express"
import { registerSchema, loginSchema } from "./auth.validation"
import { registerUser, loginUser } from "./auth.service"

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const input = registerSchema.parse(req.body)
    const result = await registerUser(input)
    res.status(201).json(result)
  } catch (err) {
    next(err)
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const input = loginSchema.parse(req.body)
    const result = await loginUser(input)
    res.status(200).json(result)
  } catch (err) {
    next(err)
  }
}
