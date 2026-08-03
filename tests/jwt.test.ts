import { signToken, verifyToken } from "../src/utils/jwt"

describe("jwt utils", () => {
  it("signs and verifies a token round trip", () => {
    const token = signToken({ userId: "user-1", email: "user@example.com" })
    const payload = verifyToken(token)
    expect(payload.userId).toBe("user-1")
    expect(payload.email).toBe("user@example.com")
  })

  it("throws on an invalid token", () => {
    expect(() => verifyToken("invalid.token.value")).toThrow()
  })
})
