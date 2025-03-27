"use client";

import { useUserData } from "@/hooks/use-user-data";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { AuthGuard } from "@/components/auth-guard";
import { UserBookings } from "@/components/dashboard/user-bookings";
import { CreateBookingForm } from "@/components/dashboard/create-bookings-form";
import { CreateBlockedTimeForm } from "@/components/dashboard/CreateBlockedTimeForm";

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
      <main className="p-6 space-y-10">
        <h1 className="text-2xl font-bold">Bem-vindo, {user.name}</h1>

        {user.role === "USER" && (
          <>
            <div
              className="grid grid-cols-2
        "
            >
              <CreateBookingForm />
              <UserBookings />
            </div>
          </>
        )}

        {user.role === "ADMIN" && (
          <>
            <p className="text-muted-foreground">
              Admin Dashboard (em breve...)
            </p>
            <CreateBlockedTimeForm />
            <CreateBookingForm />
          </>
        )}
      </main>
    </AuthGuard>
  );
}
