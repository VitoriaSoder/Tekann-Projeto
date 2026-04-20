import { useEffect, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { Trophy, BookOpen, CalendarDays, Users, TrendingUp, CheckCircle2, MapPin } from "lucide-react"
import { useAppSelector, useAppDispatch } from "@/logic/store/hooks"
import { getCourtsWorker } from "@/logic/workers/court-worker"
import { getBookingsWorker } from "@/logic/workers/booking-worker"
import { DashboardCharts } from "@/features/dashboard/components/dashboard-charts"
import { cn } from "@/lib/utils"
import { Court } from "@/logic/store/slices/court-slice"
import { Box } from "@/components/common/box"
import { Heading } from "@/components/common/heading"
import { Text } from "@/components/common/text"
import { Button } from "@/components/ui/button"
import { PageLayout } from "@/components/common/page-layout"

function StatCard({
  labelKey,
  value,
  icon: Icon,
  accent,
  trend,
  descriptionKey
}: {
  labelKey: string;
  value: number;
  icon: any;
  accent?: boolean;
  trend?: string;
  descriptionKey?: string;
}) {
  return (
    <Box className={cn(
      "relative overflow-hidden bg-card rounded-[24px] md:rounded-[32px] border border-border p-5 md:p-8 flex flex-col justify-between shadow-2xl shadow-black/5 group hover:border-primary/50 transition-all duration-500",
      accent && "bg-primary/5 border-primary/20"
    )}>
      {accent && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/2" />
      )}
      <Box className="flex justify-between items-start mb-6">
        <Box className={cn(
          "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 duration-500",
          accent ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "bg-muted text-muted-foreground"
        )}>
          <Icon size={26} />
        </Box>
        {trend && (
          <Box className="flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
            <TrendingUp size={12} />
            {trend}
          </Box>
        )}
      </Box>
      <Box>
        <Heading level={2} className="text-3xl md:text-4xl font-black text-foreground tracking-tighter leading-none mb-2 m-0">
          {value}
        </Heading>
        <Text variant="bold" tKey={labelKey} className="font-black uppercase tracking-[0.2em] text-xs" />
        {descriptionKey && (
          <Text variant="small" tKey={descriptionKey} className="text-muted-foreground/60 font-medium mt-3 leading-relaxed" />
        )}
      </Box>
    </Box>
  )
}

function AdminDashboard() {
  const dispatch = useAppDispatch()
  const courts = useAppSelector(s => s.courts)
  const bookings = useAppSelector(s => s.bookings)

  useEffect(() => {
    getCourtsWorker(dispatch)
    getBookingsWorker(dispatch)
  }, [])

  const activeBookings = useMemo(() =>
    bookings.lista.filter(b => b.status === "CONFIRMED" || b.status === "ACTIVE").length,
    [bookings.lista])

  return (
    <PageLayout
      titleKey="dashboard:title"
      descriptionKey="dashboard:description"
      maxWidth="xl"
    >
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/3 rounded-full blur-[100px] -z-10 pointer-events-none" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
        <StatCard
          labelKey="dashboard:courts_registered"
          value={courts.total}
          icon={Trophy}
          accent
          descriptionKey="dashboard:courts_registered_desc"
        />
        <StatCard
          labelKey="dashboard:total_bookings"
          value={bookings.total}
          icon={BookOpen}
          descriptionKey="dashboard:total_bookings_desc"
        />
        <StatCard
          labelKey="dashboard:active_bookings"
          value={activeBookings}
          icon={CheckCircle2}
          descriptionKey="dashboard:active_bookings_desc"
        />
      </div>

      <DashboardCharts data={bookings.lista} />
    </PageLayout>
  )
}

function CourtCard({ court }: { court: Court }) {
  const navigate = useNavigate()

  return (
    <Box
      onClick={() => navigate(`/courts/${court.id}`)}
      className="bg-card rounded-[24px] md:rounded-[32px] border border-border p-5 md:p-8 shadow-2xl shadow-black/[0.02] hover:shadow-primary/5 hover:border-primary/40 transition-all cursor-pointer group flex flex-col h-full"
    >
      <Box className="flex items-start justify-between mb-8">
        <Box className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center transition-transform group-hover:scale-110">
          <Trophy size={24} className="text-primary" />
        </Box>
        <Box className="text-[10px] font-black px-4 py-1.5 rounded-full bg-muted text-muted-foreground uppercase tracking-widest border border-border">
          {court.type}
        </Box>
      </Box>

      <Heading level={3} className="text-xl md:text-2xl font-black text-foreground tracking-tighter uppercase mb-2 group-hover:text-primary transition-colors leading-tight m-0">
        {court.name}
      </Heading>

      <Text variant="muted" className="mb-8 flex items-center gap-2">
        <MapPin size={14} />
        {court.region}
      </Text>

      <Box className="mt-auto space-y-4">
        <Box className="flex items-center gap-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">
          <Box className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
            <Users size={14} />
          </Box>
          <Text 
            variant="bold" 
            as="span" 
            className="text-[10px]"
            tKey={["courts:capacity_prefix", court.capacity, "courts:people"]}
          />
        </Box>
        <Box className="flex items-center gap-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">
          <Box className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
            <CalendarDays size={14} />
          </Box>
          <Text variant="bold" as="span" className="text-[10px]">
            {court.openingTime} – {court.closingTime}
          </Text>
        </Box>
        <Button className="mt-6 w-full h-14 rounded-2xl bg-primary text-black text-xs font-black uppercase tracking-widest hover:bg-primary/90 transition-all hover:scale-[1.02] shadow-xl shadow-primary/10">
          <Text variant="none" tKey="dashboard:view_schedules" as="span" className="text-xs" />
        </Button>
      </Box>

    </Box>
  )
}

function UserDashboard() {
  const dispatch = useAppDispatch()
  const courts = useAppSelector(s => s.courts)

  useEffect(() => {
    getCourtsWorker(dispatch)
  }, [])

  const activeCourts = courts.lista.filter(c => c.isActive)

  return (
    <PageLayout
      titleKey="dashboard:available_courts"
      descriptionKey="dashboard:choose_court"
      maxWidth="xl"
    >
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none" />

      {courts.load && (
        <Box className="flex flex-col items-center justify-center py-40 gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <Text variant="small" tKey="dashboard:loading" className="font-black uppercase tracking-widest" />
        </Box>
      )}

      {!courts.load && activeCourts.length === 0 && (
        <Box className="text-center py-32 bg-card/50 backdrop-blur-sm rounded-[40px] border border-border shadow-2xl shadow-black/5">
          <Box className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-8 opacity-40">
            <Trophy size={40} className="text-muted-foreground" />
          </Box>
          <Heading level={2} tKey="dashboard:no_courts_title" className="font-bold mb-2 m-0" />
          <Text variant="muted" tKey="dashboard:no_courts" />
        </Box>
      )}


      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {activeCourts.map(court => (
          <CourtCard key={court.id} court={court} />
        ))}
      </div>
    </PageLayout>
  )
}

export default function DashboardPage() {
  const user = useAppSelector(s => s.auth.user)
  const isAdmin = user?.role === "ADMIN"

  return isAdmin ? <AdminDashboard /> : <UserDashboard />
}
