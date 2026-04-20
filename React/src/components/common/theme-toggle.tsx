import { Sun, Moon } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Text } from "./text"

export function ThemeToggle() {
  const { setTheme } = useTheme()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 px-3 py-2.5 h-auto text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-all"
        >
          <div className="relative w-4.5 h-4.5 flex items-center justify-center shrink-0">
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </div>
          <Text variant="inherit" tKey="common:theme" as="span" className="text-sm" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56 rounded-xl border-border shadow-xl">
        <DropdownMenuItem onClick={() => setTheme("light")} className="rounded-lg gap-2 cursor-pointer">
          <Sun size={14} />
          <Text variant="inherit" tKey="common:light" as="span" className="text-sm" />
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")} className="rounded-lg gap-2 cursor-pointer">
          <Moon size={14} />
          <Text variant="inherit" tKey="common:dark" as="span" className="text-sm" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
