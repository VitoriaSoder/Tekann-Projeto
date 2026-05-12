import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { NavLink } from './nav-link'
import { ThemeToggle } from '@/components/common/theme-toggle'
import { LanguageToggle } from '@/components/common/language-toggle'
import { Logo } from '@/components/brand/logo'
import { Text } from '@/components/common/text'

const navItems = [
  { href: '#courts', tKey: 'navigation:courts' },
  { href: '#for-who', tKey: 'navigation:for_managers' },
  { href: '#how-it-works', tKey: 'navigation:how_it_works' },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const handleNavClick = () => setMobileOpen(false)

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 md:h-20 items-center justify-between px-4 md:px-6">
        <Logo size={18} iconClassName="w-8 h-8 md:w-9 md:h-9" textClassName="text-base md:text-xl" showText={true} />

        <div className="hidden lg:flex lg:gap-10">
          {navItems.map(item => (
            <NavLink key={item.href} href={item.href}>
              <Text tKey={item.tKey} as="span" className="font-medium" />
            </NavLink>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2 md:gap-4">
          <LanguageToggle />
          <ThemeToggle />
          <div className="h-6 w-px bg-border mx-2" />
          <Link to="/auth/login">
            <Button variant="ghost" className="h-11 px-6 rounded-full font-bold text-foreground hover:bg-accent transition-all">
              <Text variant="inherit" tKey="common:login" />
            </Button>
          </Link>
          <Link to="/auth/register">
            <Button className="h-11 px-6 rounded-full bg-primary text-black hover:bg-primary/90 font-bold transition-all hover:scale-105 shadow-sm">
              <Text variant="none" tKey="common:register" className="text-black" />
            </Button>
          </Link>
        </div>

        <div className="flex md:hidden items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(true)}
            className="rounded-xl"
          >
            <Menu size={22} />
          </Button>
        </div>
      </div>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="right" className="w-[280px] p-0 flex flex-col bg-card border-l border-border gap-0">
          <SheetTitle className="sr-only">Menu de navegação</SheetTitle>
          
          <div className="flex items-center gap-2 px-6 py-5 border-b border-border">
            <Logo size={14} iconClassName="w-8 h-8" textClassName="text-sm" showText={true} />
          </div>

          <nav className="flex flex-col px-4 py-4 gap-1 flex-1">
            {navItems.map(item => (
              <a
                key={item.href}
                href={item.href}
                onClick={handleNavClick}
                className="flex items-center px-4 py-3 rounded-xl text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
              >
                <Text tKey={item.tKey} />
              </a>
            ))}
            <div className="my-2 border-t border-border" />
            <div className="flex flex-col gap-1">
              <LanguageToggle />
              <ThemeToggle />
            </div>
          </nav>

          <div className="px-4 pb-6 pt-4 border-t border-border flex flex-col gap-3">
            <Link to="/auth/login" onClick={handleNavClick}>
              <Button variant="outline" className="w-full h-12 rounded-full font-bold text-foreground">
                <Text variant="inherit" tKey="common:login" />
              </Button>
            </Link>
            <Link to="/auth/register" onClick={handleNavClick}>
              <Button className="w-full h-12 rounded-full bg-primary text-black hover:bg-primary/90 font-bold shadow-sm">
                <Text variant="none" tKey="common:register" className="text-black" />
              </Button>
            </Link>
          </div>
        </SheetContent>
      </Sheet>
    </nav>
  )
}

