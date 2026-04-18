import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  iconClassName?: string
  textClassName?: string
  showText?: boolean
  size?: number | string
}

export function Logo({ 
  className, 
  iconClassName, 
  textClassName, 
  showText = true,
  size = 24 
}: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2 group cursor-pointer", className)}>
      <div className={cn(
        "flex items-center justify-center rounded-full bg-primary text-black shadow-sm transition-transform group-hover:scale-105",
        iconClassName
      )}
      style={{ width: `calc(${size}px * 1.5)`, height: `calc(${size}px * 1.5)` }}
      >
        <svg 
          width={size} 
          height={size} 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <line x1="3" y1="9" x2="21" y2="9" />
          <line x1="9" y1="21" x2="9" y2="9" />
          <line x1="15" y1="21" x2="15" y2="9" />
        </svg>
      </div>
      {showText && (
        <span className={cn("font-bold tracking-tight uppercase text-foreground", textClassName)}>
          SportsCourt
        </span>
      )}
    </div>
  )
}
