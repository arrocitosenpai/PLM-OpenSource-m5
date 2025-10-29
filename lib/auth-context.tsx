"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export type UserRole = "Product Manager" | "Admin" | "Engineer" | "Platform" | "Implementation"

interface User {
  email: string
  role: UserRole
  name: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, role: UserRole) => void
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check for stored auth on mount
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
      setIsAuthenticated(true)
    }
  }, [])

  const login = (email: string, role: UserRole) => {
    const newUser = {
      email,
      role,
      name: email.split("@")[0],
    }
    setUser(newUser)
    setIsAuthenticated(true)
    localStorage.setItem("user", JSON.stringify(newUser))
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem("user")
  }

  return <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function getRoleStageFilter(role: UserRole | null): string | null {
  if (!role || role === "Admin") return null // Admin sees everything

  switch (role) {
    case "Product Manager":
      return "product"
    case "Engineer":
      return "engineering"
    case "Platform":
      return "platform"
    case "Implementation":
      return "implementation"
    default:
      return null
  }
}
