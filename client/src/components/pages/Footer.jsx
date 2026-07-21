"use client"

import Link from "next/link"
import { ArrowRight, Boxes, ExternalLink } from "lucide-react"

import { Button } from "@/components/ui/button"

const links = [
  { label: "GitHub", href: "https://github.com/alokumar01" },
  { label: "Portfolio", href: "https://aalokkumar.dev" },
  { label: "LinkedIn", href: "https://linkedin.com/in/alokumar01" },
]

export default function Footer() {
  return (
    <footer className="px-4 pb-8 pt-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-border bg-secondary/45 shadow-sm">
        <div className="grid gap-8 border-b border-border bg-background p-6 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center lg:p-14">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Project walkthrough</p>
            <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-normal sm:text-5xl">Open the app and review the implemented flows.</h2>
          </div>
          <Button asChild className="h-12 w-fit rounded-full bg-zinc-950 px-6 text-white hover:bg-zinc-800 dark:bg-blue-600 dark:hover:bg-blue-700">
            <Link href="/login">
              Open App
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
        <div className="grid gap-8 p-6 sm:p-10 lg:grid-cols-[1fr_auto] lg:p-14">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center rounded-xl border border-border bg-background text-blue-600">
                <Boxes className="size-4" aria-hidden="true" />
              </span>
              <span className="font-semibold">DevClustra</span>
            </div>
            <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
              DevClustra is a full-stack engineering project exploring authentication, real-time communication, backend architecture, and DevOps workflows.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                {link.label}
                <ExternalLink className="size-3" aria-hidden="true" />
               </Link>
            ))}
          </div>
        </div>
        <div className="border-t border-border px-6 py-4 text-sm text-muted-foreground sm:px-10 lg:px-14">
          Copyright 2026 DevClustra. Designed and developed by Aalok Kumar.
        </div>
      </div>
    </footer>
  )
}
