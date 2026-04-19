import { Reservation } from "../features/reservations/schemas/reservation-schema"
export function timeToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(":").map(Number)
  return hours * 60 + minutes
}
export function hasTimeConflict(
  newStart: string,
  newEnd: string,
  existingReservations: Reservation[]
): boolean {
  const newStartMin = timeToMinutes(newStart)
  const newEndMin = timeToMinutes(newEnd)
  return existingReservations.some((reservation) => {
    if (reservation.status === "CANCELLED") return false
    const oldStartMin = timeToMinutes(reservation.startTime)
    const oldEndMin = timeToMinutes(reservation.endTime)
    return newStartMin < oldEndMin && newEndMin > oldStartMin
  })
}
