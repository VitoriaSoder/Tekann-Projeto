import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { quadraSchema, QuadraFormData } from "@/features/quadras/schemas/quadraSchema"
export function useCourtForm() {
  const form = useForm<QuadraFormData>({
    resolver: zodResolver(quadraSchema) as any,
    defaultValues: {
      name: "",
      type: undefined,
      region: "",
      capacity: 2,
      openingTime: "08:00",
      closingTime: "22:00",
      slotDuration: 60,
    },
  })
  const onSubmit = (data: QuadraFormData) => {
    console.log("Court form data:", data)
  }
  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
  }
}
