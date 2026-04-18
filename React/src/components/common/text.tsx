import { ReactNode } from "react"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"

export interface TextProps {
  variant?: "default" | "muted" | "small" | "large" | "bold"
  children?: ReactNode
  tKey?: string | (string | number)[]
  tValues?: Record<string, any>
  className?: string
  as?: "p" | "span" | "div"
}

export function Text({
  variant = "default",
  children,
  tKey,
  tValues,
  className,
  as: Component = "p",
}: TextProps) {
  const { t } = useTranslation()
  const variants = {
    default: "text-base leading-relaxed text-foreground",
    muted: "text-muted-foreground font-medium text-sm leading-relaxed",
    small: "text-sm text-muted-foreground",
    large: "text-lg font-medium text-foreground",
    bold: "font-bold text-foreground",
  }

  const renderContent = () => {
    if (Array.isArray(tKey)) {
      return tKey
        .map((part) => {
          if (typeof part === "string" && part.includes(":")) {
            return t(part, tValues)
          }
          return part
        })
        .join(" ")
    }
    if (tKey) return t(tKey as string, tValues)
    return children
  }

  return (
    <Component className={cn(variants[variant], className)}>
      {renderContent()}
    </Component>
  )
}

