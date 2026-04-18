import * as React from "react"
import { cn } from "@/lib/utils"
export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType
}
export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, as: Component = "div", ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn("w-full max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8", className)}
        {...props}
      />
    )
  }
)
Container.displayName = "Container"
