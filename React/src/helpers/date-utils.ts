import { format, addDays, subDays, isSameDay } from "date-fns"
import { ptBR } from "date-fns/locale"
import { ViewMode } from "@/components/common/view-toggle"

export function getViewTitle(view: ViewMode, selectedDate: Date, weekDays: Date[], t: any, locale: any): string {
  if (view === "day") return format(selectedDate, "dd 'de' MMMM, yyyy", { locale })
  if (view === "week") {
    const start = format(weekDays[0], "d MMM", { locale })
    const end = format(weekDays[6], "d MMM yyyy", { locale })
    return `${start} – ${end}`
  }
  if (view === "month") return format(selectedDate, "MMMM yyyy", { locale })
  return t("schedule:subtitle")
}
export function formatFullDate(date: Date, locale: any = ptBR): string {
  return format(date, "dd 'de' MMMM, yyyy", { locale })
}
export function formatShortDate(date: Date, locale: any = ptBR): string {
  return format(date, "EEE, dd MMM", { locale })
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
