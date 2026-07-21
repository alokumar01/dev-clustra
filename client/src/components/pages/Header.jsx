"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { ArrowRight, Boxes, ExternalLink, Menu, Moon, Sun, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const links = [
  { label: "Why", href: "#why" },
  { label: "Features", href: "#features" },
  { label: "Architecture", href: "#architecture" },
  // { label: "Stack", href: "#stack" },
  // { label: "GitHub", href: "https://github.com", external: true },
]

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background">
      <span className="flex size-9 items-center justify-center rounded-xl border border-border bg-background text-blue-600 shadow-sm dark:bg-secondary/70">
        <Boxes className="size-4" aria-hidden="true" />
      </span>
      <span className="text-base font-semibold tracking-normal text-foreground">DevClustra</span>
    </Link>
  )
}

function NavLinks({ onNavigate, className }) {
  return (
    <div className={cn("flex items-center gap-8", className)}>
      {links.map((link) =>
        link.external ? (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noreferrer"
            onClick={onNavigate}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            {link.label}
            <ExternalLink className="size-3.5" aria-hidden="true" />
          </a>
        ) : (
          <a
            key={link.label}
            href={link.href}
            onClick={onNavigate}
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            {link.label}
          </a>
        )
      )}
    </div>
  )
}

function MobileMenu({ open, onClose }) {
  return (
    <div className={cn("fixed inset-0 z-50 lg:hidden", open ? "pointer-events-auto" : "pointer-events-none")} aria-hidden={!open}>
      <button
        type="button"
        className={cn("absolute inset-0 bg-foreground/20 transition-opacity duration-200", open ? "opacity-100" : "opacity-0")}
        aria-label="Close navigation"
        onClick={onClose}
      />
      <aside
        className={cn(
          "absolute right-0 top-0 h-full w-[360px] max-w-[84vw] border-l border-border bg-background p-6 shadow-2xl transition-transform duration-200",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between">
          <Logo />
          <Button variant="ghost" size="icon" aria-label="Close navigation" onClick={onClose}>
            <X className="size-5" aria-hidden="true" />
          </Button>
        </div>
        <nav className="mt-10 flex flex-col gap-5" aria-label="Mobile navigation">
          <NavLinks onNavigate={onClose} className="items-start gap-5" />
          <div className="mt-5 grid gap-3 border-t border-border pt-5">
            <Button asChild variant="ghost" className="h-11 justify-start rounded-xl">
              <Link href="/login" onClick={onClose}>Login</Link>
            </Button>
            <Button asChild className="h-11 justify-start rounded-xl bg-blue-600 text-white hover:bg-blue-700">
              <Link href="/login" onClick={onClose}>
                Get Started
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </nav>
      </aside>
    </div>
  )
}

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="rounded-full"
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? <Sun className="size-4" aria-hidden="true" /> : <Moon className="size-4" aria-hidden="true" />}
    </Button>
  )
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <nav
        className={cn(
          "mx-auto mt-4 flex h-[64px] max-w-7xl items-center justify-between rounded-2xl border border-border/80 bg-background/80 px-4 shadow-sm backdrop-blur-xl transition-all duration-200 lg:px-6",
          scrolled && "max-w-6xl bg-background/90"
        )}
        aria-label="Primary navigation"
      >
        <Logo />
        <NavLinks className="hidden lg:flex" />
        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggle />
          <Button asChild variant="ghost" className="h-10 rounded-xl px-4">
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild className="h-10 rounded-xl bg-zinc-950 px-5 text-white hover:bg-zinc-800 dark:bg-blue-600 dark:hover:bg-blue-700">
            <Link href="/login">
              Get Started
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <Button variant="ghost" size="icon" aria-label="Open navigation" onClick={() => setOpen(true)}>
            <Menu className="size-5" aria-hidden="true" />
          </Button>
        </div>
      </nav>
      <MobileMenu open={open} onClose={() => setOpen(false)} />
    </header>
  )
}
