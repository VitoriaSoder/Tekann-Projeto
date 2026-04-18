import { Link } from 'react-router-dom'
import { courtTypes } from '../../constants/court-types'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
export function CourtTypesSection() {
  return (
    <section id="courts" className="py-24 bg-background">
      <div className="container px-6">
        <div className="flex flex-col items-center text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-6">
            Modalidades <span className="text-primary">Suportadas</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl font-medium">
            Configure qualquer modalidade com grades de horários personalizadas. A plataforma se adapta ao perfil da sua arena.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {courtTypes.map((court) => (
            <div 
              key={court.id} 
              className="group relative overflow-hidden rounded-[2.5rem] bg-muted aspect-[4/5] flex flex-col justify-end p-8"
            >
              <img 
                src={court.image} 
                alt={court.name} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <div className="px-3 py-1 rounded-full bg-primary text-black text-[10px] font-black uppercase tracking-widest">
                    Suportado
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 uppercase tracking-tight">
                  {court.name}
                </h3>
                <p className="text-white/70 text-sm font-medium mb-6 line-clamp-2">
                  {court.description}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center">
          <Link to="/auth/register">
            <Button size="lg" className="h-16 px-12 rounded-full border-2 border-border hover:bg-accent bg-card text-foreground font-black uppercase tracking-widest transition-all hover:scale-105 flex items-center gap-3">
              Configurar Minhas Quadras
              <ArrowRight size={20} />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
