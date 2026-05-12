import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email({ message: "error:invalid_email" }),
  password: z.string().min(6, { message: "error:password_min_length" }),
})
export type LoginFormData = z.infer<typeof loginSchema>
export const registerSchema = z.object({
  name: z.string().min(3, { message: "error:name_min_length" }),
  email: z.string().email({ message: "error:invalid_email" }),
  role: z.enum(["USER", "ADMIN"], { message: "error:account_type_required" }),
  password: z.string().min(6, { message: "error:password_min_length" }),
  confirmPassword: z.string().min(6, { message: "error:password_min_length" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "error:passwords_mismatch",
  path: ["confirmPassword"],
})
export type RegisterFormData = z.infer<typeof registerSchema>
