"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUserData } from "@/hooks/use-user-data"

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter()
  const {user , loading} = useUserData()
  const isAuthenticated = !!user

  useEffect(() => {
    const token = localStorage.getItem("token")

    if (!loading && !isAuthenticated && token) {
      router.push("/login")
    }
  }, [loading, isAuthenticated, router])

  if (loading) {
    return <div className="p-6 text-muted-foreground">Carregando...</div>
  }

  if (!isAuthenticated){
    return null
  }

  return <>{children}</>
}
