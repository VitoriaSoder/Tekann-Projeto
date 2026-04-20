import * as React from "react"
import { Languages } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Button } from "../ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { Text } from "./text"

export function LanguageToggle() {
  const { i18n } = useTranslation()
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 px-3 py-2.5 h-auto text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-all"
        >
          <Languages className="w-4.5 h-4.5 shrink-0" size={18} />
          <Text variant="bold" tKey="common:language" as="span" className="text-sm" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-56 rounded-xl border-border shadow-xl">
        <DropdownMenuItem onClick={() => changeLanguage("pt")} className="rounded-lg gap-2 cursor-pointer">
          <span className="text-xs font-bold">PT</span> <Text variant="inherit" as="span">Português</Text>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLanguage("en")} className="rounded-lg gap-2 cursor-pointer">
          <span className="text-xs font-bold">EN</span> <Text variant="inherit" as="span">English</Text>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
