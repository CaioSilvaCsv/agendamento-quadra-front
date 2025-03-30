"use client";

import { useSearchParams } from "next/navigation";
import { ResetPasswordForm } from "@/components/ResetPasswordForm";

export function ResetPasswordWrapper() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Redefinir Senha</h1>
      {token ? (
        <ResetPasswordForm token={token} />
      ) : (
        <p>Token inválido ou ausente.</p>
      )}
    </div>
  );
}
