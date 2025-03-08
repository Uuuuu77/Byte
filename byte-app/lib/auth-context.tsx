"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Define user type
export interface User {
  id: string
  name: string
  email: string
}

// Define auth context type
interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
}

// Create auth context
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  signup: async () => {},
  logout: () => {},
})

// Auth provider props
interface AuthProviderProps {
  children: ReactNode
}

// Create auth provider
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Check for saved user on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("byte_user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  // Login function
  const login = async (email: string, password: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // In a real app, you would validate credentials against a backend
    // For demo purposes, we'll just check if the user exists in localStorage
    const users = JSON.parse(localStorage.getItem("byte_users") || "[]")
    const foundUser = users.find((u: any) => u.email === email && u.password === password)

    if (!foundUser) {
      throw new Error("Invalid email or password")
    }

    // Create user object (without password)
    const userObj = {
      id: foundUser.id,
      name: foundUser.name,
      email: foundUser.email,
    }

    // Save to state and localStorage
    setUser(userObj)
    localStorage.setItem("byte_user", JSON.stringify(userObj))
  }

  // Signup function
  const signup = async (name: string, email: string, password: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // In a real app, you would create a user in your backend
    // For demo purposes, we'll just store in localStorage
    const users = JSON.parse(localStorage.getItem("byte_users") || "[]")

    // Check if user already exists
    if (users.some((u: any) => u.email === email)) {
      throw new Error("User with this email already exists")
    }

    // Create new user
    const newUser = {
      id: `user_${Date.now()}`,
      name,
      email,
      password, // In a real app, you would NEVER store passwords in plain text
    }

    // Add to users array
    users.push(newUser)
    localStorage.setItem("byte_users", JSON.stringify(users))

    // Create user object (without password)
    const userObj = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
    }

    // Save to state and localStorage
    setUser(userObj)
    localStorage.setItem("byte_user", JSON.stringify(userObj))
  }

  // Logout function
  const logout = () => {
    setUser(null)
    localStorage.removeItem("byte_user")
  }

  return <AuthContext.Provider value={{ user, loading, login, signup, logout }}>{children}</AuthContext.Provider>
}

// Auth hook
export function useAuth() {
  return useContext(AuthContext)
}

