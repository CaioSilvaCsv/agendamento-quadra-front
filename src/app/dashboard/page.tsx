"use client"
import { AuthGuard } from "@/components/auth-guard"
import { useUserData } from "@/hooks/use-user-data"

export default function DashboardPage() {
  const { user, loading } = useUserData()
  if (loading) {
    return <div>Carregando usuario...</div>
  }
  return (
    <AuthGuard>
      <main className="p-6">
        <h1 className="text-2xl font-bold">Bem-vindo ao Dashboard</h1>
        <h1>Olá, {user?.name}!</h1>
        <p>Seu email é: {user?.email}</p>
        <p>Seu papel é: {user?.role}</p>
      </main>
    </AuthGuard>
  )
}
