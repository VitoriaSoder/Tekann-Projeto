import { useScrollReveal } from '@/logic/hooks/use-scroll-reveal'
import { StepCard } from './step-card'

import { SectionHeader } from '@/components/common/section-header'

const stepsKeys = [1, 2, 3]

export function HowItWorks() {
  const revealRef = useScrollReveal()

  return (
    <section id="how-it-works" ref={revealRef} className="py-24 bg-muted/30 opacity-0 transition-all duration-1000">
      <div className="container px-6">
        <SectionHeader
          title1Key="common:landing.howItWorks.title"
          subtitleKey="common:landing.howItWorks.subtitle"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stepsKeys.map((step) => (
            <StepCard
              key={step}
              step={step}
              titleKey={`common:landing.howItWorks.steps.step${step}.title`}
              descriptionKey={`common:landing.howItWorks.steps.step${step}.description`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
