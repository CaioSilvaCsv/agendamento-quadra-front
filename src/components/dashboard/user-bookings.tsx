"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getMyBookings, cancelBooking } from "@/services/bookings"
import { toast } from "sonner"
import { formatDateUTC, formatHourUTC } from "@/utils/date"

interface Booking {
  id: number
  date: string
  startTime: string
  endTime: string
  status: string
  court: {
    name: string
  }
}

export function UserBookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  const fetchBookings = async () => {
    try {
      const data = await getMyBookings()
      setBookings(data)
    } catch (err) {
      console.error("Erro ao buscar reservas:", err)
      toast.error("Erro ao buscar reservas")
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async (id: number) => {
    try {
      await cancelBooking(id)
      toast.success("Reserva cancelada com sucesso!")
      fetchBookings() // atualiza a lista
    } catch (err) {
      console.error("Erro ao cancelar reserva:", err)
      toast.error("Erro ao cancelar reserva")
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  if (loading) {
    return <p className="text-muted-foreground">Carregando reservas...</p>
  }

  if (bookings.length === 0) {
    return <p className="text-muted-foreground">Nenhuma reserva encontrada.</p>
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Minhas Reservas</h2>
      {bookings.map((reserva) => (
        <Card key={reserva.id}>
          <CardContent className="p-4 space-y-2">
            <p><strong>Quadra:</strong> {reserva.court.name}</p>
            <p><strong>Data:</strong> {formatDateUTC(reserva.date)}</p>
            <p>
              <strong>Horário:</strong> {formatHourUTC(reserva.startTime)} - {formatHourUTC(reserva.endTime)}
            </p>
            <p><strong>Status:</strong> {reserva.status}</p>

            {reserva.status !== "CANCELLED" && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleCancel(reserva.id)}
              >
                Cancelar
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 
