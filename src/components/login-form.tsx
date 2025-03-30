"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { ForgotPasswordForm } from "./ForgotPasswordForm";

type LoginFormProps = {
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
} & Omit<React.HTMLAttributes<HTMLDivElement>, "onSubmit">;

export function LoginForm({ onSubmit, className, ...props }: LoginFormProps) {
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={onSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Bem-vindo de volta</h1>
                <p className="text-balance text-muted-foreground">
                  Faça login na sua conta QuadraFácil
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seuemail@exemplo.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Senha</Label>
                  <button
                    type="button"
                    onClick={() => setIsForgotPasswordOpen(true)}
                    className="ml-auto text-sm underline underline-offset-2 hover:underline"
                  >
                    Esqueceu sua senha?
                  </button>
                </div>
                <Input id="password" type="password" required />
              </div>
              <Button type="submit" className="w-full">
                Entrar
              </Button>
              <div className="text-center text-sm">
                Ainda não tem uma conta?{" "}
                <Link href="/signup" className="underline underline-offset-4">
                  Cadastre-se
                </Link>
              </div>
            </div>
          </form>
          <div className="relative hidden md:block mr-6">
            <img
              src="/image-base.png"
              alt="Imagem ilustrativa"
              className="absolute inset-0 h-full w-full rounded-2xl object-cover"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        Ao clicar em continuar, você concorda com nossos{" "}
        <a href="#">Termos de Serviço</a> e{" "}
        <a href="#">Política de Privacidade</a>.
      </div>

      {/* Modal para recuperação de senha */}
      <Dialog open={isForgotPasswordOpen} onOpenChange={setIsForgotPasswordOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Recuperar senha</DialogTitle>
            <DialogDescription>
              Insira seu e-mail para receber um link de redefinição de senha.
            </DialogDescription>
          </DialogHeader>
          <ForgotPasswordForm onSuccess={() => setIsForgotPasswordOpen(false)} />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Fechar</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
