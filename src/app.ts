import express from "express"
import cors from "cors"
import helmet from "helmet"
import { requestLogger } from "./middleware/requestLogger"
import { errorHandler } from "./middleware/errorHandler"
import authRoutes from "./modules/auth/auth.routes"
import taskRoutes from "./modules/tasks/tasks.routes"
import healthRoutes from "./modules/health/health.routes"

export function createApp() {
  const app = express()

  app.use(helmet())
  app.use(cors())
  app.use(express.json())
  app.use(requestLogger)

  app.use("/health", healthRoutes)
  app.use("/auth", authRoutes)
  app.use("/tasks", taskRoutes)

  app.use(errorHandler)

  return app
}
