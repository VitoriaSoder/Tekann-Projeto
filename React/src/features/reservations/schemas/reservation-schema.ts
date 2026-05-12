import { z } from "zod"
import i18n from "@/lib/i18n"

export const reservationStatusSchema = z.enum(["CONFIRMED", "PENDING", "CANCELLED"])
export const reservationSchema = z.object({
  id: z.string().optional(),
  courtId: z.string().min(1, i18n.t("reservations:court_name_required")),
  date: z.date({ message: i18n.t("reservations:date_required") }),
  clientName: z.string().min(3, i18n.t("reservations:client_name_required")),
  startTime: z.string().regex(/^([01]\d|2[0-3]):?([0-5]\d)$/, i18n.t("reservations:invalid_start_time")),
  endTime: z.string().regex(/^([01]\d|2[0-3]):?([0-5]\d)$/, i18n.t("reservations:invalid_end_time")),
  status: reservationStatusSchema.default("CONFIRMED"),
}).refine(
  (data) => {
    return data.startTime < data.endTime
  },
  {
    message: i18n.t("reservations:invalid_time_order"),
    path: ["endTime"],
  }
)
export type ReservationStatus = z.infer<typeof reservationStatusSchema>
export type ReservationFormData = z.infer<typeof reservationSchema>
export type Reservation = Omit<ReservationFormData, "id"> & { id: string }
