import { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { Box } from "./box"
import { Heading } from "./heading"
import { Text } from "./text"

interface PageLayoutProps {
  children: ReactNode
  titleKey?: string
  descriptionKey?: string
  title?: string
  description?: string
  className?: string
  maxWidth?: "sm" | "md" | "lg" | "xl" | "full"
  actions?: ReactNode
}

export function PageLayout({
  children,
  titleKey,
  descriptionKey,
  title,
  description,
  className,
  maxWidth = "lg",
  actions
}: PageLayoutProps) {
  const maxW = {
    sm: "max-w-[800px]",
    md: "max-w-[1000px]",
    lg: "max-w-[1200px]",
    xl: "max-w-[1400px]",
    full: "max-w-full"
  }

  return (
    <Box className={cn("relative p-5 md:p-8 lg:p-12 mx-auto w-full min-h-screen", maxW[maxWidth], className)}>
      <Box className="mb-8 md:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6">
        <Box>
          <Heading level={1} tKey={titleKey} className="text-xl md:text-3xl font-extrabold tracking-tight text-foreground m-0">
            {title}
          </Heading>
          {(descriptionKey || description) && (
            <Text variant="muted" tKey={descriptionKey} className="mt-1 text-sm md:text-base">
              {description}
            </Text>
          )}
        </Box>
        {actions && <Box className="flex-shrink-0">{actions}</Box>}
      </Box>
      {children}
    </Box>
  )
}
