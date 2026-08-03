import { z } from "zod"
import dotenv from "dotenv"

dotenv.config()

const envSchema = z.object({
  PORT: z.string().default("3000"),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(1),
  JWT_EXPIRES_IN: z.string().default("1d"),
  LOG_LEVEL: z.string().default("info"),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  throw new Error(parsed.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join(", "))
}

export const env = {
  port: Number(parsed.data.PORT),
  nodeEnv: parsed.data.NODE_ENV,
  databaseUrl: parsed.data.DATABASE_URL,
  jwtSecret: parsed.data.JWT_SECRET,
  jwtExpiresIn: parsed.data.JWT_EXPIRES_IN,
  logLevel: parsed.data.LOG_LEVEL,
}
