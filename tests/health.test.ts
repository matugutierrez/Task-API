jest.mock("../src/lib/prisma", () => ({
  prisma: {
    $queryRaw: jest.fn(),
  },
}))

import request from "supertest"
import { prisma } from "../src/lib/prisma"
import { createApp } from "../src/app"

const mockedPrisma = prisma as unknown as { $queryRaw: jest.Mock }

describe("GET /health", () => {
  it("returns ok when the database responds", async () => {
    mockedPrisma.$queryRaw.mockResolvedValue([{ result: 1 }])

    const app = createApp()
    const response = await request(app).get("/health")

    expect(response.status).toBe(200)
    expect(response.body.status).toBe("ok")
  })

  it("returns 503 when the database is unreachable", async () => {
    mockedPrisma.$queryRaw.mockRejectedValue(new Error("connection refused"))

    const app = createApp()
    const response = await request(app).get("/health")

    expect(response.status).toBe(503)
    expect(response.body.status).toBe("error")
  })
})
