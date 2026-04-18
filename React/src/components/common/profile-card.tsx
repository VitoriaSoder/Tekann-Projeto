import { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { Heading } from "./heading"
import { Text } from "./text"

export interface ProfileCardProps {
  variant?: "light" | "dark"
  icon?: ReactNode
  title?: string
  tKey?: string
  features: { title?: string; titleKey?: string; description?: string; descriptionKey?: string }[]
  className?: string
}

export function ProfileCard({
  variant = "light",
  icon,
  title,
  tKey,
  features,
  className,
}: ProfileCardProps) {
  const isDark = variant === "dark"
  return (
    <div
      className={cn(
        "relative rounded-[40px] p-10 overflow-hidden transition-all duration-300",
        isDark
          ? "bg-black text-white shadow-[0_24px_48px_rgba(0,0,0,0.15)]"
          : "bg-card border border-border shadow-[0_12px_36px_rgba(0,0,0,0.03)]",
        className
      )}
    >
      {isDark && (
        <div className="absolute -top-12 -right-12 w-[200px] h-[200px] bg-primary blur-[80px] opacity-30 pointer-events-none" />
      )}
      <div className="relative z-10">
        <div
          className={cn(
            "w-14 h-14 rounded-full flex items-center justify-center mb-6",
            isDark ? "bg-primary text-black" : "bg-black text-white"
          )}
        >
          {icon}
        </div>
        <Heading level={3} tKey={tKey} className={cn("font-semibold text-2xl mb-6", isDark ? "text-white" : "text-foreground")}>
          {title}
        </Heading>
        <div className="flex flex-col gap-4">
          {features.map((feature, idx) => (
            <div key={idx} className="flex gap-4 items-start">
              <div
                className={cn(
                  "mt-1 rounded-full p-1 border",
                  isDark
                    ? "bg-primary/20 text-primary border-transparent"
                    : "bg-primary text-black border-transparent"
                )}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div>
                <Text variant="bold" tKey={feature.titleKey} className={cn("font-semibold", isDark ? "text-white" : "text-foreground")}>
                  {feature.title}
                </Text>
                <Text
                  variant="muted"
                  tKey={feature.descriptionKey}
                  className={cn(
                    "text-sm mt-1",
                    isDark ? "text-white/60" : "text-muted-foreground"
                  )}
                >
                  {feature.description}
                </Text>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

