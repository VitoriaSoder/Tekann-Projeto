import { ScheduleGridItem } from "@/features/schedule/schemas/schedule-schema"
import { formatShortDate } from "./date-utils"

export type ExportableScheduleItem = {
  Court: string
  Time: string
  Date: string
  Status: string
}

export function prepareScheduleDataForExport(
  grid: { courtName: string; slots: { time: string; status: string }[] }[],
  selectedDate: Date,
  locale: any
): ExportableScheduleItem[] {
  return grid.flatMap(court =>
    court.slots
      .filter(slot => slot.status === "OCCUPIED")
      .map(slot => ({
        Court: court.courtName,
        Time: slot.time,
        Date: formatShortDate(selectedDate, locale),
        Status: slot.status,
      }))
  )
}
