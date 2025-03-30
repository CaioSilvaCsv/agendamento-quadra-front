"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "../ui/separator";
import api from "@/services/api";
import { toast } from "sonner";
import { Calendar, Clock, Repeat, Trash, Info } from "lucide-react";

interface Court {
  id: number;
  name: string;
}

interface BlockedTime {
  id: number;
  courtId: number;
  date: string | null;
  recurringDay: number | null;
  startTime: string | null;
  endTime: string | null;
  reason: string;
}

/**
 * Componente 
 * @returns Componente BlockedTimesManager
 * @param {Object} props - Propriedades do componente
 * @param {Array} props.blockedTimes - Lista de horários bloqueados
 * @description Este componente gerencia os horários bloqueados.
 * 
 */

export function BlockedTimesManager() {
  const [courts, setCourts] = useState<Court[]>([]);
  const [courtId, setCourtId] = useState("");
  const [blockedTimes, setBlockedTimes] = useState<BlockedTime[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [blockToDelete, setBlockToDelete] = useState<BlockedTime | null>(null);

  useEffect(() => {
    const fetchCourts = async () => {
      try {
        const { data } = await api.get("/courts");
        setCourts(data);
      } catch (error) {
        toast.error("Erro ao carregar quadras");
      }
    };
    fetchCourts();
  }, []);

  useEffect(() => {
    const fetchBlockedTimes = async () => {
      if (!courtId) return;
      try {
        const { data } = await api.get(`/courts/${courtId}/blocked-times`);
        setBlockedTimes(data);
      } catch (error) {
        toast.error("Erro ao carregar bloqueios");
      }
    };
    fetchBlockedTimes();
  }, [courtId]);

  const openDeleteModal = (block: BlockedTime) => {
    setBlockToDelete(block);
    setShowModal(true);
  };

  const handleDeleteConfirmed = async () => {
    if (!blockToDelete) return;
    try {
      await api.delete(`/blocked-times/${blockToDelete.id}`);
      toast.success("Bloqueio removido com sucesso!");
      setBlockedTimes((prev) => prev.filter((b) => b.id !== blockToDelete.id));
    } catch (error) {
      toast.error("Erro ao remover bloqueio");
      console.error(error);
    } finally {
      setShowModal(false);
      setBlockToDelete(null);
    }
  };

  const formatRecurringDay = (day: number) => {
    switch (day) {
      case 0:
        return "Segunda-feira";
      case 1:
        return "Terça-feira";
      case 2:
        return "Quarta-feira";
      case 3:
        return "Quinta-feira";
      case 4:
        return "Sexta-feira";
      case 5:
        return "Sábado";
      default:
        return "Domingo";
    }
  };

  return (
    <div className="space-y-4 bg-background p-4 rounded-md border border-border">
      <div className="">
        <h2 className="text-xl font-semibold text-foreground">
          Gerenciar Bloqueios
        </h2>
        <Separator className="my-4 border-border" />
      </div>
      <div className="grid gap-2">
        <Label className="text-foreground">Quadra</Label>
        <Select value={courtId} onValueChange={setCourtId}>
          <SelectTrigger className="bg-background border-border">
            <SelectValue placeholder="Selecione a quadra" />
          </SelectTrigger>
          <SelectContent className="bg-background border-border">
            {courts.map((court) => (
              <SelectItem
                key={court.id}
                value={String(court.id)}
                className="text-foreground"
              >
                {court.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {courtId && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">
            Bloqueios da Quadra
          </h3>
          {blockedTimes.length === 0 ? (
            <p className="text-muted-foreground">
              Nenhum bloqueio encontrado para esta quadra.
            </p>
          ) : (
            blockedTimes.map((b) => (
              <Card
                key={b.id}
                className="border relative border-border bg-background hover:bg-muted transition-colors"
              >
                <CardContent className="space-y-2">
                  <Calendar className="mr-2 h-5 w-5 mx-auto text-foreground absolute top-4 right-4" />

                  <p className="text-foreground flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span className="font-semibold">Data:</span>{" "}
                    {b.date
                      ? new Date(b.date).toLocaleDateString()
                      : "Bloqueio recorrente"}
                  </p>
                  {b.recurringDay !== null && (
                    <p className="text-foreground flex items-center">
                      <Repeat className="mr-2 h-4 w-4" />
                      <span className="font-semibold">Dia da semana:</span>{" "}
                      {formatRecurringDay(b.recurringDay)}
                    </p>
                  )}
                  {b.startTime && b.endTime && (
                    <p className="text-foreground flex items-center">
                      <Clock className="mr-2 h-4 w-4" />
                      <span className="font-semibold">Horário:</span>{" "}
                      {b.startTime} - {b.endTime}
                    </p>
                  )}
                  <p className="text-foreground flex items-center">
                    <Info className="mr-2 h-4 w-4" />
                    <span className="font-semibold">Motivo:</span> {b.reason}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button
                    onClick={() => openDeleteModal(b)}
                    variant="destructive"
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    Excluir
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      )}

      {showModal && (
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent className="bg-background text-foreground border-border">
            <DialogHeader>
              <DialogTitle>Confirmar Exclusão</DialogTitle>
            </DialogHeader>
            <p className="py-4">
              Tem certeza que deseja excluir este bloqueio?
            </p>
            <DialogFooter>
              <Button onClick={() => setShowModal(false)}>Cancelar</Button>
              <Button onClick={handleDeleteConfirmed} variant="destructive">
                <Trash className="mr-2 h-4 w-4" />
                Excluir
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export default BlockedTimesManager;
