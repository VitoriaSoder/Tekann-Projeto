import { z } from "zod"
import { quadraSchema } from "../../quadras/schemas/quadraSchema"
export const SlotStatusEnum = z.enum(["AVAILABLE", "OCCUPIED"])
export const scheduleSlotSchema = z.object({
  id: z.string(),
  time: z.string(),

  status: SlotStatusEnum,
  price: z.number().optional(),
})
export const scheduleGridItemSchema = z.object({
  courtId: z.string(),
  courtName: z.string(),
  courtType: quadraSchema.shape.type,
  slots: z.array(scheduleSlotSchema),
})
export const scheduleDaySchema = z.object({
  date: z.date(),
  grid: z.array(scheduleGridItemSchema),
})
export type SlotStatus = z.infer<typeof SlotStatusEnum>
export type ScheduleSlot = z.infer<typeof scheduleSlotSchema>
export type ScheduleGridItem = z.infer<typeof scheduleGridItemSchema>
export type ScheduleDay = z.infer<typeof scheduleDaySchema>
