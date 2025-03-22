"use client"

import { useRouter } from "next/navigation"
import { SignupForm } from "@/components/signup-form"
import api from "@/services/api"
import { useToastHandler } from "@/hooks/use-toast-handler"
import { toast } from "sonner"

export default function SignupPage() {
  const router = useRouter()
  const { showError, showSuccess } = useToastHandler()
  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const name = (form.querySelector("#name") as HTMLInputElement).value
    const email = (form.querySelector("#email") as HTMLInputElement).value
    const password = (form.querySelector("#password") as HTMLInputElement).value
    
    try {
      await api.post("/users", { name, email, password })
      showSuccess("Cadastro realizado com sucesso!")
      router.push("/login")
    } catch (err) {
      showError(err, "Erro ao cadastrar")
    }
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <SignupForm onSubmit={handleSignup} />
      </div>
    </div>
  )
}
