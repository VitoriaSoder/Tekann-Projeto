import { Card, CardContent } from '@/components/ui/card'
import { Smartphone, Calendar, CheckCircle2 } from 'lucide-react'
import { Heading } from '@/components/common/heading'
import { Text } from '@/components/common/text'

interface StepCardProps {
  step: number
  titleKey: string
  descriptionKey: string
}

export function StepCard({ step, titleKey, descriptionKey }: StepCardProps) {
  return (
    <Card className="relative overflow-hidden border-none shadow-none bg-muted/50 rounded-[2.5rem] p-10 hover:bg-primary transition-all duration-500 group">
      <CardContent className="p-0 flex flex-col gap-6">
        <div className="relative z-10">
          <div className="w-16 h-16 bg-card rounded-2xl flex items-center justify-center mb-8 text-foreground shadow-sm group-hover:scale-110 transition-transform duration-500">
            {step === 1 && <Smartphone size={28} />}
            {step === 2 && <Calendar size={28} />}
            {step === 3 && <CheckCircle2 size={28} strokeWidth={2.5} />}
          </div>
          <Heading 
            level={3} 
            tKey={titleKey} 
            className="text-2xl font-bold text-foreground mb-4 group-hover:text-primary-foreground transition-colors" 
          />
          <Text 
            variant="large"
            tKey={descriptionKey} 
            className="leading-relaxed group-hover:text-primary-foreground/70 transition-colors" 
          />
        </div>
        <div className="absolute top-6 right-8 text-8xl font-bold text-foreground/5 group-hover:text-primary-foreground/10 transition-colors pointer-events-none">
          0{step}
        </div>
      </CardContent>
    </Card>
  )
}
