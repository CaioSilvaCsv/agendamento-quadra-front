import api from "./api";

// Obtém as reservas do usuário autenticado
export async function getMyBookings() {
  const { data } = await api.get("/bookings/me");
  return data;
}

// Cancela uma reserva pelo ID
export async function cancelBooking(id: number) {
  const { data } = await api.patch(`/bookings/${id}/cancel`);
  return data;
}

// Cria uma nova reserva
export async function createBooking({
  courtId,
  date,
  startTime,
  endTime,
}: {
  courtId: number;
  date: string;
  startTime: string;
  endTime: string;
}) {
  const { data } = await api.post("/bookings", {
    courtId,
    date,
    startTime,
    endTime,
  });
  return data;
}

// Obtém as reservas de uma quadra específica
export async function getCourtBookings(courtId: number) {
  const { data } = await api.get(`/courts/${courtId}/bookings`);
  return data;
}

// Obtém os horários bloqueados de uma quadra específica
export async function getBlockedTimes(courtId: number) {
  const { data } = await api.get(`/courts/${courtId}/blocked-times`);
  return data;
}

// Bloqueia um horário para uma quadra (rota protegida para ADMIN)
export async function blockTime(
  courtId: number,
  {
    date,
    startTime,
    endTime,
  }: { date: string; startTime: string; endTime: string }
) {
  const { data } = await api.post(`/courts/${courtId}/blocked-times`, {
    date,
    startTime,
    endTime,
  });
  return data;
}

// Remove um bloqueio de horário pelo ID (rota protegida para ADMIN)
export async function deleteBlockedTime(id: number) {
  const { data } = await api.delete(`/blocked-times/${id}`);
  return data;
}
