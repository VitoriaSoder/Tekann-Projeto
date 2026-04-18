export function Footer() {
  return (
    <footer className="py-24 border-t border-border bg-background">
      <div className="container px-6 flex flex-col items-center gap-16 text-center">
        <div className="flex flex-col gap-6 items-center">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-black">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="3" y1="9" x2="21" y2="9" />
                <line x1="9" y1="21" x2="9" y2="9" />
                <line x1="15" y1="21" x2="15" y2="9" />
              </svg>
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase text-foreground">
              SportsCourt
            </span>
          </div>
          <p className="text-base text-muted-foreground font-medium max-w-sm leading-relaxed">
            A plataforma definitiva para gestão de arenas e reserva de quadras. Simplicidade e eficiência em cada clique.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-x-12 gap-y-6">
          {[
            { label: 'Como Funciona', href: '#how-it-works' },
            { label: 'Para Gestores', href: '#for-who' },
            { label: 'Para Usuários', href: '#for-who' },
          ].map((link) => (
            <a key={link.label} href={link.href} className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors">
              {link.label}
            </a>
          ))}
        </div>
        <div className="flex flex-col gap-8 items-center pt-8 border-t border-border w-full max-w-4xl">
          <div className="flex justify-center gap-5">
            {[
              { path: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" },
              { path: "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z M17.5 6.5h.01" },
              { path: "M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" }
            ].map((icon, i) => (
              <a key={i} href="#" className="w-11 h-11 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground transition-all">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d={icon.path} />
                </svg>
              </a>
            ))}
          </div>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">
            © 2026 SportsCourt • Gestão profissional de arenas esportivas
          </p>
        </div>
      </div>
    </footer>
  )
}
