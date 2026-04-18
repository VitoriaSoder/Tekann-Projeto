import { z } from "zod"
export const reservationStatusSchema = z.enum(["CONFIRMED", "PENDING", "CANCELLED"])
export const reservationSchema = z.object({
  id: z.string().optional(),
  courtId: z.string().min(1, "É obrigatório selecionar uma quadra."),
  date: z.date({ message: "A data da reserva é obrigatória." }),
  clientName: z.string().min(3, "O nome do cliente deve possuir no mínimo 3 caracteres."),
  startTime: z.string().regex(/^([01]\d|2[0-3]):?([0-5]\d)$/, "Hora de início inválida. Use formato HH:mm."),
  endTime: z.string().regex(/^([01]\d|2[0-3]):?([0-5]\d)$/, "Hora de término inválida. Use formato HH:mm."),
  status: reservationStatusSchema.default("CONFIRMED"),
}).refine(
  (data) => {
    return data.startTime < data.endTime
  },
  {
    message: "A hora de início deve ser anterior a hora de término.",
    path: ["endTime"],
  }
)
export type ReservationStatus = z.infer<typeof reservationStatusSchema>
export type ReservationFormData = z.infer<typeof reservationSchema>
export type Reservation = Omit<ReservationFormData, "id"> & { id: string }
