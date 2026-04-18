import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
export function FinalCTA() {
  return (
    <section className="py-24 bg-background">
      <div className="container px-6">
        <div className="relative overflow-hidden bg-primary rounded-[3rem] p-12 md:p-24 text-center flex flex-col items-center gap-10 shadow-2xl shadow-primary/20">
          <div className="relative z-10 max-w-3xl">
            <h2 className="text-4xl md:text-6xl font-black text-black tracking-tighter mb-6 leading-[0.9] uppercase">
              Pronto para <br /> profissionalizar?
            </h2>
            <p className="text-black/80 text-lg md:text-xl font-medium max-w-xl mx-auto mb-12 leading-relaxed">
              Centralize a gestão das suas quadras e ofereça uma experiência de reserva profissional para seus jogadores. Tudo em um único lugar.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link to="/auth/register">
                <Button size="lg" className="h-20 px-12 text-lg font-black bg-foreground text-background hover:bg-foreground/90 rounded-full transition-all hover:scale-105 shadow-2xl uppercase tracking-tighter">
                  Criar minha conta agora
                </Button>
              </Link>
            </div>
            <div className="flex items-center justify-center gap-8 mt-16 opacity-60">
              <div className="flex flex-col items-center">
                <span className="text-2xl font-black text-black leading-none">Multi</span>
                <span className="text-[10px] font-bold text-black uppercase tracking-widest mt-1">Quadras</span>
              </div>
              <div className="w-px h-10 bg-black/20" />
              <div className="flex flex-col items-center">
                <span className="text-2xl font-black text-black leading-none">24/7</span>
                <span className="text-[10px] font-bold text-black uppercase tracking-widest mt-1">Acesso</span>
              </div>
              <div className="w-px h-10 bg-black/20" />
              <div className="flex flex-col items-center">
                <span className="text-2xl font-black text-black leading-none">100%</span>
                <span className="text-[10px] font-bold text-black uppercase tracking-widest mt-1">Online</span>
              </div>
            </div>
          </div>
          {}
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute top-0 -right-24 w-80 h-80 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />
        </div>
      </div>
    </section>
  )
}
