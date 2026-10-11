import { CheckCheck, ArrowRight, Clock3, Database, Eye, MessageCircle, Radio, TimerReset, UsersRound } from "lucide-react"
import Link from "next/link"
import { Button } from "../ui/button"

const capabilities = [
  {
    id: "conversations",
    eyebrow: "Persistent conversations",
    title: "Return to the same conversation history.",
    description:
      "Signed-in users can open direct conversations, keep message history, and use invite links to start private chats.",
    notes: ["MongoDB stores conversation and message documents", "Unread counts and read state help users catch up"],
    visual: "persistent",
  },
  {
    id: "realtime",
    eyebrow: "Real-time messaging",
    title: "Messages and presence move through Socket.IO.",
    description:
      "The client stays connected to the backend socket layer for live delivery, online presence, typing state, and read receipts.",
    notes: ["Socket rooms scope updates to the right conversation", "REST handles account and invite actions"],
    visual: "realtime",
  },
  {
    id: "ephemeral",
    eyebrow: "Temporary chat sessions",
    title: "Create a short-lived room without a permanent chat.",
    description:
      "Temporary sessions let guests join by invitation and exchange messages for the life of the session.",
    notes: ["Session metadata is tracked separately", "Ephemeral chat messages are handled in memory instead of persistent MongoDB message documents"],
    visual: "temporary",
  },
]

export default function Features() {
  return (
    <section id="features" className="scroll-mt-28 border-y border-border bg-secondary/30 px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 border-b border-border pb-10 lg:grid-cols-[0.7fr_1fr] lg:items-end">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">What you can do</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-normal sm:text-4xl lg:text-5xl">
              The product has two clear modes of communication.
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-7 text-muted-foreground lg:ml-auto">
            Dev-Clustra separates saved conversations from temporary sessions, so visitors can understand where data persists and where a room is meant to be short-lived.
          </p>
        </div>

        <div className="divide-y divide-border">
          {capabilities.map((capability, index) => (
            <Capability key={capability.id} capability={capability} index={index} />
          ))}
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg" className="h-10 rounded-full bg-foreground px-6 text-background hover:bg-foreground/90">
            <Link href="/session">
              Create Temp Chat
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

function Capability({ capability, index }) {
  const reverse = index % 2 === 1

  return (
    <article id={capability.id} className="scroll-mt-28 py-12 lg:py-16">
      <div className={`grid gap-8 lg:grid-cols-2 lg:items-center ${reverse ? "lg:[&>*:first-child]:order-2" : ""}`}>
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">{capability.eyebrow}</p>
          <h3 className="mt-4 max-w-xl text-2xl font-semibold tracking-normal sm:text-3xl">{capability.title}</h3>
          <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">{capability.description}</p>
          <ul className="mt-6 space-y-3">
            {capability.notes.map((note) => (
              <li key={note} className="flex gap-3 text-sm leading-6 text-muted-foreground">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[var(--success)]" aria-hidden="true" />
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>
        <CapabilityVisual type={capability.visual} />
      </div>
    </article>
  )
}

function CapabilityVisual({ type }) {
  if (type === "persistent") return <PersistentVisual />
  if (type === "realtime") return <RealtimeVisual />
  return <TemporaryVisual />
}

function VisualShell({ title, subtitle, children }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
        <div>
          <p className="text-sm font-semibold">{title}</p>
          <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
        </div>
        <span className="rounded-full border border-border px-2.5 py-1 font-mono text-[10px] text-muted-foreground">UI</span>
      </div>
      {children}
    </div>
  )
}

function PersistentVisual() {
  return (
    <VisualShell title="Conversation list" subtitle="Saved conversations and read state">
      <div className="space-y-2">
        <ConversationRow name="Maya Chen" message="That works for me." meta="Read" active />
        <ConversationRow name="Alex Rivera" message="Sent you the notes" meta="2 unread" unread />
        <ConversationRow name="Jordan Lee" message="See you in the room" meta="Yesterday" />
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <SmallMetric icon={Database} label="Stored messages" value="MongoDB documents" />
        <SmallMetric icon={CheckCheck} label="Message state" value="Read and unread" />
      </div>
    </VisualShell>
  )
}

function RealtimeVisual() {
  return (
    <VisualShell title="Socket event path" subtitle="Live updates scoped by rooms">
      <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
        <EventBox title="Client" detail="Emit message, typing, read" />
        <Radio className="mx-auto size-5 text-primary" aria-hidden="true" />
        <EventBox title="Socket.IO server" detail="Validate, route, broadcast" />
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        <State label="Online" icon={<span className="size-2 rounded-full bg-[var(--success)]" />} />
        <State label="Typing" icon={<TypingDots />} />
        <State label="Read" icon={<CheckCheck className="size-4 text-primary" />} />
      </div>
    </VisualShell>
  )
}

function TemporaryVisual() {
  return (
    <VisualShell title="Temporary room" subtitle="Guest entry and expiring session">
      <div className="rounded-xl border border-dashed border-border bg-background p-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Session code</p>
        <p className="mt-2 font-mono text-3xl font-semibold tracking-[0.18em]">4827</p>
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <SmallMetric icon={UsersRound} label="Guest join" value="Display name entry" />
        <SmallMetric icon={TimerReset} label="Lifecycle" value="Expires or closes" />
      </div>
      {/* <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
        <Clock3 className="size-3.5 text-primary" aria-hidden="true" />
      </div> */}
    </VisualShell>
  )
}

function ConversationRow({ name, message, meta, active = false, unread = false }) {
  return (
    <div className={`flex items-center gap-3 rounded-xl border p-3 ${active ? "border-primary/35 bg-primary/10" : "border-border bg-background"}`}>
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold">
        {name.split(" ").map((part) => part[0]).join("")}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{name}</p>
        <p className="mt-1 truncate text-xs text-muted-foreground">{message}</p>
      </div>
      <span className={`shrink-0 font-mono text-[11px] ${unread ? "text-primary" : "text-muted-foreground"}`}>{meta}</span>
    </div>
  )
}

function SmallMetric({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl border border-border bg-background p-3">
      <Icon className="size-4 text-primary" aria-hidden="true" />
      <p className="mt-3 text-sm font-semibold">{label}</p>
      <p className="mt-1 font-mono text-[11px] text-muted-foreground">{value}</p>
    </div>
  )
}

function EventBox({ title, detail }) {
  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <p className="text-sm font-semibold">{title}</p>
      <p className="mt-2 text-xs leading-5 text-muted-foreground">{detail}</p>
    </div>
  )
}

function State({ icon, label }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-sm">
      <span className="flex size-5 items-center justify-center" aria-hidden="true">{icon}</span>
      {label}
    </div>
  )
}

function TypingDots() {
  return (
    <span className="flex items-center gap-0.5" aria-hidden="true">
      <span className="size-1 rounded-full bg-primary" />
      <span className="size-1 rounded-full bg-primary/70" />
      <span className="size-1 rounded-full bg-primary/40" />
    </span>
  )
}
