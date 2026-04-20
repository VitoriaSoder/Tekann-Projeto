import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { DataTable, ColumnDef } from "@/components/common/DataTable/data-table"
import { QuadraFilter } from "./components/quadra-filter"
import { CourtFormModal } from "./components/court-form-modal"
import { useCourts } from "@/logic/hooks/use-courts"
import { Text } from "@/components/common/text"
import { Box } from "@/components/common/box"
import { useTranslation } from "react-i18next"

import { PageLayout } from "@/components/common/page-layout"

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
    <PageLayout
      titleKey="courts:title"
      descriptionKey="courts:description"
      actions={<CourtFormModal />}
    >
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
    </PageLayout>
  )
}

export default CourtList

