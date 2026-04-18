import { Card, CardContent } from '@/components/ui/card'
interface StepCardProps {
  step: number
  title: string
  description: string
}
export function StepCard({ step, title, description }: StepCardProps) {
  return (
    <Card className="relative overflow-hidden border-none shadow-none bg-muted/50 rounded-[2.5rem] p-10 hover:bg-primary transition-all duration-500 group">
      <CardContent className="p-0 flex flex-col gap-6">
        <div className="relative z-10">
          <div className="w-16 h-16 bg-card rounded-2xl flex items-center justify-center mb-8 text-foreground shadow-sm group-hover:scale-110 transition-transform duration-500">
            {step === 1 && (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                <line x1="12" y1="18" x2="12.01" y2="18"></line>
              </svg>
            )}
            {step === 2 && (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            )}
            {step === 3 && (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            )}
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-primary-foreground transition-colors">{title}</h3>
          <p className="text-lg text-muted-foreground leading-relaxed group-hover:text-primary-foreground/70 transition-colors">
            {description}
          </p>
        </div>
        <div className="absolute top-6 right-8 text-8xl font-bold text-foreground/5 group-hover:text-primary-foreground/10 transition-colors pointer-events-none">
          0{step}
        </div>
      </CardContent>
    </Card>
  )
}
