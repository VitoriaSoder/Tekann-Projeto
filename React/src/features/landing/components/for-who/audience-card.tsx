import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { BenefitItem } from './benefit-item'
interface AudienceCardProps {
  badge: string
  title: string
  benefits: string[]
  ctaLabel: string
  ctaHref: string
  highlight?: boolean
}
export function AudienceCard({
  badge,
  title,
  benefits,
  ctaLabel,
  ctaHref,
  highlight = false
}: AudienceCardProps) {
  return (
    <Card className={`relative flex flex-col h-full rounded-[2.5rem] border p-12 transition-all duration-500 ${highlight ? 'bg-foreground text-background border-border shadow-2xl' : 'bg-muted/50 text-foreground border-border shadow-sm'}`}>
      {highlight && (
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary opacity-[0.07] rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
      )}
      <CardHeader className="p-0 mb-10 relative z-10">
        <div className="flex items-center gap-6">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center ${highlight ? 'bg-primary text-black' : 'bg-foreground text-background'}`}>
            {highlight ? (
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              </svg>
            ) : (
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
              </svg>
            )}
          </div>
          <h3 className="text-3xl font-bold tracking-tight">{badge}</h3>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-grow relative z-10">
        <h4 className={`text-xl font-medium mb-10 ${highlight ? 'opacity-70' : 'text-muted-foreground'}`}>{title}</h4>
        <ul className="space-y-8">
          {benefits.map((benefit) => (
            <BenefitItem key={benefit} text={benefit} highlight={highlight} />
          ))}
        </ul>
      </CardContent>
      <div className="mt-14 relative z-10">
        <Link to={ctaHref}>
          <Button
            className={`w-full h-16 rounded-full text-base font-bold transition-all hover:scale-[1.02] ${highlight ? 'bg-primary text-black hover:bg-primary/90' : 'bg-foreground text-background hover:bg-foreground/90'}`}
          >
            {ctaLabel}
          </Button>
        </Link>
      </div>
    </Card>
  )
}
