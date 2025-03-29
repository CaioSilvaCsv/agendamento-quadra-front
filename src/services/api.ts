import axios from "axios";
import { toast } from "sonner";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Interceptor para tratar respostas com erro 401 (não autorizado)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Se a resposta tiver status 401, tenta atualizar o token
    if (error.response?.status === 401) {
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          throw new Error("Refresh token inexistente");
        }
        // Tenta atualizar o token
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
          { refreshToken }
        );
        const newToken = response.data.token;
        localStorage.setItem("token", newToken);

        error.config.headers.Authorization = `Bearer ${newToken}`;
        return axios.request(error.config);
      } catch (refreshError) {
        // Se a atualização falhar, desloga o usuário
        toast.error("Sessão expirada. Faça login novamente.");
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        // Redireciona para a página de login
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
