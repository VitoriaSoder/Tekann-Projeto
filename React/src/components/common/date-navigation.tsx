import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
type DateNavigationProps = {
  title: string
  onPrev: () => void
  onNext: () => void
  onToday: () => void
  onOpenCalendar?: () => void
}
export function DateNavigation({ title, onPrev, onNext, onToday, onOpenCalendar }: DateNavigationProps) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={onPrev} className="rounded-full h-10 w-10">
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <Button variant="outline" size="icon" onClick={onNext} className="rounded-full h-10 w-10">
          <ChevronRight className="w-5 h-5" />
        </Button>
        <Button variant="outline" onClick={onToday} className="rounded-full px-6 font-semibold hidden sm:flex">
          Hoje
        </Button>
      </div>
      <div className="flex items-center gap-3 ml-2">
        {onOpenCalendar && (
          <Button variant="ghost" size="icon" onClick={onOpenCalendar} className="rounded-full text-muted-foreground hover:text-foreground">
            <CalendarIcon className="w-5 h-5" />
          </Button>
        )}
        <h2 className="text-2xl font-bold tracking-tight text-foreground capitalize">
          {title}
        </h2>
      </div>
    </div>
  )
}
