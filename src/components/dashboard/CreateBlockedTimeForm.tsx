"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import api from "@/services/api";
import axios from "axios";
import { Separator } from "../ui/separator";
import { Calendar, Clock, Repeat, Info, MapPin } from "lucide-react";

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

  // 0 representa Segunda-feira, 1 é Terça, ... e 6 é Domingo.
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
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-background p-4 rounded-md border border-border"
    >
      <div>
        <h2 className="text-xl font-semibold text-foreground">Criar Bloqueio</h2>
        <Separator className="my-4 border-border" />
      </div>

      <div className="grid gap-2">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-foreground" />
          <Label className="text-foreground">Quadra</Label>
        </div>
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

      <div className="flex items-center gap-2">
        <Input
          type="checkbox"
          id="isRecurring"
          checked={isRecurring}
          onChange={(e) => setIsRecurring(e.target.checked)}
          className="w-4 h-4"
        />
        <Label htmlFor="isRecurring" className="text-foreground flex items-center gap-1">
          <Repeat className="h-4 w-4 text-foreground" />
          Bloqueio Recorrente
        </Label>
      </div>

      {isRecurring ? (
        <div className="grid gap-2">
          <div className="flex items-center gap-2">
            <Repeat className="h-4 w-4 text-foreground" />
            <Label className="text-foreground">Dia da semana</Label>
          </div>
          <Select value={recurringDay} onValueChange={setRecurringDay}>
            <SelectTrigger className="bg-background border-border">
              <SelectValue placeholder="Selecione o dia da semana" />
            </SelectTrigger>
            <SelectContent className="bg-background border-border">
              {daysOfWeek.map((day) => (
                <SelectItem key={day.value} value={day.value} className="text-foreground">
                  {day.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : (
        <div className="grid gap-2">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-foreground" />
            <Label htmlFor="date" className="text-foreground">
              Data
            </Label>
          </div>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="bg-background border-border text-foreground max-w-md"
          />
        </div>
      )}

      <div className="grid gap-2">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-foreground" />
          <Label htmlFor="startTime" className="text-foreground">
            Horário de Início (opcional)
          </Label>
        </div>
        <Input
          id="startTime"
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="bg-background border-border text-foreground max-w-md"
        />
      </div>

      <div className="grid gap-2">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-foreground" />
          <Label htmlFor="endTime" className="text-foreground">
            Horário de Término (opcional)
          </Label>
        </div>
        <Input
          id="endTime"
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="bg-background border-border text-foreground max-w-md"
        />
      </div>

      <div className="grid gap-2">
        <div className="flex items-center gap-2">
          <Info className="h-4 w-4 text-foreground" />
          <Label htmlFor="reason" className="text-foreground">
            Motivo
          </Label>
        </div>
        <Input
          id="reason"
          type="text"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
          className="bg-background border-border text-foreground max-w-md"
        />
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Enviando..." : "Criar Bloqueio"}
      </Button>
    </form>
  );
}

export default CreateBlockedTimeForm;
