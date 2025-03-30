"use client";

import CourtCard from "@/components/quadra";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useQuadrasData } from "@/hooks/use-quadra";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Quadra() {
  const { courts, loading } = useQuadrasData();
  const router = useRouter();

  const handleClick = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Você precisa estar logado para acessar essa página", {
        duration: 6000,
      });
    }
    router.push("dashboard");
  };

  return (
    <main className="relative flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-300 via-sky-500 to-cyan-200 opacity-20 -z-10" />
      <div className="w-full max-w-5xl space-y-10">
        <section className="space-y-6 text-center">
          <h1 className="text-4xl font-bold text-foreground">
            Agende sua quadra com facilidade!
          </h1>
          <p className="text-muted-foreground text-base max-w-2xl mx-auto">
            Conheça nossa plataforma de agendamento e facilite o acesso às
            quadras esportivas da sua cidade.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <div className="flex-1">
              <Image
                src="/quadra.png"
                width={600}
                height={400}
                alt="Quadra esportiva"
                className=" object-cover w-full h-auto"
                priority
              />
            </div>
            <Card className="p-6 flex-1 max-w-md text-center bg-primary/95 shadow-lg">
              <p className="text-primary-foreground text-base">
                Esse é o novo jeito de realizar agendamentos para o uso das
                quadras esportivas. Prático, rápido e fácil!
              </p>
            </Card>
          </div>
        </section>

        <Separator className="my-4 border-primary" />

        <section className="space-y-6 text-center">
          <h2 className="text-2xl font-semibold text-foreground">
            Pronto para jogar?
          </h2>
          <p className="text-muted-foreground">
            Confira as quadras disponíveis e reserve agora mesmo!
          </p>

          <div className="flex flex-wrap justify-center gap-6 mt-6">
            {loading ? (
              <p className="text-muted-foreground">Carregando quadras...</p>
            ) : !courts || courts.length === 0 ? (
              <p className="text-muted-foreground">
                Nenhuma quadra disponível no momento.
              </p>
            ) : (
              courts.map((court) => (
                <CourtCard
                  key={court.id}
                  court={court}
                  onReserveClick={() => handleClick()}
                />
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
