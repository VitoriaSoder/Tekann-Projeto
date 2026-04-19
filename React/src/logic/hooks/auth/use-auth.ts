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
function resolveErrorMessage(error: any): string {
  if (!error) return "Erro desconhecido."
  if (error.data?.errors) {
    const first = Object.values(error.data.errors as Record<string, string[]>)[0]
    if (Array.isArray(first) && first.length > 0) return first[0]
  }
  if (error.data?.msg) return error.data.msg
  if (error.msg) return error.msg
  if (error.status === 0) return "Não foi possível conectar ao servidor."
  if (error.status === 400) return "Dados inválidos. Verifique os campos e tente novamente."
  if (error.status === 401) return "Credenciais inválidas."
  if (error.status === 409) return "E-mail já cadastrado."
  if (error.status === 500) return "Erro interno no servidor. Tente novamente mais tarde."
  return "Erro na requisição."
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
      toast.success(`Bem-vindo de volta, ${result.user.name}!`)
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
      toast.success(`Conta criada com sucesso! Bem-vindo, ${result.user.name}!`)
      navigate("/dashboard")
    })
  }
  return {
    form,
    isLoading,
    onSubmit: form.handleSubmit(onSubmit),
  }
}
