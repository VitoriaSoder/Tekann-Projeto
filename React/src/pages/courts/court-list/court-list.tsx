import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { DataTable, ColumnDef } from "@/components/common/DataTable/data-table"
import { QuadraFilter } from "./components/quadra-filter"
import { CourtFormModal } from "./components/court-form-modal"
import { useCourts } from "@/logic/hooks/use-courts"
import { Heading } from "@/components/common/heading"
import { Text } from "@/components/common/text"
import { Box } from "@/components/common/box"
import { useTranslation } from "react-i18next"

export function CourtList() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [filterType, setFilterType] = useState<string>("Todos")
  const { courts, isLoading, error, getCourts } = useCourts()

  useEffect(() => {
    getCourts()
  }, [])

  const columns: ColumnDef<any>[] = [
    { header: t("courts:name_label"), accessorKey: "name" },
    { header: t("courts:type_label"), accessorKey: "type" },
    { header: t("courts:region_label"), accessorKey: "region" },
    { header: t("courts:capacity_label"), accessorKey: "capacity", cell: (item) => `${item.capacity} ${t("courts:people")}` },
    { header: t("courts:operation_label"), accessorKey: "openingTime", cell: (item) => `${item.openingTime} – ${item.closingTime}` },
    {
      header: t("reservations:status"),
      accessorKey: "isActive",

      cell: (item) => (
        <Text
          as="span"
          variant="bold"
          tKey={item.isActive ? "courts:status_active" : "courts:status_inactive"}
          className={item.isActive ? "text-emerald-500" : "text-destructive"}
        />
      ),
    },
  ]

  const filteredCourts = courts.filter(court => {
    if (filterType === "Todos") return true
    return court.type === filterType
  })

  return (
    <Box className="p-4 md:p-8 max-w-[1200px] mx-auto w-full">
      <Box className="flex justify-between items-center mb-6 md:mb-10 gap-4">
        <Box>
          <Heading level={1} tKey="courts:title" className="text-xl md:text-3xl font-extrabold tracking-tight text-foreground m-0" />
          <Text variant="muted" tKey="courts:description" className="mt-1 text-sm md:text-base" />
        </Box>
        <CourtFormModal />
      </Box>

      <Box className="bg-card rounded-[20px] border border-border shadow-sm overflow-hidden">
        <Box className="p-4 border-b border-border">
          <QuadraFilter value={filterType} onValueChange={setFilterType} />
        </Box>
        {error && (
          <Box className="p-6">
            <Text className="text-destructive font-medium text-sm">{error}</Text>
          </Box>
        )}
        <DataTable
          columns={columns}
          data={filteredCourts}
          isLoading={isLoading}
          onRowClick={(row) => navigate(`/courts/${row.id}`)}
        />
      </Box>
    </Box>
  )
}

export default CourtList

