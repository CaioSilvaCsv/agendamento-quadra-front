"use client"

import { useRouter } from "next/navigation"
import { SignupForm } from "@/components/signup-form"
import api from "@/services/api"
import { useToastHandler } from "@/hooks/use-toast-handler"

export default function SignupPage() {
  const router = useRouter()
  const { showError, showSuccess } = useToastHandler()

  const handleSignup = async (data: { name: string; email: string; password: string }) => {
    try {
      await api.post("/users", data)
      showSuccess("Cadastro realizado com sucesso!")
      router.push("/login")
    } catch (err) {
      showError(err, "Erro ao cadastrar")
    }
  }

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
        <SignupForm onSubmit={handleSignup} />
      </div>
    </div>
  )
}