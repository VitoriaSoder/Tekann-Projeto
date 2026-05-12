import { z } from "zod"

export const profileSchema = z.object({
  name: z.string().min(3, { message: "error:name_min_length" }),
})
export type ProfileFormData = z.infer<typeof profileSchema>
