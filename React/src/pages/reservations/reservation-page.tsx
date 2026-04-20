import { useEffect, useState } from "react"
import { useReservations } from "@/logic/hooks/use-reservations"
import { useAppSelector } from "@/logic/store/hooks"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarIcon, MapPin, Clock, Search, XCircle, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react"
import { ReservationModal } from "@/components/common/reservation-modal"
import { StatusBadge } from "@/components/common/status-badge"
import { ReservationSkeleton } from "@/features/reservations/components/reservation-skeleton"
import { CancelReservationModal } from "@/features/reservations/components/cancel-reservation-modal"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useTranslation } from "react-i18next"
import { Heading } from "@/components/common/heading"
import { Text } from "@/components/common/text"
import { PageLayout } from "@/components/common/page-layout"

export default function ReservationPage() {
  const { 
    reservations, 
    isLoading, 
    total, 
    filters, 
    getBookings, 
    setFilters, 
    setPage,
    editReservation 
  } = useReservations()
  const courts = useAppSelector(s => s.courts.lista)
  const [cancelModal, setCancelModal] = useState<{ isOpen: boolean; id: string; name: string }>({
    isOpen: false,
    id: "",
    name: ""
  })
  const { t } = useTranslation()
  useEffect(() => {
    getBookings()
  }, [filters])
  const getCourtName = (courtId: string) => {
    const court = courts.find(c => c.id === courtId)
    return court?.name || courtId
  }
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ search: e.target.value, page: 1 })
  }
  const handleSort = (field: string) => {
    const order = filters.sortBy === field && filters.order === "asc" ? "desc" : "asc"
    setFilters({ sortBy: field, order })
  }
  const handleCancel = (id: string, reason: string) => {
    editReservation(id, "CANCELLED", () => {
      getBookings()
    })
  }
  const totalPages = Math.ceil(total / filters.limit)
  return (
    <PageLayout
      titleKey="reservations:title"
      descriptionKey="reservations:description"
      maxWidth="md"
      actions={<ReservationModal />}
    >
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder={t("reservations:search_placeholder")}
            value={filters.search}
            onChange={handleSearch}
            className="pl-10 rounded-full"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => handleSort("date")} className="rounded-full">
            <ArrowUpDown className="w-4 h-4 mr-2" />
            <Text variant="bold" tKey="reservations:date" as="span" className="text-xs" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleSort("clientName")} className="rounded-full">
            <ArrowUpDown className="w-4 h-4 mr-2" />
            <Text variant="bold" tKey="reservations:client" as="span" className="text-xs" />
          </Button>
        </div>
      </div>
      <div className="grid gap-4">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => <ReservationSkeleton key={i} />)
        ) : reservations.length === 0 ? (
          <div className="text-center py-24 bg-card rounded-[32px] border border-border shadow-sm">
            <CalendarIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
            <Heading level={3} tKey="reservations:no_reservations" className="text-lg font-bold text-foreground" />
            <Text variant="muted" tKey="reservations:confirmed_appear_here" className="text-sm mt-1" />
          </div>
        ) : (
          reservations.map((reservation) => (
            <div
              key={reservation.id}
              className="bg-card p-5 rounded-[24px] border border-border hover:border-primary/50 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-8">
                <div className="w-full md:w-64">
                  <Text variant="bold" className="text-foreground mb-1 line-clamp-1">{reservation.clientName}</Text>
                  <div className="flex items-center text-sm font-medium text-muted-foreground gap-1.5">
                    <MapPin className="w-4 h-4 opacity-70" />
                    {getCourtName(reservation.courtId)}
                  </div>
                </div>
                <div className="flex flex-row md:flex-col items-center md:items-start gap-4 md:gap-1 mt-2 md:mt-0">
                  <div className="flex items-center text-sm font-medium text-foreground gap-1.5 bg-muted/50 px-3 py-1.5 rounded-full border border-border">
                    <CalendarIcon className="w-4 h-4 opacity-70" />
                    {format(reservation.date, "dd 'de' MMM, yyyy", { locale: ptBR })}
                  </div>
                  <div className="flex items-center text-sm font-medium text-foreground gap-1.5 bg-muted/50 px-3 py-1.5 rounded-full border border-border">
                    <Clock className="w-4 h-4 opacity-70 text-primary" />
                    {reservation.startTime} • {reservation.endTime}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-4 sm:mt-0 pt-4 sm:pt-0 border-t border-border sm:border-0 justify-between sm:justify-end min-w-[160px]">
                <StatusBadge status={reservation.status === "ACTIVE" ? "OCCUPIED" : "AVAILABLE"}>
                  <Text 
                    variant="bold" 
                    tKey={reservation.status === "ACTIVE" ? "reservations:active" : "reservations:cancelled"} 
                    as="span" 
                    className="text-[10px]"
                  />
                </StatusBadge>
                {reservation.status === "ACTIVE" && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-muted-foreground hover:text-red-500 rounded-full"
                    onClick={() => setCancelModal({ isOpen: true, id: reservation.id, name: reservation.clientName })}
                  >
                    <XCircle className="w-5 h-5" />
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-8">
          <Button 
            variant="outline" 
            size="sm" 
            disabled={filters.page === 1}
            onClick={() => setPage(filters.page - 1)}
            className="rounded-full"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            <Text variant="bold" tKey="common:previous" as="span" className="text-xs" />
          </Button>
          <span className="text-sm font-bold">
            <Text tKey="common:page" as="span" className="mr-1" /> {filters.page} / {totalPages}
          </span>
          <Button 
            variant="outline" 
            size="sm" 
            disabled={filters.page === totalPages}
            onClick={() => setPage(filters.page + 1)}
            className="rounded-full"
          >
            <Text variant="bold" tKey="common:next" as="span" className="text-xs" />
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}
      <CancelReservationModal 
        isOpen={cancelModal.isOpen}
        clientName={cancelModal.name}
        onClose={() => setCancelModal({ ...cancelModal, isOpen: false })}
        onConfirm={(reason) => handleCancel(cancelModal.id, reason)}
      />
    </PageLayout>
  )
}

