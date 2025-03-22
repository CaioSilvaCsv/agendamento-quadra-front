import { toast } from "sonner"
import axios from "axios"

export function useToastHandler() {
  const showError = (error: unknown, fallbackMessage = "Erro inesperado") => {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        fallbackMessage
      toast.error(message)
    } else if (error instanceof Error) {
      toast.error(error.message)
    } else {
      toast.error(fallbackMessage)
    }
  }

  const showSuccess = (message: string) => toast.success(message)

  return { showError, showSuccess }
}
