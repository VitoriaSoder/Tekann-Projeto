interface NavLinkProps {
  href: string
  children: React.ReactNode
}
export function NavLink({ href, children }: NavLinkProps) {
  return (
    <a
      href={href}
      className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
    >
      {children}
    </a>
  )
}
