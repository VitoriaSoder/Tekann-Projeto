import { format, isToday, isSameMonth } from "date-fns"
import { cn } from "@/lib/utils"
const WEEKDAYS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"]
type DaySummary = {
  occupied: number
  available: number
  total: number
}
type MonthViewProps = {
  selectedDate: Date
  monthDays: (Date | null)[]
  daySummary: Map<string, DaySummary>
  onDayClick: (date: Date) => void
}
export function MonthView({ selectedDate, monthDays, daySummary, onDayClick }: MonthViewProps) {
  return (
    <div className="bg-card border border-border rounded-[24px] overflow-hidden shadow-sm">
      {}
      <div className="grid grid-cols-7 border-b border-border">
        {WEEKDAYS.map(day => (
          <div key={day} className="py-3 text-center">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">{day}</span>
          </div>
        ))}
      </div>
      {}
      <div className="grid grid-cols-7">
        {monthDays.map((date, i) => {
          if (!date) {
            return <div key={`empty-${i}`} className="border-b border-r border-border/50 min-h-[80px] md:min-h-[110px] last:border-r-0" />
          }
          const key = format(date, "yyyy-MM-dd")
          const summary = daySummary.get(key)
          const isCurrentMonth = isSameMonth(date, selectedDate)
          const isSelected = format(date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
          const today = isToday(date)
          const occupancyRate = summary && summary.total > 0
            ? summary.occupied / summary.total
            : 0
          return (
            <div
              key={key}
              onClick={() => onDayClick(date)}
              className={cn(
                "relative border-b border-r border-border/50 min-h-[80px] md:min-h-[110px] p-1.5 md:p-2 cursor-pointer transition-colors hover:bg-muted/50",
                !isCurrentMonth && "opacity-30",
                isSelected && "bg-primary/5 hover:bg-primary/10",
                (i + 1) % 7 === 0 && "border-r-0"
              )}
            >
              {}
              <div className="flex justify-start mb-1.5 md:mb-2">
                <span className={cn(
                  "text-xs md:text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full transition-colors",
                  today
                    ? "bg-primary text-primary-foreground"
                    : isSelected
                    ? "bg-foreground text-background"
                    : "text-foreground"
                )}>
                  {format(date, "d")}
                </span>
              </div>
              {}
              {summary && summary.total > 0 && (
                <div className="hidden md:flex flex-col gap-1">
                  <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        occupancyRate >= 0.8
                          ? "bg-destructive"
                          : occupancyRate >= 0.4
                          ? "bg-amber-500"
                          : "bg-primary"
                      )}
                      style={{ width: `${occupancyRate * 100}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    {summary.occupied > 0 && (
                      <span className="text-[10px] font-semibold text-destructive">
                        {summary.occupied} ocupado{summary.occupied !== 1 ? "s" : ""}
                      </span>
                    )}
                    {summary.available > 0 && (
                      <span className="text-[10px] font-semibold text-muted-foreground ml-auto">
                        {summary.available} livre{summary.available !== 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                </div>
              )}
              {}
              {summary && summary.total > 0 && (
                <div className="md:hidden flex gap-1 flex-wrap mt-1">
                  {summary.occupied > 0 && (
                    <span className="w-1.5 h-1.5 rounded-full bg-destructive" />
                  )}
                  {summary.available > 0 && (
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
      {}
      <div className="flex items-center gap-4 px-4 py-3 border-t border-border">
        <span className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
          <span className="w-2.5 h-2.5 rounded-full bg-primary" /> Disponível
        </span>
        <span className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Parcial
        </span>
        <span className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
          <span className="w-2.5 h-2.5 rounded-full bg-destructive" /> Lotado
        </span>
      </div>
    </div>
  )
}
