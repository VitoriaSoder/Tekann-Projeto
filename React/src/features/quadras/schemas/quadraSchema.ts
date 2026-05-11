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
  { label: "Padel", value: "Padel" },
  { label: "Tênis", value: "Tennis" },
  { label: "Beach Tennis", value: "Beach Tennis" },
  { label: "Futebol", value: "soccer" },
  { label: "Basquete", value: "Basketball" },
  { label: "Vôlei", value: "Volleyball" },
  { label: "Pickleball", value: "Pickleball" },
]

export const quadraSchema = z.object({
  name: z.string().min(3, { message: "O nome deve ter pelo menos 3 caracteres." }),
  type: z.enum(COURT_TYPE_VALUES, {
    message: "Selecione um tipo de quadra válido.",
  }),
  region: z.string().min(2, { message: "Informe a região da quadra." }),
  capacity: z.coerce.number().min(1, { message: "A capacidade deve ser pelo menos 1 pessoa." }),
  openingTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Formato inválido. Use HH:mm."),
  closingTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Formato inválido. Use HH:mm."),
  slotDuration: z.coerce.number().min(30, { message: "Mínimo 30 minutos." }),
}).refine(data => data.openingTime < data.closingTime, {
  message: "O horário de abertura deve ser anterior ao de fechamento.",
  path: ["closingTime"],
})
export type QuadraFormData = z.infer<typeof quadraSchema>
