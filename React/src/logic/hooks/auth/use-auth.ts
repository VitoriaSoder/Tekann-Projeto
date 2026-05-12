import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { toast } from "sonner"
import {
  loginSchema,
  LoginFormData,
  registerSchema,
  RegisterFormData,
} from "@/features/auth/schemas/authSchema"
import { authLogin, authRegister } from "@/services/api"
import { setCookie } from "@/helpers/cookie-utils"
import { setAuth } from "@/logic/store/slices/auth-slice"
import { useAppDispatch } from "@/logic/store/hooks"
import i18n from "@/lib/i18n"

function resolveErrorMessage(error: any): string {
  if (!error) return i18n.t("error:unknown_error")
  if (error.data?.errors) {
    const first = Object.values(error.data.errors as Record<string, string[]>)[0]
    if (Array.isArray(first) && first.length > 0) return first[0]
  }
  if (error.data?.msg) return error.data.msg
  if (error.msg) return error.msg
  if (error.status === 0) return i18n.t("error:network_error")
  if (error.status === 400) return i18n.t("error:invalid_data")
  if (error.status === 401) return i18n.t("error:invalid_credentials")
  if (error.status === 409) return i18n.t("error:email_taken")
  if (error.status === 500) return i18n.t("error:internal_error")
  return i18n.t("error:request_error")
}
export function useAuthLogin() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })
  const onSubmit = (data: LoginFormData) => {
    setIsLoading(true)
    authLogin({ email: data.email, password: data.password }, function (result, error) {
      setIsLoading(false)
      if (error) {
        toast.error(resolveErrorMessage(error))
        return
      }
      setCookie("token", result.token, 8)
      dispatch(setAuth({ user: result.user, token: result.token }))
      toast.success(i18n.t("success:welcome_back", { name: result.user.name }))
      navigate("/dashboard")
    })
  }
  return {
    form,
    isLoading,
    onSubmit: form.handleSubmit(onSubmit),
  }
}
export function useAuthRegister() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "USER",
      password: "",
      confirmPassword: "",
    },
  })
  const onSubmit = (data: RegisterFormData) => {
    setIsLoading(true)
    authRegister({ name: data.name, email: data.email, password: data.password, role: data.role }, function (result, error) {
      setIsLoading(false)
      if (error) {
        toast.error(resolveErrorMessage(error))
        return
      }
      setCookie("token", result.token, 8)
      dispatch(setAuth({ user: result.user, token: result.token }))
      toast.success(i18n.t("success:account_created", { name: result.user.name }))
      navigate("/dashboard")
    })
  }
  return {
    form,
    isLoading,
    onSubmit: form.handleSubmit(onSubmit),
  }
}
