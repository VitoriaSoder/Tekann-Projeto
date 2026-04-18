import { HeroTitle } from './hero-title'
import { HeroCTA } from './hero-cta'
import playerImg from '@/assets/images/Elite_tennis_player_202604172141.png'
export function Hero() {
  return (
    <section className="relative w-full min-h-screen flex items-center bg-background overflow-hidden pt-24 pb-20">
      {}
      <div className="absolute inset-0 z-0">
        <img 
          src={playerImg} 
          alt="Tenista em quadra" 
          className="w-full h-full object-cover object-top opacity-30 md:opacity-40" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/20 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent md:via-background/10" />
      </div>
      <div className="container relative z-10 px-6">
        <div className="max-w-4xl">
          <HeroTitle />
          <p className="text-lg md:text-xl font-medium text-muted-foreground mb-12 max-w-2xl leading-relaxed mt-8">
            A plataforma completa para gerenciar quadras, agendamentos e reservas com <span className="text-foreground font-bold">simplicidade</span> e eficiência.
          </p>
          <HeroCTA />
        </div>
      </div>
      <div className="absolute top-1/4 right-10 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
    </section>
  )
}
