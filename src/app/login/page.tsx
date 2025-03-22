"use client";
import { LoginForm } from "@/components/login-form";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth";
import api from "@/services/api";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const email = (form.querySelector("#email") as HTMLInputElement).value;
    const password = (form.querySelector("#password") as HTMLInputElement)
      .value;

    try {
      const { data } = await api.post<{ token: string; userId: number }>(
        "/auth/login",
        {
          email,
          password,
        }
      );
      login(data.token, data.userId);
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Credenciais inválidas");
    }
  };
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginForm onSubmit={handleLogin} />
      </div>
    </div>
  );
}
