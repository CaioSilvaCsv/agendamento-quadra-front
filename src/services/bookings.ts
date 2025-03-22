import api from "./api"

export async function getMyBookings() {
  const { data } = await api.get("/bookings/me")
  return data
}

export async function cancelBooking(id: number) {
  const { data } = await api.patch(`/bookings/${id}/cancel`)
  return data
}
