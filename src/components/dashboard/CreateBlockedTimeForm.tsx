"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import api from "@/services/api";
import axios from "axios";

interface Court {
  id: number;
  name: string;
}

export function CreateBlockedTimeForm() {
  const [courts, setCourts] = useState<Court[]>([]);
  const [courtId, setCourtId] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [date, setDate] = useState("");
  const [recurringDay, setRecurringDay] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let body;
      if (isRecurring) {
        // Bloqueio recorrente: utiliza o dia da semana. 
        body = {
          courtId: Number(courtId),
          date: null,
          recurringDay: Number(recurringDay),
          startTime: startTime || null,
          endTime: endTime || null,
          reason,
        };
      } else {
        // Bloqueio para data específica:
        // Se não forem informados horários (bloqueio de dia inteiro), envia somente a data.
        // Caso contrário, adiciona o offset "-03:00".
        const finalDate =
          !startTime && !endTime
            ? date
            : date.includes("T")
            ? date
            : `${date}T00:00:00-03:00`;
        body = {
          courtId: Number(courtId),
          date: finalDate,
          recurringDay: null,
          startTime: startTime || null,
          endTime: endTime || null,
          reason,
        };
      }

      await api.post(`/courts/${courtId}/blocked-times`, body);
      toast.success("Bloqueio criado com sucesso!");
      setCourtId("");
      setDate("");
      setRecurringDay("");
      setStartTime("");
      setEndTime("");
      setReason("");
      setIsRecurring(false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.error || "Erro ao criar bloqueio";
        toast.error(message);
      } else {
        toast.error("Erro ao criar bloqueio");
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Atualizado: 0 representa Segunda-feira, 1 é Terça, ... e 6 é Domingo.
  const daysOfWeek = [
    { value: "0", label: "Segunda-feira" },
    { value: "1", label: "Terça-feira" },
    { value: "2", label: "Quarta-feira" },
    { value: "3", label: "Quinta-feira" },
    { value: "4", label: "Sexta-feira" },
    { value: "5", label: "Sábado" },
    { value: "6", label: "Domingo" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold">Criar Bloqueio</h2>

      <div className="grid gap-2">
        <Label>Quadra</Label>
        <Select value={courtId} onValueChange={setCourtId}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione a quadra" />
          </SelectTrigger>
          <SelectContent>
            {courts.map((court) => (
              <SelectItem key={court.id} value={String(court.id)}>
                {court.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <Input
          type="checkbox"
          id="isRecurring"
          checked={isRecurring}
          onChange={(e) => setIsRecurring(e.target.checked)}
        />
        <Label htmlFor="isRecurring">Bloqueio Recorrente</Label>
      </div>

      {isRecurring ? (
        <div className="grid gap-2">
          <Label>Dia da semana</Label>
          <Select value={recurringDay} onValueChange={setRecurringDay}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o dia da semana" />
            </SelectTrigger>
            <SelectContent>
              {daysOfWeek.map((day) => (
                <SelectItem key={day.value} value={day.value}>
                  {day.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : (
        <div className="grid gap-2">
          <Label htmlFor="date">Data</Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
      )}

      <div className="grid gap-2">
        <Label htmlFor="startTime">Horário de Início (opcional)</Label>
        <Input
          id="startTime"
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="endTime">Horário de Término (opcional)</Label>
        <Input
          id="endTime"
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="reason">Motivo</Label>
        <Input
          id="reason"
          type="text"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
        />
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Enviando..." : "Criar Bloqueio"}
      </Button>
    </form>
  );
}

export default CreateBlockedTimeForm;
