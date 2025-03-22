"use client";

import { useUserData } from "@/hooks/use-user-data";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { AuthGuard } from "@/components/auth-guard";
import { UserBookings } from "@/components/dashboard/user-bookings";

export default function DashboardPage() {
  const { user, loading } = useUserData();
  const router = useRouter();

  if (loading) {
    return (
      <p className="p-6 text-muted-foreground">Carregando informações...</p>
    );
  }

  if (!user) {
    return (
      <p className="p-6 text-red-500">Não foi possível carregar seus dados.</p>
    );
  }

  return (
    <AuthGuard>
      <main className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">Bem-vindo ao Dashboard</h1>

        <div className="space-y-1">
          <p>
            Olá, <strong>{user.name}</strong>!
          </p>
          <p>Seu email é: {user.email}</p>
          <p>
            Papel: <span className="uppercase">{user.role}</span>
          </p>
        </div>

        {user.role === "USER" && (
          <div className="space-y-4">
            <Button onClick={() => router.push("/reservar")}>
              Fazer nova reserva
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/minhas-reservas")}
            >
              Ver minhas reservas
            </Button>
            <UserBookings />
          </div>
        )}

        {user.role === "ADMIN" && (
          <div className="space-y-4">
            <Button onClick={() => router.push("/admin/reservas")}>
              Reservas pendentes
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/admin/bloqueios")}
            >
              Gerenciar bloqueios
            </Button>
          </div>
        )}
      </main>
    </AuthGuard>
  );
}
