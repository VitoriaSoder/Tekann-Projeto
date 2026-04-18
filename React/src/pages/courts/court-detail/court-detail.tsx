import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "@/logic/store/hooks"
import { getCourtsWorker } from "@/logic/workers/court-worker"
import { Trophy, Users, Clock, MapPin, ChevronLeft, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TimeSlotPicker } from "@/components/common/time-slot-picker"
import { ReservationModal } from "@/components/common/reservation-modal"
import { Box } from "@/components/common/box"
import { Heading } from "@/components/common/heading"
import { Text } from "@/components/common/text"
import { useTranslation } from "react-i18next"

export default function CourtDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const court = useAppSelector(s => s.courts.lista.find(c => c.id === id))
  const isLoading = useAppSelector(s => s.courts.load)
  const [selectedTime, setSelectedTime] = useState<{start: string, end: string} | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { t } = useTranslation()

  useEffect(() => {
    if (!court) {
      getCourtsWorker(dispatch)
    }
  }, [id, court, dispatch])

  const handleTimeSelect = (start: string, end: string) => {
    setSelectedTime({ start, end })
    setIsModalOpen(true)
  }

  if (isLoading) {
    return (
      <Box className="p-8 text-center">
        <Text variant="muted" tKey="common:loading" />
      </Box>
    )
  }

  if (!court) {
    return (
      <Box className="p-8 text-center">
        <Text variant="muted" tKey="courts:not_found" className="mb-4" />
        <Button variant="outline" onClick={() => navigate("/dashboard")} className="rounded-xl">
          <Text variant="bold" tKey="common:back" as="span" className="text-sm" />
        </Button>
      </Box>
    )
  }

  return (
    <Box className="p-4 md:p-8 max-w-[800px] mx-auto w-full">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-6 group"
      >
        <ChevronLeft size={16} className="transition-transform group-hover:-translate-x-1" />
        <Text variant="bold" tKey="common:back" as="span" className="text-sm" />
      </button>

      <Box className="bg-card rounded-[32px] border border-border shadow-sm overflow-hidden">
        <Box className="bg-primary/5 px-8 py-8 border-b border-border">
          <Box className="flex items-center gap-4">
            <Box className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
              <Trophy size={24} className="text-black" />
            </Box>
            <Box>
              <Heading level={1} className="text-xl md:text-2xl font-extrabold tracking-tight text-foreground m-0">
                {court.name}
              </Heading>
              <Box className="text-sm font-semibold px-2.5 py-0.5 rounded-full bg-card border border-border text-muted-foreground mt-1.5 inline-block">
                {court.type}
              </Box>
            </Box>
          </Box>
        </Box>

        <Box className="px-8 py-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Box className="flex items-center gap-3">
            <Box className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
              <MapPin size={18} className="text-foreground/70" />
            </Box>
            <Box>
              <Text variant="small" tKey="courts:region_label" className="font-black uppercase tracking-widest text-muted-foreground mb-0.5 text-[10px]" />
              <Text variant="bold" className="text-sm text-foreground">{court.region}</Text>
            </Box>
          </Box>
          <Box className="flex items-center gap-3">
            <Box className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <Users size={18} className="text-foreground/70" />
            </Box>
            <Box>
              <Text variant="small" tKey="courts:capacity_label" className="font-black uppercase tracking-widest text-muted-foreground mb-0.5 text-[10px]" />
              <Text 
                variant="bold" 
                className="text-sm text-foreground"
                tKey={["courts:capacity_prefix", court.capacity, "courts:people"]}
              />
            </Box>
          </Box>
          <Box className="flex items-center gap-3">
            <Box className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <Calendar size={18} className="text-foreground/70" />
            </Box>
            <Box>
              <Text variant="small" tKey="courts:sports_label" className="font-black uppercase tracking-widest text-muted-foreground mb-0.5 text-[10px]" />
              <Text variant="bold" className="text-sm text-foreground">
                {court.sports?.map(s => s.name).join(", ") || t("common:none")}
              </Text>
            </Box>
          </Box>
          <Box className="flex items-center gap-3">
            <Box className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <Clock size={18} className="text-foreground/70" />
            </Box>
            <Box>
              <Text variant="small" tKey="courts:slot_duration" className="font-black uppercase tracking-widest text-muted-foreground mb-0.5 text-[10px]" />
              <Text variant="bold" className="text-sm text-foreground">{court.slotDuration} {t("common:minutes")}</Text>
            </Box>
          </Box>
        </Box>

        <Box className="px-8 pb-8 space-y-6">
          <Box className="pt-6 border-t border-border">
            <TimeSlotPicker 
              courtId={court.id}
              date={new Date()}
              selectedTime={selectedTime?.start || ""}
              onTimeSelect={handleTimeSelect}
            />
          </Box>
          <ReservationModal
            key={selectedTime?.start}
            open={isModalOpen}
            onOpenChange={setIsModalOpen}
            defaultValues={{ 
              courtId: court.id, 
              date: new Date(),
              startTime: selectedTime?.start,
              endTime: selectedTime?.end
            }}
            trigger={
              <Button
                className="w-full h-14 rounded-2xl bg-primary text-black font-black uppercase tracking-widest hover:bg-primary/90 hover:scale-[1.02] transition-all shadow-xl shadow-primary/10"
              >
                {selectedTime ? (
                  <Text 
                    as="span" 
                    className="text-sm text-black"
                    tKey={["reservations:book_for", selectedTime.start]}
                  />
                ) : (
                  <Text variant="bold" tKey="reservations:select_time" as="span" className="text-sm text-black" />
                )}
              </Button>
            }
          />
        </Box>
      </Box>
    </Box>
  )
}

