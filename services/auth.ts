import type { LoginPayload, LoginResult } from "@/types/auth"

// Toggle between mock and real service
const USE_AUTH_MOCK = true

// Mock Authentication Service
class MockAuthService {
  async login(payload: LoginPayload): Promise<LoginResult> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Demo credentials: admin@demo.com / demo123
    if (
      (payload.usernameOrEmail === "admin@demo.com" || payload.usernameOrEmail === "admin") &&
      payload.password === "demo123"
    ) {
      return {
        user: {
          id: "1",
          name: "Admin User",
          email: "admin@demo.com",
          role: "admin",
        },
        accessToken: "mock-jwt-token-" + Date.now(),
        expiresIn: 3600, // 1 hour in seconds
      }
    }

    // Invalid credentials
    throw new Error("Credenciales incorrectas")
  }

  async logout(): Promise<void> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300))
    // In mock, just resolve
    return Promise.resolve()
  }
}

// Real Authentication Service (for future ORDS/APEX integration)
class RealAuthService {
  private baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || ""

  async login(payload: LoginPayload): Promise<LoginResult> {
    /**
     * TODO: Connect to Oracle APEX/ORDS endpoint
     *
     * Example:
     * const response = await fetch(`${this.baseUrl}/ords/<schema>/auth/login`, {
     *   method: 'POST',
     *   headers: { 'Content-Type': 'application/json' },
     *   credentials: 'include', // Important for httpOnly cookies
     *   body: JSON.stringify({
     *     username: payload.usernameOrEmail,
     *     password: payload.password
     *   })
     * })
     *
     * The backend should:
     * 1. Validate credentials
     * 2. Set httpOnly cookie with session token (recommended for production)
     * 3. Return user data and token info
     *
     * Security note: In production, prefer httpOnly cookies over localStorage
     * to prevent XSS attacks. The token should never be accessible to JavaScript.
     */

    const response = await fetch(`${this.baseUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Error de autenticación" }))
      throw new Error(error.message || "Credenciales incorrectas")
    }

    return response.json()
  }

  async logout(): Promise<void> {
    /**
     * TODO: Connect to Oracle APEX/ORDS endpoint
     *
     * Example:
     * await fetch(`${this.baseUrl}/ords/<schema>/auth/logout`, {
     *   method: 'POST',
     *   credentials: 'include'
     * })
     */

    await fetch(`${this.baseUrl}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    })
  }
}

// Export the active service based on the toggle
export const authService = USE_AUTH_MOCK ? new MockAuthService() : new RealAuthService()
