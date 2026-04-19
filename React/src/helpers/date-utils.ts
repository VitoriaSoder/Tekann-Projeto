import { format, addDays, subDays, isSameDay } from "date-fns"
import { ptBR } from "date-fns/locale"
export function formatFullDate(date: Date): string {
  return format(date, "dd 'de' MMMM, yyyy", { locale: ptBR })
}
export function formatShortDate(date: Date): string {
  return format(date, "EEE, dd MMM", { locale: ptBR })
}
export function isSameDayLocal(dateLeft: Date, dateRight: Date): boolean {
  return isSameDay(dateLeft, dateRight)
}
export function generateTimeSlots(startHour: number, endHour: number, intervalMinutes: number = 60): string[] {
  const slots: string[] = []
  let currentHou = startHour
  let currentMin = 0
  while (currentHou < endHour || (currentHou === endHour && currentMin === 0)) {
    const formattedHour = currentHou.toString().padStart(2, "0")
    const formattedMin = currentMin.toString().padStart(2, "0")
    slots.push(`${formattedHour}:${formattedMin}`)
    currentMin += intervalMinutes
    if (currentMin >= 60) {
      currentHou += Math.floor(currentMin / 60)
      currentMin = currentMin % 60
    }
  }
  return slots
}
