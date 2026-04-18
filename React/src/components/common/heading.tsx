import { ReactNode } from "react"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"

export interface HeadingProps {
  level?: 1 | 2 | 3 | 4 | 5 | 6
  variant?: "hero" | "section-title" | "section-heading" | "default"
  children?: ReactNode
  tKey?: string
  className?: string
}

export function Heading({
  level = 2,
  variant = "default",
  children,
  tKey,
  className,
}: HeadingProps) {
  const { t } = useTranslation()
  const Component = `h${level}` as React.ElementType
  const variants = {
    hero: "font-medium text-[clamp(48px,6vw,72px)] leading-[1.05] tracking-tight",
    "section-title": "font-semibold text-sm text-neutral-500 uppercase tracking-widest mb-2",
    "section-heading": "font-semibold text-4xl tracking-tight mb-12 leading-[1.1]",
    default: "font-semibold text-2xl tracking-tight",
  }

  return (
    <Component className={cn(variants[variant], className)}>
      {tKey ? t(tKey) : children}
    </Component>
  )
}

