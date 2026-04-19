import { useState } from "react"
import { Outlet, NavLink, useNavigate } from "react-router-dom"
import { LayoutDashboard, CalendarDays, BookOpen, Trophy, User, LogOut, Menu } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/logic/store/hooks"
import { clearAuth } from "@/logic/store/slices/auth-slice"
import { removeCookie } from "@/helpers/cookie-utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "./theme-toggle"
import { LanguageToggle } from "./language-toggle"
import { useTranslation } from "react-i18next"
import { Logo } from "@/components/brand/logo"
import { Heading } from "./heading"
import { Text } from "./text"

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const user = useAppSelector(s => s.auth.user)
  const isAdmin = user?.role === "ADMIN"
  const { t } = useTranslation()

  const handleLogout = () => {
    removeCookie("token")
    dispatch(clearAuth())
    navigate("/auth/login")
  }

  const navItems = [
    { to: "/dashboard", label: t("navigation:dashboard"), icon: LayoutDashboard },
    ...(isAdmin ? [{ to: "/courts", label: t("navigation:courts"), icon: Trophy }] : []),
    { to: "/schedule", label: t("navigation:schedule"), icon: CalendarDays },
    { to: "/reservations", label: t("navigation:reservations"), icon: BookOpen },
  ]

  return (
    <>
      <div className="px-6 py-5 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground shrink-0">
            <Logo size={16} strokeWidth={2.5} showText={false} />
          </div>
          <Heading level={4} className="text-base tracking-tight uppercase m-0">SportsCourt</Heading>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                isActive
                  ? "bg-primary/20 text-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )
            }
          >
            <item.icon className="shrink-0" size={18} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 pb-4 space-y-1 border-t border-border pt-4">
        <LanguageToggle />
        <ThemeToggle />
        <NavLink
          to="/profile"
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
              isActive
                ? "bg-primary/20 text-foreground font-semibold"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )
          }
        >
          <User size={18} className="shrink-0" />
          <Text variant="bold" tKey="common:profile" as="span" className="text-sm" />
        </NavLink>

        <div className="px-3 py-2 mb-1">
          <Text variant="bold" className="text-xs truncate">{user?.name}</Text>
          <Text variant="muted" className="text-xs truncate">{user?.email}</Text>
        </div>

        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start gap-3 px-3 py-2.5 h-auto text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl"
        >
          <LogOut size={18} className="shrink-0" />
          <Text variant="bold" tKey="common:logout" as="span" className="text-sm" />
        </Button>
      </div>

    </>
  )
}

export function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <aside className="hidden md:flex w-64 shrink-0 bg-card border-r border-border flex-col sticky top-0 h-screen">
        <SidebarContent />
      </aside>

      <div className="md:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-card border-b border-border flex items-center justify-between px-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground shrink-0">
            <Logo size={13} strokeWidth={2.5} showText={false} />
          </div>
          <Heading level={4} className="text-sm tracking-tight uppercase m-0">SportsCourt</Heading>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileOpen(true)}
          className="rounded-xl"
        >
          <Menu size={20} />
        </Button>
      </div>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="p-0 w-72 flex flex-col bg-card border-r border-border gap-0">
          <SheetTitle className="sr-only">Menu de navegação</SheetTitle>
          <SidebarContent onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      <main className="flex-1 min-w-0 overflow-auto pt-14 md:pt-0">
        <Outlet />
      </main>
    </div>
  )
}
