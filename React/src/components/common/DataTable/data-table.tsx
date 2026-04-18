import * as React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
export type ColumnDef<T> = {
  header: React.ReactNode
  accessorKey: keyof T | string
  cell?: (item: T) => React.ReactNode
}
interface DataTableProps<T> {
  columns: ColumnDef<T>[]
  data: T[]
  isLoading?: boolean
  onRowClick?: (row: T) => void
}
export function DataTable<T>({
  columns,
  data,
  isLoading = false,
  onRowClick,
}: DataTableProps<T>) {
  return (
    <div className="rounded-md border border-border">
      <Table>
        <TableHeader>
          <TableRow className="border-b-border hover:bg-transparent">
            {columns.map((col, index) => (
              <TableHead key={index} className="text-muted-foreground">
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, rowIndex) => (
              <TableRow key={rowIndex} className="border-b-border">
                {columns.map((_, colIndex) => (
                  <TableCell key={colIndex}>
                    <Skeleton className="h-4 w-[100px] bg-muted" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : data.length ? (
            data.map((row, rowIndex) => (
              <TableRow
                key={rowIndex}
                onClick={() => onRowClick?.(row)}
                className={`border-b-border ${
                  onRowClick ? "cursor-pointer hover:bg-muted/50" : "hover:bg-transparent"
                }`}
              >
                {columns.map((col, colIndex) => (
                  <TableCell key={colIndex} className="font-medium text-foreground">
                    {col.cell
                      ? col.cell(row)
                      : (row[col.accessorKey as keyof T] as React.ReactNode)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center text-muted-foreground"
              >
                Nenhum resultado encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
