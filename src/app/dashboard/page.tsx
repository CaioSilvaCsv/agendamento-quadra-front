import { AuthGuard } from "@/components/auth-guard"

export default function DashboardPage() {
  return (
    <AuthGuard>
      <main className="p-6">
        <h1 className="text-2xl font-bold">Bem-vindo ao Dashboard</h1>
      </main>
    </AuthGuard>
  )
}
