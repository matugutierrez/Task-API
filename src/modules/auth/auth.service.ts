import { prisma } from "../../lib/prisma"
import { hashPassword, comparePassword } from "../../utils/password"
import { signToken } from "../../utils/jwt"
import { AppError } from "../../utils/AppError"
import { RegisterInput, LoginInput } from "./auth.validation"

export async function registerUser(input: RegisterInput) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } })

  if (existing) {
    throw new AppError(409, "Email already registered")
  }

  const hashed = await hashPassword(input.password)

  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      password: hashed,
    },
  })

  const token = signToken({ userId: user.id, email: user.email })

  return { token, user: { id: user.id, name: user.name, email: user.email } }
}

export async function loginUser(input: LoginInput) {
  const user = await prisma.user.findUnique({ where: { email: input.email } })

  if (!user) {
    throw new AppError(401, "Invalid credentials")
  }

  const valid = await comparePassword(input.password, user.password)

  if (!valid) {
    throw new AppError(401, "Invalid credentials")
  }

  const token = signToken({ userId: user.id, email: user.email })

  return { token, user: { id: user.id, name: user.name, email: user.email } }
}
