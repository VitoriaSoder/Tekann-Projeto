import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { BenefitItem } from './benefit-item'
import { Building2, BookOpen } from 'lucide-react'
import { Heading } from '@/components/common/heading'
import { Text } from '@/components/common/text'
import { useTranslation } from 'react-i18next'

interface AudienceCardProps {
  badgeKey: string
  titleKey: string
  benefits: string[]
  ctaLabelKey: string
  ctaHref: string
  highlight?: boolean
}

export function AudienceCard({
  badgeKey,
  titleKey,
  benefits,
  ctaLabelKey,
  ctaHref,
  highlight = false
}: AudienceCardProps) {
  const { t } = useTranslation()
  
  return (
    <Card className={`relative flex flex-col h-full rounded-[2.5rem] border p-12 transition-all duration-500 ${highlight ? 'bg-primary text-black border-primary/20 shadow-2xl shadow-primary/20' : 'bg-muted/50 text-foreground border-border shadow-sm'}`}>
      {highlight && (
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary opacity-[0.07] rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
      )}
      <CardHeader className="p-0 mb-10 relative z-10">
        <div className="flex items-center gap-6">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center ${highlight ? 'bg-primary text-black' : 'bg-foreground text-background'}`}>
            {highlight ? (
              <Building2 size={32} />
            ) : (
              <BookOpen size={32} />
            )}
          </div>
          <Heading level={3} tKey={badgeKey} className="text-3xl font-bold tracking-tight" />
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-grow relative z-10">
        <Heading 
          level={4} 
          variant="none"
          tKey={titleKey} 
          className={`text-xl font-medium mb-10 ${highlight ? 'text-black/70' : 'text-muted-foreground'}`} 
        />
        <ul className="space-y-8">
          {benefits.map((benefit) => (
            <BenefitItem key={benefit} text={benefit} highlight={highlight} />
          ))}
        </ul>
      </CardContent>
      <div className="mt-14 relative z-10">
        <Link to={ctaHref}>
          <Button
            className={`w-full h-16 rounded-full text-base font-black uppercase tracking-tight transition-all hover:scale-[1.02] ${highlight ? 'bg-black text-white hover:bg-black/90' : 'bg-foreground text-background hover:bg-foreground/90'}`}
          >
            <Text 
              variant="none" 
              as="span" 
              tKey={ctaLabelKey} 
              className="text-base" 
            />
          </Button>
        </Link>
      </div>
    </Card>
  )
}
