"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import api from "@/services/api";
import { useRouter } from "next/navigation";
import { z } from "zod";

interface ResetPasswordFormProps {
  token: string;
}

// 🎯 Esquema de validação
const schema = z.object({
  newPassword: z
    .string()
    .min(6, "A senha deve ter no mínimo 6 caracteres"),
});

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = schema.safeParse({ newPassword });

    if (!result.success) {
      const firstError = result.error.errors[0];
      toast.error(firstError.message);
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post("/auth/reset-password", {
        token,
        newPassword,
      });
      toast.success(data.message, { duration: 4000 });
      router.push("/login");
    } catch (error: any) {
      toast.error(
        error.response?.data?.error || "Erro ao redefinir a senha",
        { duration: 6000 }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <div className="grid gap-2">
        <Label htmlFor="newPassword">Nova Senha</Label>
        <Input
          className="w-full -mt-1"
          id="newPassword"
          type="password"
          placeholder="Digite sua nova senha"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
      </div>
      <Button
        type="submit"
        disabled={loading}
        className="w-full items-center mt-2"
      >
        {loading ? "Processando..." : "Redefinir Senha"}
      </Button>
    </form>
  );
}
