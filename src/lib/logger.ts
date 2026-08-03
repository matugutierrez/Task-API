import pino from "pino"
import { env } from "../config/env"

export const logger = pino({
  level: env.logLevel,
  formatters: {
    level(label) {
      return { level: label }
    },
  },
  timestamp: pino.stdTimeFunctions.isoTime,
})
