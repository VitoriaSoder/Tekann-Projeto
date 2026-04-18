import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function HeroCTA() {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
      <Link to="/auth/register">
        <Button size="lg" className="h-14 px-10 text-base font-bold rounded-full bg-foreground text-background hover:bg-foreground/90 transition-all hover:scale-[1.03] shadow-lg shadow-black/10 flex items-center gap-3">
          Começar Agora
          <ArrowRight size={18} strokeWidth={2.5} />
        </Button>
      </Link>
      <Link to="/auth/login">
        <Button size="lg" className="h-14 px-10 text-base font-bold rounded-full bg-primary text-black hover:bg-primary/90 transition-all hover:scale-[1.03] shadow-lg shadow-primary/20 flex items-center gap-3">
          Já tenho conta
        </Button>
      </Link>
    </div>
  )
}
