import React, { useEffect, useState } from "react"
import { format } from "date-fns"
import { getBookingsByCourtAndDateWorker } from "@/logic/workers/booking-worker"
import { generateTimeSlots } from "@/helpers/date-utils"
import { cn } from "@/lib/utils"
import { Clock, Info } from "lucide-react"
import { Heading } from "./heading"
import { Text } from "./text"
import { Box } from "./box"

interface TimeSlotPickerProps {
  courtId: string
  date: Date
  selectedTime: string
  onTimeSelect: (startTime: string, endTime: string) => void
  slotDuration?: number

}

export function TimeSlotPicker({ 
  courtId, 
  date, 
  selectedTime, 
  onTimeSelect, 
  slotDuration = 60 
}: TimeSlotPickerProps) {
  const [busySlots, setBusySlots] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const hours = generateTimeSlots(8, 22, slotDuration)

  useEffect(() => {
    if (courtId && date) {
      setLoading(true)
      const dateStr = format(date, "yyyy-MM-dd")
      getBookingsByCourtAndDateWorker(courtId, dateStr, (bookings) => {
        setBusySlots(bookings)
        setLoading(false)
      })
    }
  }, [courtId, date])

  const isOccupied = (time: string) => {
    return busySlots.some(b => b.startTime.substring(0, 5) <= time && b.endTime.substring(0, 5) > time)
  }

  const handleSlotClick = (time: string) => {
    if (isOccupied(time)) return
    const [h, m] = time.split(":").map(Number)
    const end = new Date(0, 0, 0, h, m + slotDuration)
    const endTime = format(end, "HH:mm")
    onTimeSelect(time, endTime)
  }

  return (
    <Box className="space-y-4">
      <Box className="flex items-center justify-between">
        <Box className="flex items-center gap-2">
          <Clock size={16} className="text-primary" />
          <Heading level={4} tKey="reservations:available_times" className="text-sm font-extrabold text-foreground m-0" />
        </Box>
        <Box className="flex items-center gap-3">
          <Box className="flex items-center gap-1.5">
            <Box className="w-2.5 h-2.5 rounded-full bg-primary" />
            <Text variant="small" tKey="reservations:free" className="font-black uppercase tracking-widest text-muted-foreground text-[9px]" />
          </Box>
          <Box className="flex items-center gap-1.5">
            <Box className="w-2.5 h-2.5 rounded-full bg-destructive/40" />
            <Text variant="small" tKey="reservations:occupied" className="font-black uppercase tracking-widest text-muted-foreground text-[9px]" />
          </Box>
        </Box>
      </Box>

      <Box className="grid grid-cols-4 sm:grid-cols-6 gap-2">
        {hours.map((hour) => {
          const occupied = isOccupied(hour)
          const selected = selectedTime === hour
          return (
            <button
              key={hour}
              type="button"
              disabled={occupied}
              onClick={() => handleSlotClick(hour)}
              className={cn(
                "h-10 rounded-xl text-xs font-bold transition-all border flex items-center justify-center relative overflow-hidden",
                occupied
                  ? "bg-destructive/5 border-destructive/10 text-destructive/40 cursor-not-allowed"
                  : selected
                  ? "bg-primary text-black border-primary shadow-lg scale-[1.05] z-10"
                  : "bg-muted/30 border-border text-foreground hover:border-primary/50 hover:bg-primary/5 hover:scale-[1.02]"
              )}
            >
              {hour}
              {occupied && (
                <Box className="absolute inset-0 flex items-center justify-center rotate-45 pointer-events-none">
                   <Box className="w-full h-[1px] bg-destructive/20" />
                </Box>
              )}
            </button>
          )
        })}
      </Box>

      {loading && (
        <Text tKey="reservations:syncing" className="text-center text-[10px] text-muted-foreground animate-pulse font-bold" />
      )}

      {!loading && busySlots.length > 0 && (
        <Box className="flex items-start gap-2.5 p-4 rounded-2xl bg-muted/30 border border-border mt-2">
          <Info size={14} className="text-primary mt-0.5 shrink-0" />
          <Text variant="muted" tKey="reservations:occupied_slots_info" className="text-[11px] leading-relaxed font-medium" />
        </Box>
      )}
    </Box>
  )
}

