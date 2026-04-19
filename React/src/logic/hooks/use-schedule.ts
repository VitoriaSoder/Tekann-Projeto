import { useState, useCallback, useEffect, useMemo } from "react"
import {
  addDays, subDays, format, addWeeks, subWeeks, addMonths, subMonths,
  startOfWeek, eachDayOfInterval, startOfMonth, endOfMonth, getDay
} from "date-fns"
import { useDispatch, useSelector } from "react-redux"
import type { RootState, AppDispatch } from "../store"
import { ScheduleDay } from "../../features/schedule/schemas/schedule-schema"
import { generateTimeSlots } from "../../helpers/date-utils"
import { getCourtsWorker } from "../workers/court-worker"
import { getBookingsWorker } from "../workers/booking-worker"
export function useSchedule() {
  const dispatch = useDispatch<AppDispatch>()
  const courts = useSelector((s: RootState) => s.courts.lista)
  const bookings = useSelector((s: RootState) => s.bookings.lista)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  useEffect(() => {
    getCourtsWorker(dispatch)
    getBookingsWorker(dispatch)
  }, [])
  const hours = useMemo(() => generateTimeSlots(8, 22, 60), [])
  const scheduleData: ScheduleDay = useMemo(() => {
    const dateStr = format(selectedDate, "yyyy-MM-dd")
    const dayBookings = bookings.filter(b => b.date && b.date.startsWith(dateStr))
    return {
      date: selectedDate,
      grid: courts.map(court => ({
        courtId: court.id,
        courtName: court.name,
        courtType: court.type as any,
        slots: hours.map(hour => {
          const isOccupied = dayBookings.some(
            b => b.courtId === court.id && b.startTime <= hour && b.endTime > hour
          )
          return { id: `${court.id}-${hour}`, time: hour, status: isOccupied ? ("OCCUPIED" as const) : ("AVAILABLE" as const) }
        }),
      })),
    }
  }, [courts, bookings, selectedDate, hours])
  const weekDays = useMemo(() => {
    const start = startOfWeek(selectedDate, { weekStartsOn: 1 })
    return eachDayOfInterval({ start, end: addDays(start, 6) })
  }, [selectedDate])
  const weekData: ScheduleDay[] = useMemo(() => {
    return weekDays.map(day => {
      const dateStr = format(day, "yyyy-MM-dd")
      const dayBookings = bookings.filter(b => b.date && b.date.startsWith(dateStr))
      return {
        date: day,
        grid: courts.map(court => ({
          courtId: court.id,
          courtName: court.name,
          courtType: court.type as any,
          slots: hours.map(hour => {
            const isOccupied = dayBookings.some(
              b => b.courtId === court.id && b.startTime <= hour && b.endTime > hour
            )
            return { id: `${court.id}-${dateStr}-${hour}`, time: hour, status: isOccupied ? ("OCCUPIED" as const) : ("AVAILABLE" as const) }
          }),
        })),
      }
    })
  }, [courts, bookings, weekDays, hours])
  const monthDays = useMemo(() => {
    const start = startOfMonth(selectedDate)
    const end = endOfMonth(selectedDate)
    const days = eachDayOfInterval({ start, end })
    const firstDayOfWeek = (getDay(start) + 6) % 7
    const padding: (Date | null)[] = Array(firstDayOfWeek).fill(null)
    return [...padding, ...days] as (Date | null)[]
  }, [selectedDate])
  const daySummary = useMemo(() => {
    const map = new Map<string, { occupied: number; available: number; total: number }>()
    monthDays.forEach(day => {
      if (!day) return
      const dateStr = format(day, "yyyy-MM-dd")
      const dayBookings = bookings.filter(b => b.date && b.date.startsWith(dateStr))
      let occupied = 0
      let available = 0
      courts.forEach(court => {
        hours.forEach(hour => {
          const isOccupied = dayBookings.some(
            b => b.courtId === court.id && b.startTime <= hour && b.endTime > hour
          )
          if (isOccupied) { occupied++ } else { available++ }
        })
      })
      if (occupied + available > 0) {
        map.set(dateStr, { occupied, available, total: occupied + available })
      }
    })
    return map
  }, [courts, bookings, monthDays, hours])
  const handleNextDay = useCallback(() => setSelectedDate(prev => addDays(prev, 1)), [])
  const handlePrevDay = useCallback(() => setSelectedDate(prev => subDays(prev, 1)), [])
  const handleToday = useCallback(() => setSelectedDate(new Date()), [])
  const handleDateSelect = useCallback((date: Date) => setSelectedDate(date), [])
  const handleNextWeek = useCallback(() => setSelectedDate(prev => addWeeks(prev, 1)), [])
  const handlePrevWeek = useCallback(() => setSelectedDate(prev => subWeeks(prev, 1)), [])
  const handleNextMonth = useCallback(() => setSelectedDate(prev => addMonths(prev, 1)), [])
  const handlePrevMonth = useCallback(() => setSelectedDate(prev => subMonths(prev, 1)), [])
  return {
    selectedDate,
    scheduleData,
    weekData,
    weekDays,
    monthDays,
    daySummary,
    hours,
    bookings,
    actions: {
      nextDay: handleNextDay,
      prevDay: handlePrevDay,
      today: handleToday,
      selectDate: handleDateSelect,
      nextWeek: handleNextWeek,
      prevWeek: handlePrevWeek,
      nextMonth: handleNextMonth,
      prevMonth: handlePrevMonth,
    },
  }
}
