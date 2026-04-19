import { cn } from "@/lib/utils"
import { Heading } from "./heading"
import { Text } from "./text"

interface SectionHeaderProps {
  title1Key?: string
  title2Key?: string
  subtitleKey?: string
  title1?: string
  title2?: string
  subtitle?: string
  align?: "center" | "start"
  className?: string
  highlightColor?: "primary" | "muted"
}

export function SectionHeader({
  title1Key,
  title2Key,
  subtitleKey,
  title1,
  title2,
  subtitle,
  align = "center",
  className,
  highlightColor = "primary"
}: SectionHeaderProps) {
  return (
    <div className={cn(
      "flex flex-col mb-16 md:mb-20 max-w-4xl", 
      align === "center" ? "items-center text-center mx-auto" : "items-start",
      className
    )}>
      <Heading level={2} className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-6 uppercase">
        {title1Key ? (
          <Text as="span" variant="inherit" tKey={title1Key} />
        ) : title1}
        {" "}
        {title2Key ? (
          <Text 
            as="span" 
            variant="none"
            tKey={title2Key} 
            className={highlightColor === "primary" ? "text-primary" : "text-muted-foreground"} 
          />
        ) : title2 ? (
          <span className={highlightColor === "primary" ? "text-primary" : "text-muted-foreground"}>
            {title2}
          </span>
        ) : null}
      </Heading>
      {(subtitleKey || subtitle) && (
        <Text 
          variant="large" 
          tKey={subtitleKey} 
          className="md:text-xl font-medium max-w-2xl leading-relaxed"
        >
          {subtitle}
        </Text>
      )}
    </div>
  )
}
