"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface AuthContextData {
  token: string | null
  userId: number | null
  login: (token: string, userId: number) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null)
  const [userId, setUserId] = useState<number | null>(null)
  const router = useRouter()

  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    const storedUserId = localStorage.getItem("userId")

    if (storedToken && storedUserId) {
      setToken(storedToken)
      setUserId(Number(storedUserId))
    }
  }, [])

  const login = (token: string, userId: number) => {
    localStorage.setItem("token", token)
    localStorage.setItem("userId", String(userId))
    setToken(token)
    setUserId(userId)
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("userId")
    setToken(null)
    setUserId(null)
    router.push("/login")
  }

  return (
    <AuthContext.Provider value={{ token, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
