"use client";
import { LoginForm } from "@/components/login-form";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth";
import api from "@/services/api";
import { useToastHandler } from "@/hooks/use-toast-handler";

export default function PaginaDeLogin() {
  const router = useRouter();
  const { login } = useAuth();
  const { showError, showSuccess } = useToastHandler();

  const handleLogin = async (email: string, password: string) => {
    try {
      const { data } = await api.post("/auth/login", { email, password });
      login(data.token, data.userId);
      showSuccess("Login realizado com sucesso!");
      router.push("/dashboard");
    } catch (err) {
      showError(err, "Credenciais inválidas");
    }
  };

  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-300 via-sky-500 to-cyan-200 opacity-20 -z-10" />
      <div className="w-full max-w-sm md:max-w-3xl">
        <header className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-foreground">QuadraFácil</h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Agende sua quadra com facilidade!
          </p>
        </header>
        <LoginForm onSubmit={handleLogin} />
      </div>
    </div>
  );
}
