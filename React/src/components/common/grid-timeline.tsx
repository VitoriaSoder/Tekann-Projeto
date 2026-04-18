import React, { useState } from "react"
import { cn } from "@/lib/utils"
export type GridTimelineProps<THeader> = {
  headers: THeader[]
  hours: string[]
  renderHeader: (item: THeader, index: number) => React.ReactNode
  renderSlot: (item: THeader, hour: string, rowIndex: number, colIndex: number) => React.ReactNode
  renderTabLabel?: (item: THeader, index: number) => React.ReactNode
  className?: string
}
export function GridTimeline<THeader>({ headers, hours, renderHeader, renderSlot, renderTabLabel, className }: GridTimelineProps<THeader>) {
  const [activeTab, setActiveTab] = useState(0)
  const safeTab = Math.min(activeTab, headers.length - 1)
  return (
    <div className={cn("bg-card border border-border rounded-[24px] overflow-hidden shadow-sm", className)}>
      {}
      <div className="md:hidden flex flex-col">
        <div className="flex overflow-x-auto border-b border-border" style={{ scrollbarWidth: "none" }}>
          {headers.map((headerItem, colIndex) => (
            <button
              key={`tab-${colIndex}`}
              onClick={() => setActiveTab(colIndex)}
              className={cn(
                "flex-none px-4 py-3 border-b-2 transition-colors text-left",
                safeTab === colIndex
                  ? "border-primary"
                  : "border-transparent text-muted-foreground"
              )}
            >
              {renderTabLabel ? renderTabLabel(headerItem, colIndex) : renderHeader(headerItem, colIndex)}
            </button>
          ))}
        </div>
        <div className="overflow-auto max-h-[calc(100dvh-280px)] min-h-[300px]">
          {headers.length > 0 && hours.map((hour, rowIndex) => (
            <div
              key={`mobile-row-${hour}`}
              className="flex items-stretch border-b border-border last:border-b-0"
            >
              <div className="w-16 shrink-0 flex items-center justify-center border-r border-border bg-card sticky left-0">
                <span className="text-xs font-medium text-muted-foreground tabular-nums">{hour}</span>
              </div>
              <div className="flex-1 p-1.5">
                {renderSlot(headers[safeTab], hour, rowIndex, safeTab)}
              </div>
            </div>
          ))}
        </div>
      </div>
      {}
      <div className="hidden md:block">
        <div className="overflow-auto max-h-[calc(100vh-260px)] min-h-[400px]">
          <div style={{ minWidth: `${96 + headers.length * 200}px` }}>
            <div className="sticky top-0 z-20 flex border-b border-border bg-card">
              <div className="sticky left-0 z-30 w-24 shrink-0 border-r border-border bg-card" />
              {headers.map((headerItem, colIndex) => (
                <div
                  key={`header-${colIndex}`}
                  className="flex-1 shrink-0 px-4 py-4 min-w-[200px] border-r border-border last:border-r-0 bg-card"
                >
                  {renderHeader(headerItem, colIndex)}
                </div>
              ))}
            </div>
            <div className="flex flex-col">
              {hours.map((hour, rowIndex) => (
                <div
                  key={`row-${hour}`}
                  className="flex group min-h-[100px] border-b border-border last:border-b-0 hover:bg-muted/20 transition-colors"
                >
                  <div className="sticky left-0 z-10 w-24 shrink-0 flex items-start justify-center pt-3 border-r border-border bg-card">
                    <span className="text-sm font-medium text-muted-foreground tabular-nums">{hour}</span>
                  </div>
                  {headers.map((headerItem, colIndex) => (
                    <div
                      key={`slot-${rowIndex}-${colIndex}`}
                      className="flex-1 shrink-0 p-2 min-w-[200px] border-r border-border/50 last:border-r-0 relative"
                    >
                      {renderSlot(headerItem, hour, rowIndex, colIndex)}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {}
      <div className="flex items-center gap-4 px-4 py-3 border-t border-border">
        <span className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
          <span className="w-2.5 h-2.5 rounded-full bg-primary" /> Disponível
        </span>
        <span className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
          <span className="w-2.5 h-2.5 rounded-full bg-destructive" /> Ocupado
        </span>
      </div>
    </div>
  )
}
