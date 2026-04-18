import { useState } from "react"
import { useSearchParams } from "react-router-dom"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useSchedule } from "@/logic/hooks/use-schedule"
import { formatFullDate, formatShortDate } from "@/helpers/date-utils"
import { DateNavigation } from "@/components/common/date-navigation"
import { GridTimeline } from "@/components/common/grid-timeline"
import { StatusBadge } from "@/components/common/status-badge"
import { ReservationModal } from "@/components/common/reservation-modal"
import { WeekView } from "@/components/common/week-view"
import { MonthView } from "@/components/common/month-view"
import { ListView } from "@/components/common/list-view"
import { ViewToggle, type ViewMode } from "@/components/common/view-toggle"
import { ScheduleGridItem } from "@/features/schedule/schemas/schedule-schema"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Calendar as CalendarIcon, Clock, Users, Download, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { exportToCSV } from "@/helpers/csv-helper"
import { useTranslation } from "react-i18next"
function getViewTitle(view: ViewMode, selectedDate: Date, weekDays: Date[]): string {
  if (view === "day") return formatFullDate(selectedDate)
  if (view === "week") {
    const start = format(weekDays[0], "d MMM", { locale: ptBR })
    const end = format(weekDays[6], "d MMM yyyy", { locale: ptBR })
    return `${start} – ${end}`
  }
  if (view === "month") return format(selectedDate, "MMMM yyyy", { locale: ptBR })
  return "Agenda – próximos 30 dias"
}
export default function SchedulePage() {
  const { selectedDate, scheduleData, weekData, weekDays, monthDays, daySummary, hours, bookings, actions } = useSchedule()
  const [isMobileCalendarOpen, setIsMobileCalendarOpen] = useState(false)
  const [isDesktopCalendarOpen, setIsDesktopCalendarOpen] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>("day")
  const [searchParams] = useSearchParams()
  const defaultCourtId = searchParams.get("courtId") || undefined
  const { t } = useTranslation()
  const handleMobileDateSelect = (date: Date | undefined) => {
    if (date) { actions.selectDate(date); setIsMobileCalendarOpen(false) }
  }
  const handleDesktopDateSelect = (date: Date | undefined) => {
    if (date) { actions.selectDate(date); setIsDesktopCalendarOpen(false) }
  }
  const handleExportCSV = () => {
    const dataToExport = scheduleData.grid.flatMap(court =>
      court.slots
        .filter(slot => slot.status === "OCCUPIED")
        .map(slot => ({
          Court: court.courtName,
          Time: slot.time,
          Date: formatShortDate(selectedDate),
          Status: slot.status,
        }))
    )
    exportToCSV(dataToExport, `agenda-${formatShortDate(selectedDate)}`)
  }
  const handlePrev = () => {
    if (viewMode === "day") actions.prevDay()
    else if (viewMode === "week") actions.prevWeek()
    else if (viewMode === "month") actions.prevMonth()
  }
  const handleNext = () => {
    if (viewMode === "day") actions.nextDay()
    else if (viewMode === "week") actions.nextWeek()
    else if (viewMode === "month") actions.nextMonth()
  }
  const handleDayClickFromMonth = (date: Date) => {
    actions.selectDate(date)
    setViewMode("day")
  }
  const renderCourtHeader = (court: ScheduleGridItem) => (
    <div className="flex flex-col items-start text-left">
      <span className="text-sm font-semibold text-foreground tracking-tight leading-none mb-1.5">{court.courtName}</span>
      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
        {court.courtType}
      </span>
    </div>
  )
  const renderCourtTabLabel = (court: ScheduleGridItem) => (
    <div className="flex flex-col items-start">
      <span className="text-sm font-semibold text-foreground leading-none">{court.courtName}</span>
      <span className="text-xs text-muted-foreground mt-0.5">{court.courtType}</span>
    </div>
  )
  const renderScheduleSlot = (court: ScheduleGridItem, hour: string) => {
    const exactSlot = court.slots.find((s) => s.time === hour)
    const status = exactSlot?.status || "AVAILABLE"
    const isOccupied = status === "OCCUPIED"
    return (
      <div
        className={cn(
          "h-full min-h-[64px] md:min-h-[80px] w-full rounded-2xl flex flex-col p-2 md:p-3 transition-all relative overflow-hidden group/slot",
          isOccupied
            ? "bg-destructive/10 border border-destructive/20 hover:bg-destructive/20"
            : "bg-transparent border border-transparent hover:bg-muted hover:border-primary/40 hover:shadow-sm"
        )}
      >
        <div className="flex justify-between items-start mb-1.5 md:mb-2 relative z-10 w-full">
          <StatusBadge status={status} />
          {!isOccupied && (
            <ReservationModal
              defaultValues={{ courtId: court.courtId }}
              trigger={
                <button className="h-7 w-7 rounded-full opacity-100 md:opacity-0 md:group-hover/slot:opacity-100 transition-opacity bg-neutral-900 text-[#ccf32f] flex items-center justify-center hover:bg-black shadow-md">
                  <span className="text-lg leading-none font-bold">+</span>
                </button>
              }
            />
          )}
        </div>
        {isOccupied && exactSlot && (
          <div className="mt-auto space-y-0.5 md:space-y-1 z-10">
            <h4 className="text-xs md:text-sm font-semibold text-foreground line-clamp-1">Reserva Confirmada</h4>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
              <Clock className="w-3 h-3 md:w-3.5 md:h-3.5 opacity-70" /> {exactSlot.time} (60 min)
            </div>
            <div className="hidden md:flex items-center gap-1.5 text-xs text-muted-foreground font-medium mt-0.5">
              <Users className="w-3.5 h-3.5 opacity-70" /> 4 Jogadores
            </div>
          </div>
        )}
        {!isOccupied && (
          <div className="absolute inset-0 bg-[#ccf32f]/10 opacity-0 group-hover/slot:opacity-100 transition-opacity duration-300 rounded-2xl -z-0 pointer-events-none" />
        )}
      </div>
    )
  }
  const viewTitle = getViewTitle(viewMode, selectedDate, weekDays)
  const showNavArrows = viewMode !== "list"
  return (
    <div className="w-full flex-1 p-3 md:p-8 bg-background min-h-screen">
      <div className="max-w-[1400px] mx-auto w-full mb-4 md:mb-6 mt-1 md:mt-2">
        {}
        <div className="flex md:hidden flex-col gap-2.5">
          {}
          <div className="flex items-center gap-2">
            {showNavArrows && (
              <div className="flex items-center gap-1 shrink-0">
                <Button variant="outline" size="icon" onClick={handlePrev} className="rounded-full h-9 w-9">
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={handleNext} className="rounded-full h-9 w-9">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
            {viewMode !== "list" ? (
              <Popover open={isMobileCalendarOpen} onOpenChange={setIsMobileCalendarOpen}>
                <PopoverTrigger asChild>
                  <button className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-border hover:bg-accent transition-colors flex-1 min-w-0">
                    <CalendarIcon className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    <span className="text-xs font-semibold text-foreground capitalize truncate">{viewTitle}</span>
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="center">
                  <Calendar mode="single" selected={selectedDate} onSelect={handleMobileDateSelect} initialFocus className="p-3" />
                </PopoverContent>
              </Popover>
            ) : (
              <span className="flex-1 text-sm font-bold text-foreground truncate">{viewTitle}</span>
            )}
            <div className="flex items-center gap-1 shrink-0">
              {viewMode === "day" && (
                <Button variant="outline" size="icon" onClick={handleExportCSV} className="rounded-full h-9 w-9">
                  <Download className="w-4 h-4" />
                </Button>
              )}
              <ReservationModal defaultValues={{ courtId: defaultCourtId }} />
            </div>
          </div>
          {}
          <ViewToggle value={viewMode} onChange={setViewMode} />
        </div>
        {}
        <div className="hidden md:flex flex-row items-center justify-between gap-4">
          {}
          <div className="flex items-center gap-3">
            {showNavArrows ? (
              <DateNavigation
                title={viewTitle}
                onPrev={handlePrev}
                onNext={handleNext}
                onToday={actions.today}
              />
            ) : (
              <h2 className="text-2xl font-bold tracking-tight text-foreground capitalize">{viewTitle}</h2>
            )}
            {viewMode !== "list" && (
              <Popover open={isDesktopCalendarOpen} onOpenChange={setIsDesktopCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="h-10 px-4 rounded-full font-medium border-border hover:bg-accent shadow-sm">
                    <CalendarIcon className="w-4 h-4 mr-2 text-muted-foreground" />
                    {formatShortDate(selectedDate)}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={selectedDate} onSelect={handleDesktopDateSelect} initialFocus className="p-3" />
                </PopoverContent>
              </Popover>
            )}
          </div>
          {}
          <div className="flex items-center gap-3">
            <ViewToggle value={viewMode} onChange={setViewMode} />
            {viewMode === "day" && (
              <Button variant="outline" onClick={handleExportCSV} className="rounded-full border-border">
                <Download className="w-4 h-4 mr-2" />
                {t("reservations.export_csv")}
              </Button>
            )}
            <ReservationModal defaultValues={{ courtId: defaultCourtId }} />
          </div>
        </div>
      </div>
      {}
      <div className="max-w-[1400px] mx-auto w-full anim-fade-up">
        {viewMode === "day" && (
          <GridTimeline<ScheduleGridItem>
            className="border-border shadow-sm"
            headers={scheduleData.grid}
            hours={hours}
            renderHeader={renderCourtHeader}
            renderTabLabel={renderCourtTabLabel}
            renderSlot={renderScheduleSlot}
          />
        )}
        {viewMode === "week" && (
          <WeekView
            weekData={weekData}
            hours={hours}
            onDayClick={handleDayClickFromMonth}
          />
        )}
        {viewMode === "month" && (
          <MonthView
            selectedDate={selectedDate}
            monthDays={monthDays}
            daySummary={daySummary}
            onDayClick={handleDayClickFromMonth}
          />
        )}
        {viewMode === "list" && (
          <ListView
            bookings={bookings}
            selectedDate={selectedDate}
          />
        )}
      </div>
    </div>
  )
}
