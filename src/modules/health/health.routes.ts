import { Router, Request, Response } from "express"
import { prisma } from "../../lib/prisma"

const router = Router()

router.get("/", async (_req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`
    res.status(200).json({ status: "ok", uptime: process.uptime(), database: "connected" })
  } catch {
    res.status(503).json({ status: "error", uptime: process.uptime(), database: "disconnected" })
  }
})

export default router
