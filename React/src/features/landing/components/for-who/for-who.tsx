import { useScrollReveal } from '@/logic/hooks/use-scroll-reveal'
import { audiences } from '../../constants/audiences'
import { AudienceCard } from './audience-card'
export function ForWho() {
  const revealRef = useScrollReveal()
  return (
    <section id="for-who" ref={revealRef} className="py-24 bg-background opacity-0 transition-all duration-1000">
      <div className="container px-6">
        <div className="flex flex-col items-start mb-20 max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-6">
            Domine sua <span className="text-muted-foreground">região.</span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground font-medium max-w-2xl leading-relaxed">
            Seja você gestor de uma arena ou jogador em busca de uma quadra, o SportsCourt oferece as ferramentas certas para cada perfil.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {audiences.map((audience) => (
            <AudienceCard
              key={audience.title}
              badge={audience.badge}
              title={audience.title}
              benefits={audience.benefits}
              ctaLabel={audience.ctaLabel}
              ctaHref={audience.ctaHref}
              highlight={audience.highlight}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
