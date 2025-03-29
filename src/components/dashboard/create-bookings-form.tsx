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
import { format, isSameDay, setHours, setMinutes, addHours } from "date-fns";
import { Separator } from "../ui/separator";
import { Calendar, Clock, MapPin } from "lucide-react";

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
    return courtBookings.filter(
      (b) => dateObj && isSameDay(new Date(b.date), dateObj)
    );
  }, [courtBookings, dateObj]);

  const filteredBlocks = useMemo(() => {
    return blockedTimes.filter((b) => {
      const blockDate = b.date ? new Date(b.date) : null;
      const sameDay = blockDate && dateObj && isSameDay(blockDate, dateObj);
      const sameWeekday =
        b.recurringDay !== undefined &&
        dateObj &&
        b.recurringDay === dateObj.getDay();
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

      const isBlocked = filteredBlocks.some((b) => {
        if (!b.startTime || !b.endTime) {
          return true;
        }
        const blockDate = b.date
          ? b.date.split("T")[0]
          : format(dateObj, "yyyy-MM-dd");
        const blockStart = new Date(`${blockDate}T${b.startTime}`);
        const blockEnd = new Date(`${blockDate}T${b.endTime}`);
        return slotStart >= blockStart && slotStart < blockEnd;
      });

      const isReserved = filteredBookings.some((b) => {
        if (b.status !== "PENDING" && b.status !== "APPROVED") return false;
        return (
          slotStart < new Date(b.endTime) && slotEnd > new Date(b.startTime)
        );
      });

      const slotStatus: TimeSlot["status"] = isBlocked
        ? "blocked"
        : isReserved
        ? "reserved"
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
