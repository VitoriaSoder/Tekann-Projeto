import { LayoutGrid, Zap, CalendarCheck, Building2, BarChart3, Clock } from 'lucide-react'
const features = [
  {
    title: 'Grade de Horários',
    description: 'Visualize a ocupação de todas as quadras em uma única tela integrada.',
    icon: LayoutGrid
  },
  {
    title: 'Agendamento Online',
    description: 'Sistema de reserva intuitivo que garante o horário para seus jogadores.',
    icon: CalendarCheck
  },
  {
    title: 'Reserva Simplificada',
    description: 'Processo de reserva direto e rápido, sem etapas desnecessárias.',
    icon: Zap
  },
  {
    title: 'Controle de Quadras',
    description: 'Gerencie múltiplos espaços, tipos de quadra e regiões com facilidade.',
    icon: Building2
  },
  {
    title: 'Dashboard de Gestão',
    description: 'Acompanhe o total de quadras e reservas com visão consolidada no painel administrativo.',
    icon: BarChart3
  },
  {
    title: 'Acesso Contínuo',
    description: 'Sua arena disponível para reservas online a qualquer hora do dia ou da noite.',
    icon: Clock
  }
]
export function FeaturesGrid() {
  return (
    <section className="py-24 bg-background">
      <div className="container px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground leading-tight mb-4">
              Tudo o que você precisa <br />
              <span className="text-muted-foreground">para crescer sua arena.</span>
            </h2>
          </div>
          <div className="max-w-xs">
            <p className="text-base text-muted-foreground font-medium">
              Desenvolvemos ferramentas para que você foque na experiência do seu cliente.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="p-8 rounded-3xl border border-border bg-muted/30 hover:bg-card hover:shadow-xl transition-all group"
            >
              <div className="mb-6 w-12 h-12 rounded-xl bg-card flex items-center justify-center text-foreground group-hover:bg-primary transition-colors shadow-sm">
                <feature.icon size={24} strokeWidth={2.5} />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3 tracking-tight">
                {feature.title}
              </h3>
              <p className="text-sm md:text-base text-muted-foreground font-medium leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
