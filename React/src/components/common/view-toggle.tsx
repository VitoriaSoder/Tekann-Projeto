import { cn } from "@/lib/utils"
import { LayoutGrid, Columns, CalendarDays, List } from "lucide-react"
export type ViewMode = "day" | "week" | "month" | "list"
type ViewToggleProps = {
  value: ViewMode
  onChange: (mode: ViewMode) => void
  className?: string
}
const options: { value: ViewMode; label: string; icon: React.ElementType }[] = [
  { value: "day", label: "Dia", icon: LayoutGrid },
  { value: "week", label: "Semana", icon: Columns },
  { value: "month", label: "Mês", icon: CalendarDays },
  { value: "list", label: "Lista", icon: List },
]
export function ViewToggle({ value, onChange, className }: ViewToggleProps) {
  return (
    <div className={cn("flex items-center bg-muted rounded-full p-1 gap-0.5", className)}>
      {options.map(opt => {
        const Icon = opt.icon
        const isActive = value === opt.value
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200",
              isActive
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">{opt.label}</span>
          </button>
        )
      })}
    </div>
  )
}
