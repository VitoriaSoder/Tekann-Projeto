import { Button } from "@/components/ui/button"
import { ThemeToggle } from "./theme-toggle"
import { LanguageToggle } from "./language-toggle"
import { Logo } from "@/components/brand/logo"
import { Heading } from "./heading"
import { Text } from "./text"

export function Navbar() {
  return (
    <nav className="sticky top-0 left-0 right-0 bg-background/80 backdrop-blur-md border-b flex z-50 py-4">
      <div className="container mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-black">
            <Logo size={18} strokeWidth={2} />
          </div>
          <Heading level={3} className="text-lg tracking-tight uppercase m-0">
            SportsCourt
          </Heading>
        </div>
        <div className="hidden md:flex gap-8">
          <a
            href="#"
            className="font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <Text variant="bold" tKey="navigation:for_clubs" as="span" className="text-sm" />
          </a>
          <a
            href="#"
            className="font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <Text variant="bold" tKey="navigation:for_players" as="span" className="text-sm" />
          </a>
          <a
            href="#"
            className="font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <Text variant="bold" tKey="navigation:rules" as="span" className="text-sm" />
          </a>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <LanguageToggle />
          <ThemeToggle />
          <Button
            variant="default"
            className="bg-primary text-black rounded-full hover:scale-105 transition-all px-6 font-black shadow-lg shadow-primary/10"
          >

            <Text variant="bold" tKey="navigation:sign_up" as="span" className="text-xs uppercase tracking-widest" />
          </Button>
        </div>
      </div>
    </nav>
  )
}
