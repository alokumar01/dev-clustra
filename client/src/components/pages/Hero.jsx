"use client"

import Link from "next/link"
import { ArrowRight, CheckCircle2, ExternalLink, Hash, MessageSquareText, Search, Send } from "lucide-react"

import { Button } from "@/components/ui/button"

const tech = ["Next.js", "Express", "MongoDB", "Socket.IO", "Docker", "AWS"]
const channels = ["architecture", "auth-flow", "socket-events", "deployment"]
const messages = [
  ["Aalok", "Auth middleware validates the access token before protected routes run."],
  ["Meera", "Socket rooms are joined when a conversation is opened."],
  ["Rohit", "Docker images are built for the client and backend services."],
]

export default function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pt-28 sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(113,113,122,0.10)_1px,transparent_1px),linear-gradient(to_bottom,rgba(113,113,122,0.10)_1px,transparent_1px)] bg-[size:44px_44px]" />
      <div className="absolute inset-x-0 top-0 -z-10 h-[620px] bg-[radial-gradient(circle_at_50%_10%,rgba(37,99,235,0.18),transparent_48%),radial-gradient(circle_at_25%_20%,rgba(34,211,238,0.12),transparent_28%),radial-gradient(circle_at_78%_16%,rgba(251,146,60,0.10),transparent_26%)]" />

      <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-border/80 bg-background/88 shadow-sm backdrop-blur-xl">
        <div className="mx-auto max-w-4xl px-6 pb-10 pt-24 text-center sm:px-10 lg:pt-28">
          <p className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-sm font-medium text-muted-foreground shadow-sm">
            <CheckCircle2 className="size-4 text-blue-600" aria-hidden="true" />
            Engineering Showcase
          </p>
          <h1 className="mt-6 text-4xl font-semibold tracking-normal text-foreground sm:text-6xl lg:text-7xl">
            A real-time developer collaboration platform built to explore backend engineering.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
            DevClustra brings authentication, REST APIs, real-time messaging, backend architecture, Docker, CI/CD, and deployment into one full-stack project.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild className="h-12 rounded-full bg-zinc-950 px-6 text-white hover:bg-zinc-800 dark:bg-blue-600 dark:hover:bg-blue-700">
              <Link href="/login">
                Start Chatting
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild variant="ghost" className="h-12 rounded-full px-6">
              <a href="https://github.com/alokumar01" target="_blank" rel="noreferrer">
                View GitHub
                <ExternalLink className="size-4" aria-hidden="true" />
              </a>
            </Button>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {tech.map((item) => (
              <span key={item} className="rounded-full border border-border bg-secondary/70 px-3 py-1 text-xs font-medium text-muted-foreground">
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="mx-auto max-w-5xl px-4 pb-8 sm:px-8 lg:pb-12">
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xl shadow-zinc-950/5 dark:shadow-black/30">
            <div className="flex h-12 items-center justify-between border-b border-border px-4">
              <div className="flex items-center gap-2">
                <span className="size-3 rounded-full bg-red-400" />
                <span className="size-3 rounded-full bg-yellow-400" />
                <span className="size-3 rounded-full bg-green-500" />
              </div>
              <div className="hidden items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground sm:flex">
                <Search className="size-3.5" aria-hidden="true" />
                Search project context
              </div>
            </div>
            <div className="grid min-h-[430px] md:grid-cols-[220px_1fr]">
              <aside className="border-b border-border bg-secondary/45 p-4 md:border-b-0 md:border-r">
                <p className="text-xs font-semibold uppercase tracking-normal text-muted-foreground">Workspace</p>
                <div className="mt-4 grid gap-2">
                  {channels.map((channel) => (
                    <div key={channel} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground first:bg-background first:text-foreground first:shadow-sm">
                      <Hash className="size-4" aria-hidden="true" />
                      {channel}
                    </div>
                  ))}
                </div>
              </aside>
              <div className="flex flex-col">
                <div className="flex items-center gap-3 border-b border-border p-4">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600">
                    <MessageSquareText className="size-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h2 className="text-sm font-semibold"># architecture</h2>
                    <p className="text-xs text-muted-foreground">Backend design, socket events, and deployment notes</p>
                  </div>
                </div>
                <div className="grid flex-1 gap-4 p-4">
                  {messages.map(([name, message]) => (
                    <div key={message} className="flex gap-3">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold">{name[0]}</span>
                      <div className="rounded-2xl border border-border bg-background px-4 py-3">
                        <p className="text-sm font-medium">{name}</p>
                        <p className="mt-1 text-sm leading-6 text-muted-foreground">{message}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-border p-4">
                  <div className="flex items-center justify-between rounded-2xl border border-border bg-background px-4 py-3 text-sm text-muted-foreground">
                    Document the next architecture decision...
                    <Send className="size-4 text-blue-600" aria-hidden="true" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
