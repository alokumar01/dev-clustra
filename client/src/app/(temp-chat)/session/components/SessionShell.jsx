"use client"

import Link from "next/link"
import { Boxes, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export default function SessionShell({ children }) {
  const { resolvedTheme, setTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  return (
    <main className="min-h-screen bg-[#f8fafd] text-foreground dark:bg-[#09090b]">
      <header className="sticky top-0 z-30 border-b border-zinc-200/80 bg-white/85 backdrop-blur-xl dark:border-white/10 dark:bg-[#09090b]/82">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-blue-600 shadow-sm dark:border-white/10 dark:bg-zinc-950 dark:text-white">
              <Boxes className="size-4" aria-hidden="true" />
            </span>
            <span className="text-base font-semibold tracking-normal text-zinc-950 dark:text-white">
              DevClustra
            </span>
          </Link>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-9 rounded-lg border-zinc-200 bg-white text-zinc-700 shadow-sm hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-900"
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
