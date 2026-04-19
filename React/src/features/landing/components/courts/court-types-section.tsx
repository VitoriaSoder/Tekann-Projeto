import { Link } from 'react-router-dom'
import { courtTypes } from '../../constants/court-types'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'
import { Heading } from '@/components/common/heading'
import { Text } from '@/components/common/text'
import { SectionHeader } from '@/components/common/section-header'

export function CourtTypesSection() {
  const { t } = useTranslation()

  return (
    <section id="courts" className="py-24 bg-background">
      <div className="container px-6">
        <SectionHeader
          title1Key="common:landing.courts.title1"
          title2Key="common:landing.courts.title2"
          subtitleKey="common:landing.courts.subtitle"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {courtTypes.map((court) => (
            <div 
              key={court.id} 
              className="group relative overflow-hidden rounded-[2.5rem] bg-muted aspect-[4/5] flex flex-col justify-end p-8"
            >
              <img 
                src={court.image} 
                alt={t(court.nameKey)} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <Text 
                    variant="bold" 
                    as="div" 
                    tKey="common:landing.courts.supportedBadge" 
                    className="px-3 py-1 rounded-full bg-primary text-black text-[10px] uppercase tracking-widest" 
                  />
                </div>
                <Heading 
                  level={3} 
                  tKey={court.nameKey} 
                  className="text-2xl font-bold text-white mb-2 uppercase tracking-tight" 
                />
                <Text 
                  tKey={court.descriptionKey} 
                  className="text-white/70 text-sm font-medium mb-6 line-clamp-2" 
                />
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center">
          <Link to="/auth/register">
            <Button size="lg" className="h-16 px-12 rounded-full border-2 border-border hover:bg-accent hover:text-accent-foreground bg-card text-foreground font-black uppercase tracking-widest transition-all hover:scale-105 flex items-center gap-3">
              <Text 
                variant="bold" 
                as="span" 
                tKey="common:landing.courts.configureButton" 
                className="text-xs" 
              />
              <ArrowRight size={20} />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
