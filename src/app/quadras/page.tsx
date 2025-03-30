"use client";

import CourtCard from "@/components/quadra";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useQuadrasData } from "@/hooks/use-quadra";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

/**
 * @returns pagina de Quadra
 * @description Componente que renderiza a página de quadras, e lista todas as quadras disponíveis para agendamento.
 * Não é necessário está logado para acessar essa pagina.
**/
export default function Quadra() {

    const { courts, loading } = useQuadrasData();

    const router = useRouter();
    const handleClick = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error("Você precisa estar logado para acessar essa página", { duration: 6000 })
        }
        router.push('dashboard');
    };

    return (
        <main className="p-6 space-y-8 ">
            <section className="space-y-4">
                <h1 className="text-4xl font-bold">
                    Conheça nosso agendamento de quadra!
                </h1>
                <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-center justify-center ">
                    <div className="w-full md:w-1/2 flex-shrink-0">
                        <Image
                        src='/quadra.png'
                        width={768}
                        height={500}
                        alt="Imagem de um campo"
                        className="object-cover shadow-md w-full h-auto md:w-1/2 md:max-h-80"
                        priority/>
                    </div>
                    <Card className="flex items-center justify-center p-6 md:w-1/2 lg:w-3/5 max-w-2xs">
                        <p className="text-center text-base md:text-lg">
                            Esse é o novo jeito de ser feito o agendamento para o uso das quadras esportivas!
                        </p>
                    </Card>
                </div>
                <Separator className="my-6" />
            </section>
            <section className="space-y-4">
                <h1 className="text-2xl font-bold">Pronto para jogar?</h1>
                <p className="text-muted-foreground">Confira as quadras disponiveis e reserve agora!</p>
                
                <div className="min-h-52 flex flex-wrap p-4 items-center justify-center">
                    {loading ?(
                        <div className="flex flex-col items-center gap-2">
                            <p className="p-4 text-muted-foreground">Carregando quadras...</p>
                        </div>

                    ): !courts || courts.length === 0 ?(
                        <p className="p-4 text-muted-foreground">Não há quadras disponíveis no momento.</p>
                    ) : ( 
                        <div className="flex flex-wrap justify-center gap-6 md:gap-8 w-full">
                            {courts.map((court) => (
                                <CourtCard
                                key={court.id}
                                court={court}
                                onReserveClick={() =>handleClick()}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}