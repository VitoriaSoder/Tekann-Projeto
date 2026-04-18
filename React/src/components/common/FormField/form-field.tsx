import { useState } from "react"
import { useTranslation } from "react-i18next"
import { UseFormRegister, FieldValues, Path } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from "lucide-react"

export interface FormFieldProps<T extends FieldValues> {
  label?: string
  labelKey?: string
  name: Path<T>
  type: "text" | "select" | "time" | "email" | "password"
  options?: { label: string; value: string }[]
  error?: string
  register: UseFormRegister<T>
  placeholder?: string
  placeholderKey?: string
}

export function FormField<T extends FieldValues>({
  label,
  labelKey,
  name,
  type,
  options,
  error,
  register,
  placeholder,
  placeholderKey,
}: FormFieldProps<T>) {
  const { t } = useTranslation()
  const [showPassword, setShowPassword] = useState(false)
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const isPassword = type === "password"
  const inputType = isPassword ? (showPassword ? "text" : "password") : type

  const displayLabel = labelKey ? t(labelKey) : label
  const displayPlaceholder = placeholderKey ? t(placeholderKey) : placeholder

  return (
    <div className="flex flex-col space-y-2.5">
      {displayLabel && (
        <Label htmlFor={name} className="font-bold text-xs uppercase tracking-widest text-muted-foreground">
          {displayLabel}
        </Label>
      )}
      <div className="relative group">
        {type === "select" ? (
          <select
            id={name}
            {...register(name)}
            className="flex h-14 w-full items-center justify-between rounded-2xl border border-border bg-muted/50 px-5 py-2 text-sm transition-all focus:bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 text-foreground font-medium appearance-none"
          >
            {displayPlaceholder && (
              <option value="" disabled hidden>
                {displayPlaceholder}
              </option>
            )}
            {options?.map((option) => (
              <option key={option.value} value={option.value} className="bg-card">
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <div className="relative">
            <Input
              id={name}
              type={inputType}
              placeholder={displayPlaceholder}
              {...register(name)}
              className="h-14 rounded-2xl border-border bg-muted/50 px-5 text-sm transition-all focus:bg-card focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-0 focus-visible:border-primary text-foreground font-medium placeholder:text-muted-foreground/50"
            />
            {isPassword && (
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-foreground transition-colors"
                aria-label={showPassword ? t("auth:hide_password") : t("auth:show_password")}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            )}
          </div>
        )}
      </div>
      {error && (
        <p className="text-[11px] font-bold text-destructive uppercase tracking-wider pl-1">{error}</p>
      )}
    </div>
  )
}

