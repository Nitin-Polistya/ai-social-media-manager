"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LogOut, Menu, Sparkles, X } from "lucide-react"

import { logoutUser } from "@/lib/firebase/auth-actions"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"

const NAV_LINKS = [
  { href: "/generator", label: "Generator" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/settings", label: "Settings" },
]

export function SiteHeader() {
  const { user } = useAuth()
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  async function handleLogout() {
    await logoutUser()
    setMobileOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md transition-colors duration-300">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold tracking-tight transition-opacity hover:opacity-80"
          onClick={() => setMobileOpen(false)}
        >
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Sparkles className="size-4" />
          </span>
          <span>SocialAI</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-3 md:flex md:gap-4">
          {NAV_LINKS.map((link) => (
            <Button key={link.href} asChild variant="ghost" size="sm">
              <Link href={link.href}>{link.label}</Link>
            </Button>
          ))}
          <ThemeToggle />
          {user ? (
            <Button type="button" variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut data-icon="inline-start" />
              Logout
            </Button>
          ) : null}
          <Button asChild size="sm" className="shadow-sm">
            <Link href="/generator">Get Started</Link>
          </Button>
        </nav>

        {/* Mobile toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen ? (
        <nav className="border-t border-border/60 bg-background px-4 py-4 md:hidden">
          <div className="flex flex-col gap-2">
            {NAV_LINKS.map((link) => (
              <Button
                key={link.href}
                asChild
                variant={pathname === link.href ? "secondary" : "ghost"}
                className="w-full justify-start rounded-xl"
                onClick={() => setMobileOpen(false)}
              >
                <Link href={link.href}>{link.label}</Link>
              </Button>
            ))}
            <Button asChild className="w-full rounded-xl" onClick={() => setMobileOpen(false)}>
              <Link href="/generator">Get Started</Link>
            </Button>
            {user ? (
              <Button
                type="button"
                variant="outline"
                className="w-full justify-start rounded-xl"
                onClick={handleLogout}
              >
                <LogOut data-icon="inline-start" />
                Logout
              </Button>
            ) : null}
          </div>
        </nav>
      ) : null}
    </header>
  )
}
