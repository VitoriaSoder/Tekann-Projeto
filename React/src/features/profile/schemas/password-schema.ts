import { z } from "zod"
export const passwordSchema = z.object({
  currentPassword: z.string().min(6, { message: "Informe a senha atual." }),
  newPassword: z.string().min(6, { message: "A nova senha deve ter pelo menos 6 caracteres." }),
  confirmPassword: z.string().min(6, { message: "Confirme a nova senha." }),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "As senhas não coincidem.",
  path: ["confirmPassword"],
})
export type PasswordFormData = z.infer<typeof passwordSchema>
