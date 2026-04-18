import * as React from "react"
import { cn } from "@/lib/utils"
export interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {}
export const Box = React.forwardRef<HTMLDivElement, BoxProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("block", className)}
        {...props}
      />
    )
  }
)
Box.displayName = "Box"
