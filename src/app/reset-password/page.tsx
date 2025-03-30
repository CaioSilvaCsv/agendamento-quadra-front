import { Suspense } from "react";
import { ResetPasswordWrapper } from "@/components/ResetPasswordWrapper";

export default function ResetPasswordPage() {
  return (
<<<<<<< HEAD
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
=======
    <Suspense fallback={<div>Carregando...</div>}>
      <ResetPasswordWrapper />
    </Suspense>
>>>>>>> 24cf77fd17cf02111efa0e8ccd96ef547993298e
  );
}
