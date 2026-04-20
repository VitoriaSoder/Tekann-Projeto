import { format, isToday, isTomorrow, addDays, isBefore, startOfDay } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { Clock, MapPin, Users, CalendarOff } from "lucide-react"
import { Booking } from "@/logic/store/slices/booking-slice"
import { ReservationModal } from "./reservation-modal"
import { useTranslation } from "react-i18next"
type ListViewProps = {
  bookings: Booking[]
  selectedDate?: Date
}
function getDayLabel(date: Date, t: any): string {
  if (isToday(date)) return t("common:today")
  if (isTomorrow(date)) return t("common:tomorrow")
  return format(date, "EEEE, d 'de' MMMM", { locale: ptBR })
}

export function ListView({ bookings }: ListViewProps) {
  const { t } = useTranslation()
  const today = startOfDay(new Date())
  const rangeEnd = addDays(today, 30)

  const grouped = new Map<string, Booking[]>()

  bookings
    .filter(b => {
      if (!b.date) return false
      const dateOnly = b.date.substring(0, 10)
      const d = new Date(dateOnly + "T00:00:00")
      return !isBefore(d, today) && !isBefore(rangeEnd, d) && b.status === "ACTIVE"
    })
    .sort((a, b) => {
      const dateCompare = a.date.substring(0, 10).localeCompare(b.date.substring(0, 10))
      if (dateCompare !== 0) return dateCompare
      return a.startTime.localeCompare(b.startTime)
    })
    .forEach(booking => {
      const key = booking.date.substring(0, 10)
      const existing = grouped.get(key) ?? []
      grouped.set(key, [...existing, booking])
    })

  const sortedKeys = Array.from(grouped.keys()).sort()

  if (sortedKeys.length === 0) {
    return (
      <div className="bg-card border border-border rounded-[24px] overflow-hidden shadow-sm">
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <CalendarOff className="w-7 h-7 text-muted-foreground" />
          </div>
          <h3 className="text-base font-bold text-foreground mb-1">{t("schedule:no_bookings")}</h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-xs">
            {t("schedule:no_bookings_desc")}
          </p>
          <ReservationModal />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-card border border-border rounded-[24px] overflow-hidden shadow-sm">
      <div className="overflow-auto max-h-[calc(100vh-260px)] md:max-h-[calc(100vh-300px)] min-h-[300px]">
        {sortedKeys.map(dateKey => {
          const date = new Date(dateKey + "T00:00:00")
          const dayBookings = grouped.get(dateKey)!

          return (
            <div key={dateKey}>
              <div className="sticky top-0 z-10 flex items-center gap-3 px-4 md:px-6 py-3 bg-muted/60 backdrop-blur-sm border-b border-border">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
                  isToday(date) ? "bg-primary text-primary-foreground" : "bg-background border border-border text-foreground"
                )}>
                  {format(date, "d")}
                </div>
                <span className="text-sm font-bold text-foreground capitalize">
                  {getDayLabel(date, t)}
                </span>
                <span className="ml-auto text-xs font-semibold text-muted-foreground">
                  {t("schedule:reservations_count", { count: dayBookings.length })}
                </span>
              </div>

              <div className="divide-y divide-border/60">
                {dayBookings.map(booking => (
                  <div
                    key={booking.id}
                    className="flex items-center gap-3 md:gap-4 px-4 md:px-6 py-4 hover:bg-muted/30 transition-colors group"
                  >
                    <div className="shrink-0 text-center w-14 md:w-16">
                      <div className="text-sm font-bold text-foreground tabular-nums">{booking.startTime}</div>
                      <div className="text-xs text-muted-foreground tabular-nums">{booking.endTime}</div>
                    </div>

                    <div className="w-1 self-stretch rounded-full bg-primary/60 shrink-0" />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="text-sm font-semibold text-foreground line-clamp-1">
                            {booking.clientName}
                          </h4>
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            <span className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
                              <MapPin className="w-3 h-3 opacity-60" />
                              {booking.courtName}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
                              <Clock className="w-3 h-3 opacity-60" />
                              {booking.startTime} – {booking.endTime}
                            </span>
                            {booking.numberOfPeople > 0 && (
                              <span className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
                                <Users className="w-3 h-3 opacity-60" />
                                {booking.numberOfPeople}
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                          {t("schedule:confirmed")}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
