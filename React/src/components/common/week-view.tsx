import { useState } from "react"
import { format, isToday, addMinutes } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { ScheduleDay } from "@/features/schedule/schemas/schedule-schema"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ReservationModal } from "./reservation-modal"
import { useTranslation } from "react-i18next"
type WeekViewProps = {
  weekData: ScheduleDay[]
  hours: string[]
  onDayClick?: (date: Date) => void
}
export function WeekView({ weekData, hours, onDayClick }: WeekViewProps) {
  const { t } = useTranslation()
  const courts = weekData[0]?.grid ?? []
  const [selectedCourtId, setSelectedCourtId] = useState<string>(courts[0]?.courtId ?? "")
  const activeCourt = courts.find(c => c.courtId === selectedCourtId) ?? courts[0]
  const [activeDay, setActiveDay] = useState(0)
  return (
    <div className="bg-card border border-border rounded-[24px] overflow-hidden shadow-sm">
      {}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide shrink-0">Quadra</span>
        <Select value={selectedCourtId} onValueChange={setSelectedCourtId}>
          <SelectTrigger className="h-9 w-auto min-w-[160px] rounded-full border-border text-sm font-semibold">
            <SelectValue placeholder="Selecione a quadra" />
          </SelectTrigger>
          <SelectContent className="rounded-2xl border-border shadow-xl">
            {courts.map(c => (
              <SelectItem key={c.courtId} value={c.courtId} className="font-medium">
                {c.courtName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {activeCourt && (
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border shrink-0">
            {activeCourt.courtType}
          </span>
        )}
      </div>
      {}
      <div className="md:hidden flex flex-col">
        {}
        <div className="flex overflow-x-auto border-b border-border" style={{ scrollbarWidth: "none" }}>
          {weekData.map((day, i) => (
            <button
              key={i}
              onClick={() => setActiveDay(i)}
              className={cn(
                "flex-none flex flex-col items-center px-4 py-2.5 border-b-2 transition-colors min-w-[56px]",
                activeDay === i ? "border-primary" : "border-transparent text-muted-foreground"
              )}
            >
              <span className="text-[10px] font-semibold uppercase text-muted-foreground">
                {format(day.date, "EEE", { locale: ptBR })}
              </span>
              <span className={cn(
                "text-base font-bold mt-0.5 w-8 h-8 flex items-center justify-center rounded-full",
                isToday(day.date) ? "bg-primary text-primary-foreground" : "text-foreground"
              )}>
                {format(day.date, "d")}
              </span>
            </button>
          ))}
        </div>
        {}
        <div className="overflow-auto max-h-[calc(100dvh-340px)] min-h-[260px]">
          {hours.map((hour) => {
            const dayGrid = weekData[activeDay]?.grid.find(c => c.courtId === selectedCourtId)
            const slot = dayGrid?.slots.find(s => s.time === hour)
            const isOccupied = slot?.status === "OCCUPIED"
            return (
              <div key={hour} className="flex items-stretch border-b border-border last:border-b-0">
                <div className="w-16 shrink-0 flex items-center justify-center border-r border-border bg-card">
                  <span className="text-xs font-medium text-muted-foreground tabular-nums">{hour}</span>
                </div>
                <div className="flex-1 p-1.5">
                  <div className={cn(
                    "h-full min-h-[56px] rounded-xl flex items-center justify-center transition-all border",
                    isOccupied
                      ? "bg-destructive/10 border-destructive/20"
                      : "border-transparent hover:bg-muted hover:border-primary/30"
                  )}>
                    {isOccupied ? (
                      <span className="text-xs font-semibold text-destructive">{t("schedule:occupied")}</span>
                    ) : dayGrid ? (
                      <ReservationModal
                        defaultValues={{ courtId: selectedCourtId, date: weekData[activeDay].date, startTime: hour, endTime: format(addMinutes(new Date(`1970-01-01T${hour}:00`), 60), "HH:mm") }}
                        trigger={
                          <button className="w-full h-full min-h-[56px] flex items-center justify-center">
                            <span className="text-xs font-semibold text-primary opacity-0 group-hover:opacity-100">+</span>
                          </button>
                        }
                      />
                    ) : null}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      {}
      <div className="hidden md:block overflow-auto max-h-[calc(100vh-300px)] min-h-[400px]">
        <div style={{ minWidth: `${80 + weekData.length * 130}px` }}>
          {}
          <div className="sticky top-0 z-20 flex border-b border-border bg-card">
            <div className="sticky left-0 z-30 w-20 shrink-0 border-r border-border bg-card" />
            {weekData.map((day, i) => (
              <div
                key={i}
                onClick={() => onDayClick?.(day.date)}
                className={cn(
                  "flex-1 px-2 py-3 text-center border-r border-border last:border-r-0 min-w-[130px] transition-colors",
                  isToday(day.date) ? "bg-primary/5" : "",
                  onDayClick && "cursor-pointer hover:bg-muted/50"
                )}
              >
                <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                  {format(day.date, "EEE", { locale: ptBR })}
                </div>
                <div className={cn(
                  "text-xl font-bold mt-1 w-9 h-9 flex items-center justify-center rounded-full mx-auto transition-colors",
                  isToday(day.date)
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground"
                )}>
                  {format(day.date, "d")}
                </div>
              </div>
            ))}
          </div>
          {}
          {hours.map((hour) => (
            <div key={hour} className="flex group min-h-[64px] border-b border-border last:border-b-0 hover:bg-muted/10 transition-colors">
              <div className="sticky left-0 z-10 w-20 shrink-0 flex items-start justify-center pt-2.5 border-r border-border bg-card">
                <span className="text-xs font-medium text-muted-foreground tabular-nums">{hour}</span>
              </div>
              {weekData.map((day, colIndex) => {
                const court = day.grid.find(c => c.courtId === selectedCourtId)
                const slot = court?.slots.find(s => s.time === hour)
                const isOccupied = slot?.status === "OCCUPIED"
                return (
                  <div
                    key={colIndex}
                    className={cn(
                      "flex-1 p-1.5 border-r border-border/50 last:border-r-0 min-w-[130px]",
                      isToday(day.date) && "bg-primary/5"
                    )}
                  >
                    <div className={cn(
                      "h-full min-h-[48px] rounded-xl flex items-center justify-center transition-all border",
                      isOccupied
                        ? "bg-destructive/10 border-destructive/20"
                        : "border-transparent hover:bg-muted hover:border-primary/30 group/cell"
                    )}>
                      {isOccupied ? (
                        <span className="text-xs font-semibold text-destructive">{t("schedule:occupied")}</span>
                      ) : court ? (
                        <ReservationModal
                          defaultValues={{ courtId: selectedCourtId, date: day.date, startTime: hour }}
                          trigger={
                            <button className="w-full h-full min-h-[48px] flex items-center justify-center opacity-0 group-hover/cell:opacity-100 transition-opacity">
                              <span className="text-sm font-bold text-primary">+</span>
                            </button>
                          }
                        />
                      ) : null}
                    </div>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
      {}
      <div className="flex items-center gap-4 px-4 py-3 border-t border-border">
        <span className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
          <span className="w-2.5 h-2.5 rounded-full bg-primary" /> {t("schedule:available")}
        </span>
        <span className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
          <span className="w-2.5 h-2.5 rounded-full bg-destructive" /> {t("schedule:occupied")}
        </span>
      </div>
    </div>
  )
}
