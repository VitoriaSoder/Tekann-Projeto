import { LayoutGrid, Zap, CalendarCheck, Building2, BarChart3, Clock } from 'lucide-react'
import { Heading } from '@/components/common/heading'
import { Text } from '@/components/common/text'

const featuresData = [
  {
    key: 'schedule',
    icon: LayoutGrid
  },
  {
    key: 'online_booking',
    icon: CalendarCheck
  },
  {
    key: 'simple_reservation',
    icon: Zap
  },
  {
    key: 'court_control',
    icon: Building2
  },
  {
    key: 'dashboard',
    icon: BarChart3
  },
  {
    key: 'continuous_access',
    icon: Clock
  }
]

export function FeaturesGrid() {
  return (
    <section className="py-24 bg-background">
      <div className="container px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-xl">
            <Heading level={2} className="text-3xl md:text-4xl font-bold tracking-tight text-foreground leading-tight mb-4">
              <Text as="span" variant="inherit" tKey="common:landing.features.title1" />
              <br />
              <Text as="span" variant="none" tKey="common:landing.features.title2" className="text-muted-foreground" />
            </Heading>
          </div>
          <div className="max-w-xs">
            <Text variant="muted" tKey="common:landing.features.subtitle" className="text-base font-medium" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuresData.map((feature, index) => (
            <div 
              key={index} 
              className="p-8 rounded-3xl border border-border bg-muted/30 hover:bg-card hover:shadow-xl transition-all group"
            >
              <div className="mb-6 w-12 h-12 rounded-xl bg-card flex items-center justify-center text-foreground group-hover:bg-primary transition-colors shadow-sm">
                <feature.icon size={24} strokeWidth={2.5} />
              </div>
              <Heading 
                level={3} 
                tKey={`common:landing.features.items.${feature.key}.title`} 
                className="text-xl font-bold text-foreground mb-3 tracking-tight" 
              />
              <Text 
                variant="muted" 
                tKey={`common:landing.features.items.${feature.key}.description`} 
                className="text-sm md:text-base font-medium leading-relaxed" 
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
