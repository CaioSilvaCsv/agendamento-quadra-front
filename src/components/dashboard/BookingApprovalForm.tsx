"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { format } from "date-fns";
import api from "@/services/api";
import { Separator } from "../ui/separator";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Calendar, Clock, Check, XCircle } from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

interface Booking {
  id: number;
  courtId: number;
  userId: number;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  reason?: string;
  user: {
    name: string;
    email: string;
  };
}

interface Court {
  id: number;
  name: string;
}

interface CourtBookingsApprovalProps {
  court: Court;
}

function CourtBookingsApproval({ court }: CourtBookingsApprovalProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<Record<number, string>>(
    {}
  );
  const [rejectReasons, setRejectReasons] = useState<Record<number, string>>(
    {}
  );

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/courts/${court.id}/bookings`);
        const pendingBookings = data.filter(
          (booking: Booking) => booking.status === "PENDING"
        );
        setBookings(pendingBookings);
      } catch (error) {
        toast.error(
          `Erro ao carregar agendamentos pendentes para a quadra ${court.name}`
        );
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [court.id, court.name]);

  const handleStatusChange = (bookingId: number, status: string) => {
    setSelectedStatus((prev) => ({ ...prev, [bookingId]: status }));
  };

  const handleRejectReasonChange = (bookingId: number, reason: string) => {
    setRejectReasons((prev) => ({ ...prev, [bookingId]: reason }));
  };

  const handleApproval = async (bookingId: number) => {
    const status = selectedStatus[bookingId];
    if (!status) {
      toast.error("Selecione uma ação para este agendamento.");
      return;
    }
    setLoading(true);
    try {
      const body: any = { status };
      if (status === "REJECTED") {
        body.reason = rejectReasons[bookingId] || "Agendamento rejeitado.";
      }
      await api.patch(`/bookings/${bookingId}/status`, body);
      toast.success("Agendamento atualizado com sucesso!");
      setBookings((prev) => prev.filter((b) => b.id !== bookingId));
    } catch (error) {
      toast.error("Erro ao atualizar o agendamento.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 border rounded-md p-4 mb-4 bg-background">
      {loading && (
        <p className="text-muted-foreground">Carregando agendamentos...</p>
      )}
      {bookings.length === 0 ? (
        <p className="text-muted-foreground">
          Nenhum agendamento pendente para esta quadra.
        </p>
      ) : (
        bookings.map((booking) => (
          <Card
            key={booking.id}
            className="border border-border bg-background hover:bg-muted transition-colors"
          >
            <CardHeader className="flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-foreground" />
              <CardTitle className="text-foreground">
                Agendamento #{booking.id}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="flex items-center text-foreground">
                <span className="font-semibold mr-1">Solicitante:</span>
                {booking.user.name} ({booking.user.email})
              </p>
              <p className="flex items-center text-foreground">
                <span className="font-semibold mr-1">Data:</span>
                {format(new Date(booking.date), "dd/MM/yyyy")}
              </p>
              <p className="flex items-center text-foreground">
                <Clock className="mr-2 h-5 w-5" />
                <span className="font-semibold mr-1">Horário:</span>
                {format(new Date(booking.startTime), "HH:mm")} -{" "}
                {format(new Date(booking.endTime), "HH:mm")}
              </p>
              <p className="flex items-center text-foreground">
                <span className="font-semibold mr-1">Status Atual:</span>
                {booking.status}
              </p>
              {selectedStatus[booking.id] && (
                <p className="flex items-center text-foreground">
                  <span className="font-semibold mr-1">Nova Ação:</span>
                  {selectedStatus[booking.id] === "APPROVED" ? (
                    <span className="flex items-center">
                      <Check className="mr-1 h-4 w-4" /> Aprovar
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <XCircle className="mr-1 h-4 w-4" /> Rejeitar
                    </span>
                  )}
                </p>
              )}
              {selectedStatus[booking.id] === "REJECTED" && (
                <div className="space-y-2">
                  <Label
                    htmlFor={`reject-reason-${booking.id}`}
                    className="text-foreground"
                  >
                    Motivo da Rejeição
                  </Label>
                  <Input
                    id={`reject-reason-${booking.id}`}
                    type="text"
                    placeholder="Informe o motivo..."
                    value={rejectReasons[booking.id] || ""}
                    onChange={(e) =>
                      handleRejectReasonChange(booking.id, e.target.value)
                    }
                  />
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-end space-x-4">
              <div className="space-x-2">
                <Button
                  onClick={() => handleStatusChange(booking.id, "APPROVED")}
                  variant={
                    selectedStatus[booking.id] === "APPROVED"
                      ? "default"
                      : "outline"
                  }
                >
                  Aprovar
                </Button>
                <Button
                  onClick={() => handleStatusChange(booking.id, "REJECTED")}
                  variant={
                    selectedStatus[booking.id] === "REJECTED"
                      ? "default"
                      : "outline"
                  }
                >
                  Rejeitar
                </Button>
              </div>
              <Button
                onClick={() => handleApproval(booking.id)}
                disabled={loading}
              >
                Confirmar
              </Button>
            </CardFooter>
          </Card>
        ))
      )}
    </div>
  );
}

export function BookingApprovalForm() {
  const [courts, setCourts] = useState<Court[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCourts = async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/courts");
        setCourts(data);
      } catch (error) {
        toast.error("Erro ao carregar quadras");
      } finally {
        setLoading(false);
      }
    };
    fetchCourts();
  }, []);

  return (
    <div className="space-y-4 bg-background p-4 rounded-md border border-border">
      <div>
        <h2 className="text-xl font-semibold text-foreground">
          Aprovação de Agendamentos
        </h2>
        <Separator className="my-4 border-border" />
      </div>
      {loading && (
        <p className="text-muted-foreground">Carregando quadras...</p>
      )}
      <Accordion type="single" collapsible className="w-full">
        {courts.map((court) => (
          <AccordionItem key={court.id} value={`${court.id}`}>
            <AccordionTrigger className="text-lg font-semibold text-foreground hover:text-primary hover:no-underline">
              {court.name}
            </AccordionTrigger>
            <AccordionContent>
              <CourtBookingsApproval court={court} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

export default BookingApprovalForm;
