"use client"

import { useEffect, useState } from "react"
import api from "@/services/api"

interface User {
  id: number
  name: string
  email: string
  role: "USER" | "ADMIN"
}

export function useUserData() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await api.get<User>("/users/me")
        setUser(data)
      } catch (err) {
        console.error("Erro ao buscar usuário:", err)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [])

  return { user, loading }
}
