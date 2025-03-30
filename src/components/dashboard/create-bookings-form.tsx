"use client";

import { useEffect, useMemo, useState } from "react";
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
import { format, addHours } from "date-fns";
import { parseISO } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { Separator } from "../ui/separator";
import { Calendar, Clock, MapPin } from "lucide-react";
import { useBookingUpdate } from "@/context/BookingUpdateContext";

interface Court {
  id: number;
  name: string;
  location: string;
  description?: string;
  openTime: string;
  closeTime: string;
}

interface BookingBlock {
  id?: number;
  courtId?: number;
  date: string | null;
  startTime: string;
  endTime: string;
  status?: string;
  recurringDay?: number;
  reason?: string;
}

interface TimeSlot {
  start: string;
  end: string;
  status: "available" | "reserved" | "blocked";
}

/**
 * @returns Componente CreateBookingForm
 * @description Formulário para criar uma nova reserva de quadra e verificar
 * pendências e bloqueios para limitar as reservas.
 */
export function CreateBookingForm() {
  const { triggerUpdate } = useBookingUpdate();
  const [courts, setCourts] = useState<Court[]>([]);
  const [courtId, setCourtId] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [courtBookings, setCourtBookings] = useState<BookingBlock[]>([]);
  const [blockedTimes, setBlockedTimes] = useState<BookingBlock[]>([]);

  const selectedCourt = courts.find((court) => String(court.id) === courtId);
  // Força a criação do objeto de data a partir do input adicionando "T00:00:00"
  const dateObj = date ? new Date(date + "T00:00:00") : null;

  // Filtra as reservas comparando apenas a parte da data (yyyy-MM-dd)
  const filteredBookings = useMemo(() => {
    return courtBookings.filter(
      (b) => date && b.date?.substring(0, 10) === date
    );
  }, [courtBookings, date]);

  // Filtra os bloqueios, considerando reservas específicas ou recorrentes
  const filteredBlocks = useMemo(() => {
    return blockedTimes.filter((b) => {
      const blockDate = b.date ? b.date.substring(0, 10) : null;
      const sameDay = blockDate === date;
      // Converte o dia da semana para iniciar em segunda (segunda = 0, terça = 1, etc.)
      const sameWeekday =
        b.recurringDay !== undefined &&
        date &&
        ((new Date(date + "T00:00:00").getDay() + 6) % 7) === b.recurringDay;
      return sameDay || sameWeekday;
    });
  }, [blockedTimes, date]);

  const generateTimeSlots = (): TimeSlot[] => {
    if (!selectedCourt || !dateObj) return [];

    const [openH, openM] = selectedCourt.openTime.split(":").map(Number);
    const [closeH, closeM] = selectedCourt.closeTime.split(":").map(Number);

    // Define os horários de abertura e fechamento considerando a data escolhida
    const start = new Date(dateObj);
    start.setHours(openH, openM, 0, 0);
    const end = new Date(dateObj);
    end.setHours(closeH, closeM, 0, 0);

    const slots: TimeSlot[] = [];
    let current = new Date(start);

    while (current < end) {
      const slotStart = new Date(current);
      const slotEnd = addHours(slotStart, 1);

      // Verifica se há bloqueio: compara o slot com o horário bloqueado
      const isBlocked = filteredBlocks.some((b) => {
        if (!b.startTime || !b.endTime) return true;
        const blockDate = b.date ? b.date.split("T")[0] : date;
        const blockStart = new Date(`${blockDate}T${b.startTime}`);
        const blockEnd = new Date(`${blockDate}T${b.endTime}`);
        return slotStart >= blockStart && slotStart < blockEnd;
      });

      // Verifica se há reserva (apenas PENDING ou APPROVED)
      const isReserved = filteredBookings.some((b) => {
        if (b.status !== "PENDING" && b.status !== "APPROVED") return false;
        return (
          slotStart < new Date(`${date}T${b.endTime}`) &&
          slotEnd > new Date(`${date}T${b.startTime}`)
        );
      });

      const slotStatus: TimeSlot["status"] = isReserved
        ? "reserved"
        : isBlocked
        ? "blocked"
        : "available";

      slots.push({
        start: format(slotStart, "HH:mm"),
        end: format(slotEnd, "HH:mm"),
        status: slotStatus,
      });

      current = slotEnd;
    }

    console.log("⏳ Gerando slots:", slots);
    return slots;
  };

  const slots = useMemo(generateTimeSlots, [
    selectedCourt,
    dateObj,
    filteredBookings,
    filteredBlocks,
  ]);

  useEffect(() => {
    const fetchCourts = async () => {
      try {
        const { data } = await api.get("/courts");
        setCourts(data);
      } catch (err) {
        toast.error("Erro ao carregar quadras", {
          duration: 6000,
          style: { backgroundColor: "#ffe4e6", color: "#991b1b" },
        });
      }
    };
    fetchCourts();
  }, []);

  useEffect(() => {
    const fetchCourtDetails = async () => {
      if (!courtId) return;
      try {
        const [bookingsRes, blocksRes] = await Promise.all([
          api.get(`/courts/${courtId}/bookings`),
          api.get(`/courts/${courtId}/blocked-times`),
        ]);
        setCourtBookings(bookingsRes.data);
        setBlockedTimes(blocksRes.data);
        console.log("📅 Bookings:", bookingsRes.data);
        console.log("⛔ Blocked:", blocksRes.data);
      } catch (err) {
        toast.error("Erro ao buscar reservas ou bloqueios da quadra");
        console.error(err);
      }
    };
    fetchCourtDetails();
  }, [courtId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const [year, month, day] = date.split("-");
      const [startH, startM] = startTime.split(":").map(Number);
      const [endH, endM] = endTime.split(":").map(Number);

      // Cria as datas usando os valores do input sem conversão indesejada
      const startDate = new Date(Number(year), Number(month) - 1, Number(day), startH, startM);
      const endDate = new Date(Number(year), Number(month) - 1, Number(day), endH, endM);

      if (startDate >= endDate) {
        toast.error("O horário de término deve ser depois do horário de início");
        setLoading(false);
        return;
      }

      await api.post("/bookings", {
        courtId: Number(courtId),
        date, // Envia a data exatamente como selecionada (ex: "2025-03-31")
        startTime: format(startDate, "HH:mm"),
        endTime: format(endDate, "HH:mm"),
      });

      toast.success("Reserva criada com sucesso!", { duration: 4000 });
      triggerUpdate();
      setCourtId("");
      setDate("");
      setStartTime("");
      setEndTime("");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const message = err.response?.data?.error || "Erro ao criar reserva";
        toast.error(message, {
          duration: 6000,
          style: { backgroundColor: "#ffe4e6", color: "#991b1b" },
        });
      } else {
        toast.error("Erro ao criar reserva", {
          duration: 6000,
          style: { backgroundColor: "#ffe4e6", color: "#991b1b" },
        });
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-background p-4 rounded-md border border-border">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Nova Reserva</h2>
        <Separator className="my-4 border-border" />
      </div>

      <div className="grid gap-2">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-foreground" />
          <Label>Quadra</Label>
        </div>
        <Select value={courtId} onValueChange={setCourtId}>
          <SelectTrigger className="bg-background border-border">
            <SelectValue placeholder="Selecione a quadra" />
          </SelectTrigger>
          <SelectContent className="bg-background border-border">
            {courts.map((court) => (
              <SelectItem key={court.id} value={String(court.id)} className="text-foreground">
                {court.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedCourt && (
        <div className="bg-muted p-3 rounded-md text-sm text-muted-foreground">
          <p className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span className="font-semibold">Local:</span> {selectedCourt.location}
          </p>
          <p className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span className="font-semibold">Horário:</span> {selectedCourt.openTime} - {selectedCourt.closeTime}
          </p>
          {selectedCourt.description && (
            <p className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="font-semibold">Descrição:</span> {selectedCourt.description}
            </p>
          )}
        </div>
      )}

      <div className="grid gap-2">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-foreground" />
          <Label htmlFor="date">Data</Label>
        </div>
        <Input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="bg-background border-border text-foreground"
        />
      </div>

      {date && (
        <div className="bg-muted p-3 rounded-md text-sm space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-foreground" />
            <p className="font-semibold">Horários do dia:</p>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {slots.map((slot, i) => (
              <Button
                key={i}
                variant="outline"
                className="cursor-pointer"
                disabled={slot.status !== "available"}
                onClick={() => {
                  setStartTime(slot.start);
                  setEndTime(slot.end);
                }}
              >
                {slot.start} - {slot.end}
              </Button>
            ))}
          </div>

          <div className="bg-white rounded-md border p-3">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-foreground" />
              <p className="font-semibold">Horários indisponíveis:</p>
            </div>
            {date && filteredBookings.length > 0 && (
              <div className="bg-white rounded-md border p-3 mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-foreground" />
                  <p className="font-semibold">Reservas no dia:</p>
                </div>
                <ul className="list-disc list-inside text-sm">
                  {filteredBookings.map((booking, index) => (
                    <li key={index}>
                      {formatInTimeZone(parseISO(booking.startTime), "UTC", "HH:mm")} -{" "}
                      {formatInTimeZone(parseISO(booking.endTime), "UTC", "HH:mm")}{" "}
                      {booking.status === "APPROVED" && "(Aprovada)"}
                      {booking.status === "PENDING" && "(Pendente)"}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <ul className="list-disc list-inside text-sm">
              {slots
                .filter((s) => s.status !== "available")
                .map((s, i) => (
                  <li key={i}>
                    {s.start} - {s.end} ({s.status === "reserved" ? "Reservado" : "Bloqueado"})
                  </li>
                ))}
            </ul>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-foreground" />
            <Label htmlFor="startTime">Início</Label>
          </div>
          <Input
            id="startTime"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
            className="bg-background border-border text-foreground"
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-foreground" />
            <Label htmlFor="endTime">Término</Label>
          </div>
          <Input
            id="endTime"
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
            className="bg-background border-border text-foreground"
          />
        </div>
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Enviando..." : "Reservar"}
      </Button>
    </form>
  );
}
