import { Skeleton } from "@/components/ui/skeleton"
export function ReservationSkeleton() {
  return (
    <div className="bg-card p-5 rounded-[24px] border border-border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-8">
        <div className="w-full md:w-64">
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex flex-row md:flex-col items-center md:items-start gap-4 md:gap-1 mt-2 md:mt-0">
          <Skeleton className="h-8 w-32 rounded-full" />
          <Skeleton className="h-8 w-32 rounded-full" />
        </div>
      </div>
      <div className="flex items-center gap-3 mt-4 sm:mt-0 pt-4 sm:pt-0 border-t border-border sm:border-0 justify-between sm:justify-end min-w-[160px]">
        <Skeleton className="h-8 w-24 rounded-full" />
      </div>
    </div>
  )
}
