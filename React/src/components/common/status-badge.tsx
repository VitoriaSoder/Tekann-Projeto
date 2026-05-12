import { cn } from "@/lib/utils"

export type GlobalStatus = 
  | "ACTIVE" 
  | "INACTIVE" 
  | "AVAILABLE" 
  | "OCCUPIED" 
  | "CANCELLED" 
  | "ADMIN" 
  | "PENDING"
  | "PARTIAL"

export type StatusBadgeProps = {
  status: GlobalStatus
  className?: string
  children?: React.ReactNode
}

export function StatusBadge({ status, className, children }: StatusBadgeProps) {
  
  const getStatusStyles = () => {
    switch (status) {
      case "ACTIVE":
      case "AVAILABLE":
        return "bg-primary text-black border-primary"
      case "INACTIVE":
      case "OCCUPIED":
      case "CANCELLED":
        return "bg-destructive text-destructive-foreground border-destructive"
      case "PENDING":
      case "PARTIAL":
        return "bg-amber-500 text-black border-amber-500"
      case "ADMIN":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      default:
        return "bg-secondary text-secondary-foreground border-transparent"
    }
  }

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider transition-colors",
        getStatusStyles(),
        className
      )}
    >
      {children}
    </div>
  )
}
