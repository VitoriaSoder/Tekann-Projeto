import dashboardImg from '@/assets/images/dashboard-mockup.png'
import mobileImg from '@/assets/images/mobile-mockup.png'
export function MockupSection() {
  return (
    <section className="py-24 bg-muted/30 overflow-hidden">
      <div className="container px-6">
        <div className="flex flex-col items-center text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-foreground mb-8">
            Sua Arena em <span className="text-primary">Tempo Real</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl font-medium">
            Interface intuitiva desenhada para gestores. Controle total de quadras, agendamentos e reservas em um único painel.
          </p>
        </div>
        <div className="relative">
          <div className="relative z-10 rounded-3xl border-[8px] border-card shadow-xl overflow-hidden bg-card max-w-4xl mx-auto">
            <img 
              src={dashboardImg} 
              alt="SportsCourt Dashboard" 
              className="w-full h-auto"
            />
          </div>
          <div className="absolute -bottom-10 -right-5 md:right-10 z-20 w-40 md:w-64 rounded-[2.5rem] border-[6px] border-black shadow-2xl overflow-hidden bg-black transform rotate-3 hidden sm:block">
            <img 
              src={mobileImg} 
              alt="SportsCourt Mobile" 
              className="w-full h-auto"
            />
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-96 bg-primary/20 blur-[120px] -z-10 rounded-full" />
        </div>
      </div>
    </section>
  )
}
