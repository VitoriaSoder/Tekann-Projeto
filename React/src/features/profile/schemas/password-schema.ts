import { z } from "zod"

export const passwordSchema = z.object({
  currentPassword: z.string().min(6, { message: "profile:security.current_password_hint" }),
  newPassword: z.string().min(6, { message: "profile:security.new_password_hint" }),
  confirmPassword: z.string().min(6, { message: "profile:security.confirm_password_hint" }),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "error:passwords_mismatch",
  path: ["confirmPassword"],
})
export type PasswordFormData = z.infer<typeof passwordSchema>
