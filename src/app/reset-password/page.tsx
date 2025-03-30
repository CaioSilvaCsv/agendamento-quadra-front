"use client";
import { useSearchParams } from "next/navigation";
import { ResetPasswordForm } from "@/components/ResetPasswordForm";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  return (
    <div className="flex justify-center items-center min-h-screen max-w-md mx-auto p-4">
      <div>
        <h1 className="text-4xl font-bold mb-4">Redefinir Senha</h1>
        {token ? (
          <ResetPasswordForm token={token} />
        ) : (
          <p>Token inválido ou ausente.</p>
        )}
      </div>
    </div>
  );
}
