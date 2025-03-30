import { Suspense } from "react";
import { ResetPasswordWrapper } from "@/components/ResetPasswordWrapper";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <ResetPasswordWrapper />
    </Suspense>
  );
}
