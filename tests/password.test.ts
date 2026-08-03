import { hashPassword, comparePassword } from "../src/utils/password"

describe("password utils", () => {
  it("hashes and verifies a password correctly", async () => {
    const hashed = await hashPassword("supersecret123")
    const match = await comparePassword("supersecret123", hashed)
    expect(match).toBe(true)
  })

  it("rejects an incorrect password", async () => {
    const hashed = await hashPassword("supersecret123")
    const match = await comparePassword("wrongpassword", hashed)
    expect(match).toBe(false)
  })
})
