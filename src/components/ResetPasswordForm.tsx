"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "../ui/separator";
import { toast } from "sonner";
import api from "@/services/api";
import axios from "axios";
import { useRouter } from "next/navigation";

interface ResetPasswordFormProps {
  token: string;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/auth/reset-password", { token, newPassword });
      toast.success(data.message, { duration: 4000 });
      // Redireciona para a página de login após sucesso
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
          id="newPassword"
          type="password"
          placeholder="Digite sua nova senha"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? "Processando..." : "Redefinir Senha"}
      </Button>
    </form>
  );
}
