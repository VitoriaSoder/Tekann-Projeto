import { cn } from "@/lib/utils"
import { useTranslation } from "react-i18next"

export type StatusBadgeProps = {
  status: "AVAILABLE" | "OCCUPIED" | "ADMIN"
  className?: string
  children?: React.ReactNode
}

export function StatusBadge({ status, className, children }: StatusBadgeProps) {
  const { t } = useTranslation()
  
  const getStatusLabel = () => {
    switch (status) {
      case "AVAILABLE": return t("common:available")
      case "OCCUPIED": return t("common:occupied")
      case "ADMIN": return t("common:admin")
      default: return status
    }
  }

  return (
    <div
      className={cn(
        "font-semibold text-xs uppercase px-3 py-1.5 rounded-full inline-flex items-center justify-center",
        status === "AVAILABLE" && "bg-primary text-primary-foreground",
        status === "OCCUPIED" && "bg-destructive/10 text-destructive border border-destructive/20",
        status === "ADMIN" && "bg-blue-500/10 text-blue-500 border border-blue-500/20",
        className
      )}
    >
      {children || getStatusLabel()}
    </div>
  )
}
