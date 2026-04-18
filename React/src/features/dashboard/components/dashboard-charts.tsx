import * as React from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"
import { useTranslation } from "react-i18next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
interface DashboardChartsProps {
  data: any[]
}
const COLORS = [
  "hsl(72 89% 57%)",
  "hsl(0 0% 9%)",
  "hsl(0 0% 45%)",
  "hsl(210 40% 96%)"
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/90 backdrop-blur-xl border border-border p-4 rounded-2xl shadow-2xl">
        <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-1">{label}</p>
        <p className="text-lg font-black text-foreground flex items-center gap-2">
          {payload[0].value} 
          <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">Reservas</span>
        </p>
      </div>
    )
  }
  return null
}
export function DashboardCharts({ data }: DashboardChartsProps) {
  const { t } = useTranslation()
  const courtOccupancy = React.useMemo(() => {
    const counts: Record<string, number> = {}
    data.forEach((booking) => {
      counts[booking.courtName] = (counts[booking.courtName] || 0) + 1
    })
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
  }, [data])
  const weekdayData = React.useMemo(() => {
    const weekdays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]
    const counts: Record<string, number> = {}
    data.forEach((booking) => {
      const day = new Date(booking.date).getDay()
      counts[weekdays[day]] = (counts[weekdays[day]] || 0) + 1
    })
    return weekdays.map((name) => ({ name, value: counts[name] || 0 }))
  }, [data])
  const timeData = React.useMemo(() => {
    const counts: Record<string, number> = {}
    data.forEach((booking) => {
      counts[booking.startTime] = (counts[booking.startTime] || 0) + 1
    })
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5)
  }, [data])
  if (data.length === 0) return null
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-12 mt-12 mb-12">
      <Card className="lg:col-span-4 rounded-[40px] border-border shadow-2xl shadow-black/5 bg-card/50 backdrop-blur-sm overflow-hidden flex flex-col">
        <CardHeader className="p-10 pb-0">
          <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
            {t("dashboard:occupancy_by_court")}
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[340px] p-6 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={courtOccupancy}
                cx="50%"
                cy="50%"
                innerRadius={75}
                outerRadius={100}
                paddingAngle={8}
                dataKey="value"
                stroke="none"
              >
                {courtOccupancy.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]} 
                    className="hover:opacity-80 transition-opacity cursor-pointer outline-none"
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-4xl font-black text-foreground leading-none">{data.length}</span>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Total</span>
          </div>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 px-4 pb-4">
             {courtOccupancy.slice(0, 3).map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter truncate max-w-[80px]">
                    {entry.name}
                  </span>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
      <Card className="lg:col-span-8 rounded-[40px] border-border shadow-2xl shadow-black/5 bg-card/50 backdrop-blur-sm overflow-hidden">
        <CardHeader className="p-10 pb-4">
          <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
            {t("dashboard:bookings_by_weekday")}
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[340px] p-8 pl-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weekdayData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity={1} />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.6} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="8 8" vertical={false} stroke="var(--border)" opacity={0.5} />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "var(--muted-foreground)", fontSize: 10, fontWeight: 800, textTransform: 'uppercase' }}
                dy={15}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "var(--muted-foreground)", fontSize: 10, fontWeight: 800 }}
              />
              <Tooltip 
                content={<CustomTooltip />}
                cursor={{ fill: "var(--primary)", opacity: 0.05 }} 
              />
              <Bar 
                dataKey="value" 
                fill="url(#barGradient)" 
                radius={[12, 12, 0, 0]} 
                barSize={45}
                className="hover:brightness-110 transition-all cursor-pointer"
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card className="lg:col-span-12 rounded-[40px] border-border shadow-2xl shadow-black/5 bg-card/50 backdrop-blur-sm overflow-hidden">
        <CardHeader className="p-10 pb-4">
          <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
            {t("dashboard:popular_times")}
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[280px] p-10 pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={timeData} layout="vertical" margin={{ left: 20 }}>
              <XAxis type="number" hide />
              <YAxis 
                dataKey="name" 
                type="category" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "var(--foreground)", fontSize: 12, fontWeight: 900 }}
                width={80}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent" }} />
              <Bar 
                dataKey="value" 
                fill="var(--foreground)" 
                radius={[0, 20, 20, 0]} 
                barSize={32}
                className="hover:fill-primary transition-colors cursor-pointer"
              >
                 {timeData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={index === 0 ? "var(--primary)" : "var(--foreground)"} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

