import { z } from "zod"

export const COURT_TYPE_VALUES = [
  "Padel",
  "Tennis",
  "Beach Tennis",
  "soccer",
  "Basketball",
  "Volleyball",
  "Pickleball",
] as const

export type CourtTypeValue = (typeof COURT_TYPE_VALUES)[number]

export const COURT_TYPE_SELECT_OPTIONS: { label: string; value: CourtTypeValue }[] = [
  { label: "courts:padel", value: "Padel" },
  { label: "courts:tennis", value: "Tennis" },
  { label: "courts:beach_tennis", value: "Beach Tennis" },
  { label: "courts:football", value: "soccer" },
  { label: "courts:basketball", value: "Basketball" },
  { label: "courts:volleyball", value: "Volleyball" },
  { label: "courts:pickleball", value: "Pickleball" },
]

export const quadraSchema = z.object({
  name: z.string().min(3, { message: "error:court_name_min_length" }),
  type: z.enum(COURT_TYPE_VALUES, {
    message: "error:court_type_invalid",
  }),
  region: z.string().min(2, { message: "error:court_region_required" }),
  capacity: z.coerce.number().min(1, { message: "error:court_capacity_min" }),
  openingTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "error:court_time_invalid"),
  closingTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "error:court_time_invalid"),
  slotDuration: z.coerce.number().min(30, { message: "error:court_slot_min" }),
}).refine(data => data.openingTime < data.closingTime, {
  message: "error:court_time_logic",
  path: ["closingTime"],
})
export type QuadraFormData = z.infer<typeof quadraSchema>
