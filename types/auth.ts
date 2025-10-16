export interface User {
  id: string
  name: string
  email: string
  role?: "admin" | "viewer"
}

export interface AuthState {
  user: User | null
  accessToken: string | null
  expiresAt?: number
}

export interface LoginPayload {
  usernameOrEmail: string
  password: string
  remember?: boolean
}

export interface LoginResult {
  user: User
  accessToken: string
  expiresIn: number
}
