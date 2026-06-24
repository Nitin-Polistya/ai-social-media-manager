"use client"

import { Moon, Sun } from "lucide-react"

import { useTheme } from "@/components/theme-provider"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const isDark = theme === "dark"

  return (
    <div className="flex items-center gap-2">
      <Sun className="size-4 text-muted-foreground" aria-hidden />
      <Switch
        id="theme-toggle"
        checked={isDark}
        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
        aria-label="Toggle dark mode"
      />
      <Moon className="size-4 text-muted-foreground" aria-hidden />
      <Label htmlFor="theme-toggle" className="sr-only">
        Dark mode
      </Label>
    </div>
  )
}
