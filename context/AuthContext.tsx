"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import type { AuthState, LoginPayload } from "@/types/auth"
import { authService } from "@/services/auth"

interface AuthContextType {
  auth: AuthState
  login: (payload: LoginPayload) => Promise<void>
  logout: () => Promise<void>
  isAuthenticated: boolean
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const AUTH_STORAGE_KEY = "mental-health-auth"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    accessToken: null,
    expiresAt: undefined,
  })
  const [isLoading, setIsLoading] = useState(true)

  // Load auth state from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY)
    if (stored) {
      try {
        const parsed: AuthState = JSON.parse(stored)
        // Check if token is expired
        if (parsed.expiresAt && parsed.expiresAt > Date.now()) {
          setAuth(parsed)
        } else {
          // Token expired, clear storage
          localStorage.removeItem(AUTH_STORAGE_KEY)
        }
      } catch (error) {
        console.error("[v0] Error parsing auth state:", error)
        localStorage.removeItem(AUTH_STORAGE_KEY)
      }
    }
    setIsLoading(false)
  }, [])

  // Check for token expiration periodically
  useEffect(() => {
    if (!auth.expiresAt) return

    const checkExpiration = () => {
      if (auth.expiresAt && auth.expiresAt <= Date.now()) {
        logout()
      }
    }

    const interval = setInterval(checkExpiration, 60000) // Check every minute
    return () => clearInterval(interval)
  }, [auth.expiresAt])

  const login = useCallback(async (payload: LoginPayload) => {
    const result = await authService.login(payload)

    const expiresAt = Date.now() + result.expiresIn * 1000
    const newAuth: AuthState = {
      user: result.user,
      accessToken: result.accessToken,
      expiresAt,
    }

    setAuth(newAuth)

    // Persist to localStorage if "remember" is true
    if (payload.remember) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newAuth))
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await authService.logout()
    } catch (error) {
      console.error("[v0] Error during logout:", error)
    } finally {
      setAuth({
        user: null,
        accessToken: null,
        expiresAt: undefined,
      })
      localStorage.removeItem(AUTH_STORAGE_KEY)
    }
  }, [])

  const isAuthenticated = !!auth.user && !!auth.accessToken

  return (
    <AuthContext.Provider value={{ auth, login, logout, isAuthenticated, isLoading }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

/**
 * Custom hook for authenticated API requests
 *
 * Usage:
 * const authFetch = useAuthFetch()
 * const data = await authFetch('/api/admissions')
 *
 * This automatically adds the Authorization header with the Bearer token
 */
export function useAuthFetch() {
  const { auth } = useAuth()

  return useCallback(
    async (url: string, options: RequestInit = {}) => {
      const headers = new Headers(options.headers)

      if (auth.accessToken) {
        headers.set("Authorization", `Bearer ${auth.accessToken}`)
      }

      return fetch(url, {
        ...options,
        headers,
      })
    },
    [auth.accessToken],
  )
}
