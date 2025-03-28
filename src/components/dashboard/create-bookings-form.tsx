"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import api from "@/services/api";
import axios from "axios";
import { format, isSameDay, setHours, setMinutes, addHours } from "date-fns";

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

export function CreateBookingForm() {
  const [courts, setCourts] = useState<Court[]>([]);
  const [courtId, setCourtId] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [courtBookings, setCourtBookings] = useState<BookingBlock[]>([]);
  const [blockedTimes, setBlockedTimes] = useState<BookingBlock[]>([]);

  const selectedCourt = courts.find((court) => String(court.id) === courtId);
  const dateObj = date ? new Date(date) : null;

  const filteredBookings = useMemo(() => {
    return courtBookings.filter((b) => dateObj && isSameDay(new Date(b.date), dateObj));
  }, [courtBookings, dateObj]);

  const filteredBlocks = useMemo(() => {
    return blockedTimes.filter((b) => {
      const blockDate = b.date ? new Date(b.date) : null;
      const sameDay = blockDate && dateObj && isSameDay(blockDate, dateObj);
      const sameWeekday = b.recurringDay !== undefined && dateObj && b.recurringDay === dateObj.getDay();
      return sameDay || sameWeekday;
    });
  }, [blockedTimes, dateObj]);

  const generateTimeSlots = (): TimeSlot[] => {
    if (!selectedCourt || !dateObj) return [];

    const [openH, openM] = selectedCourt.openTime.split(":").map(Number);
    const [closeH, closeM] = selectedCourt.closeTime.split(":").map(Number);

    const start = setMinutes(setHours(new Date(dateObj), openH), openM);
    const end = setMinutes(setHours(new Date(dateObj), closeH), closeM);

    const slots: TimeSlot[] = [];
    let current = new Date(start);

    while (current < end) {
      const slotStart = new Date(current);
      const slotEnd = addHours(slotStart, 1);

      // Verifica se o slot está bloqueado:
      const isBlocked = filteredBlocks.some((b) => {
        // Se não há horários definidos, o bloqueio cobre o dia inteiro.
        if (!b.startTime || !b.endTime) {
          return true;
        }
        // Para bloqueios com horário definido, utiliza a data do bloqueio (ou a data atual para bloqueios recorrentes)
        const blockDate = b.date ? b.date.split("T")[0] : format(dateObj, "yyyy-MM-dd");
        const blockStart = new Date(`${blockDate}T${b.startTime}`);
        const blockEnd = new Date(`${blockDate}T${b.endTime}`);
        return slotStart >= blockStart && slotStart < blockEnd;
      });

      // Considera como reserva apenas os bookings com status PENDING ou APPROVED
      const isReserved = filteredBookings.some((b) => {
        if (b.status !== "PENDING" && b.status !== "APPROVED") return false;
        return slotStart < new Date(b.endTime) && slotEnd > new Date(b.startTime);
      });

      const slotStatus: TimeSlot["status"] = isBlocked ? "blocked" : isReserved ? "reserved" : "available";

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

  const slots = useMemo(generateTimeSlots, [selectedCourt, dateObj, filteredBookings, filteredBlocks]);

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
      await api.post("/bookings", {
        courtId: Number(courtId),
        date,
        startTime,
        endTime,
      });
      toast.success("Reserva criada com sucesso!", { duration: 4000 });
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold">Nova Reserva</h2>

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

      {selectedCourt && (
        <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
          <p>
            <strong>Local:</strong> {selectedCourt.location}
          </p>
          <p>
            <strong>Horário:</strong> {selectedCourt.openTime} - {selectedCourt.closeTime}
          </p>
          {selectedCourt.description && (
            <p>
              <strong>Descrição:</strong> {selectedCourt.description}
            </p>
          )}
        </div>
      )}

      <div className="grid gap-2">
        <Label htmlFor="date">Data</Label>
        <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      </div>

      {date && (
        <div className="bg-muted p-3 rounded-md text-sm space-y-4">
          <div>
            <p className="font-semibold">Horários do dia:</p>
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
          </div>

          <div className="bg-white rounded-md border p-3">
            <p className="font-semibold mb-2">Horários indisponíveis:</p>
            <ul className="list-disc list-inside text-sm">
              {slots.filter((s) => s.status !== "available").map((s, i) => (
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
          <Label htmlFor="startTime">Início</Label>
          <Input id="startTime" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="endTime">Término</Label>
          <Input id="endTime" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
        </div>
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Enviando..." : "Reservar"}
      </Button>
    </form>
  );
}
