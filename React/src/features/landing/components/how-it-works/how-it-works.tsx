import { useScrollReveal } from '@/logic/hooks/use-scroll-reveal'
import { steps } from '../../constants/steps'
import { StepCard } from './step-card'
export function HowItWorks() {
  const revealRef = useScrollReveal()
  return (
    <section id="how-it-works" ref={revealRef} className="py-24 bg-muted/30 opacity-0 transition-all duration-1000">
      <div className="container px-6">
        <div className="flex flex-col items-center text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-6">
            Fluxo <span className="text-primary">Imbatível</span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl font-medium">
            Um fluxo direto, do cadastro das quadras até o controle das reservas, sem complexidade.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <StepCard
              key={step.step}
              step={step.step}
              title={step.title}
              description={step.description}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
