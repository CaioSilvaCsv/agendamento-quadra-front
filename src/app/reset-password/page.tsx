import { Suspense } from "react";
import { ResetPasswordWrapper } from "@/components/ResetPasswordWrapper";
import { Metadata } from "next";

// Metadata para a página de resetar senha
export const metadata: Metadata = {
  title: "Redefinir Senha",
};

/**
 * @returns Pagina responsável pelo ResetPasswordPage
 * **/
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <ResetPasswordWrapper />
    </Suspense>
  );
}
