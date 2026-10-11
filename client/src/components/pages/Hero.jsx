import Link from "next/link"
import { ArrowRight, ExternalLink, GitBranch, MessageCircle, Radio, TimerReset } from "lucide-react"

import { Button } from "@/components/ui/button"

const repoUrl = "https://github.com/alokumar01/dev-clustra"

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden px-4 pb-16 pt-32 sm:px-6 sm:pb-20 sm:pt-36 lg:px-8 lg:pb-24">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div className="max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Independent engineering project
          </p>
          <h1 className="mt-5 max-w-4xl text-[clamp(2.75rem,5.5vw,5rem)] font-semibold leading-[0.98] tracking-normal text-foreground">
            Real-time conversations. Built from the ground up.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
            Dev-Clustra is a real-time collaboration platform with persistent messaging and temporary chat sessions, built and deployed as a full-stack engineering project.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-12 rounded-full bg-foreground px-6 text-background hover:bg-foreground/90">
              <Link href="/login">
                Try Dev-Clustra
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 rounded-full border-border bg-transparent px-6 text-foreground hover:bg-secondary">
              <Link href="/session" target="_blank" rel="noreferrer">
                Create Temp Chat
                <ExternalLink className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>

          {/* <dl className="mt-10 grid max-w-2xl gap-4 border-y border-border py-5 sm:grid-cols-3">
            <HeroFact icon={MessageCircle} label="Persistent chats" value="MongoDB backed" />
            <HeroFact icon={Radio} label="Realtime layer" value="Socket.IO rooms" />
            <HeroFact icon={TimerReset} label="Temporary rooms" value="Expiring sessions" />
          </dl> */}
        </div>

        <ProductSystemVisual />
      </div>
    </section>
  )
}

function HeroFact({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-secondary text-primary">
        <Icon className="size-4" aria-hidden="true" />
      </span>
      <div>
        <dt className="text-sm font-semibold text-foreground">{label}</dt>
        <dd className="mt-1 font-mono text-xs text-muted-foreground">{value}</dd>
      </div>
    </div>
  )
}

function ProductSystemVisual() {
  return (
    <div className="relative mx-auto w-full max-w-2xl lg:ml-auto">
      <div className="rounded-2xl border border-border bg-card p-3 shadow-2xl shadow-black/20">
        <div className="flex items-center justify-between border-b border-border px-3 py-2.5">
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-red-400/80" aria-hidden="true" />
            <span className="size-2.5 rounded-full bg-yellow-400/80" aria-hidden="true" />
            <span className="size-2.5 rounded-full bg-[var(--success)]" aria-hidden="true" />
          </div>
          <span className="font-mono text-[11px] text-muted-foreground">dev-clustra / runtime map</span>
        </div>

        <div className="grid gap-3 p-3 sm:grid-cols-[1fr_0.9fr]">
          <div className="rounded-xl border border-border bg-background p-4">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">Product surface</p>
                <p className="mt-1 text-xs text-muted-foreground">Actual chat capabilities</p>
              </div>
              <span className="rounded-full border border-border px-2.5 py-1 font-mono text-[10px] text-muted-foreground">CLIENT</span>
            </div>
            <div className="space-y-2.5">
              <PreviewRow title="Direct conversations" detail="Stored message history, unread state, read receipts" />
              <PreviewRow title="Invite links" detail="Private conversation entry through generated invites" />
              <PreviewRow title="Temporary sessions" detail="Guest rooms for short-lived real-time chats" />
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

function PreviewRow({ title, detail }) {
  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <p className="text-sm font-semibold">{title}</p>
      <p className="mt-1 text-xs leading-5 text-muted-foreground">{detail}</p>
    </div>
  )
}

function SystemNode({ index, title, detail }) {
  return (
    <li className="grid grid-cols-[2.25rem_1fr] gap-3">
      <span className="font-mono text-xs text-primary">{index}</span>
      <span>
        <span className="block text-sm font-semibold">{title}</span>
        <span className="mt-1 block text-xs leading-5 text-muted-foreground">{detail}</span>
      </span>
    </li>
  )
}

function StatusChip({ label }) {
  return (
    <span className="flex items-center gap-2 rounded-full border border-border bg-background px-3 py-2 font-mono text-[11px] text-muted-foreground">
      <span className="size-1.5 rounded-full bg-[var(--success)]" aria-hidden="true" />
      {label}
    </span>
  )
}
