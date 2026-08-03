jest.mock("../src/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}))

import { prisma } from "../src/lib/prisma"
import { registerUser, loginUser } from "../src/modules/auth/auth.service"
import { hashPassword } from "../src/utils/password"

const mockedPrisma = prisma as unknown as {
  user: {
    findUnique: jest.Mock
    create: jest.Mock
  }
}

describe("auth service", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("registers a new user and returns a token", async () => {
    mockedPrisma.user.findUnique.mockResolvedValue(null)
    mockedPrisma.user.create.mockResolvedValue({
      id: "user-1",
      name: "Matias",
      email: "matias@example.com",
      password: "hashed",
    })

    const result = await registerUser({ name: "Matias", email: "matias@example.com", password: "supersecret1" })

    expect(result.token).toBeDefined()
    expect(result.user.email).toBe("matias@example.com")
  })

  it("rejects registration when the email is already in use", async () => {
    mockedPrisma.user.findUnique.mockResolvedValue({ id: "user-1" })

    await expect(
      registerUser({ name: "Matias", email: "matias@example.com", password: "supersecret1" }),
    ).rejects.toThrow("Email already registered")
  })

  it("logs in with correct credentials", async () => {
    const hashed = await hashPassword("supersecret1")
    mockedPrisma.user.findUnique.mockResolvedValue({
      id: "user-1",
      name: "Matias",
      email: "matias@example.com",
      password: hashed,
    })

    const result = await loginUser({ email: "matias@example.com", password: "supersecret1" })

    expect(result.token).toBeDefined()
  })

  it("rejects login with incorrect password", async () => {
    const hashed = await hashPassword("supersecret1")
    mockedPrisma.user.findUnique.mockResolvedValue({
      id: "user-1",
      name: "Matias",
      email: "matias@example.com",
      password: hashed,
    })

    await expect(loginUser({ email: "matias@example.com", password: "wrong" })).rejects.toThrow("Invalid credentials")
  })
})
