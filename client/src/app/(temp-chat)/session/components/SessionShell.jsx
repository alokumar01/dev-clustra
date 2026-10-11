"use client"

import Link from "next/link"
import { Boxes, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export default function SessionShell({ children }) {
  const { resolvedTheme, setTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border/70 bg-background/85 shadow-sm backdrop-blur-xl">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-xl border border-border bg-card text-primary shadow-sm">
              <Boxes className="size-4" aria-hidden="true" />
            </span>
            <span className="text-base font-semibold tracking-tight text-foreground">
              DevClustra
            </span>
          </Link>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-9 rounded-xl bg-background text-foreground"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
            title={isDark ? "Light theme" : "Dark theme"}
          >
            {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </Button>
        </nav>
      </header>
      {children}
    </main>
  )
}
