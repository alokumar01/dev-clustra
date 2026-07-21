"use client"

import { CheckCircle2, XCircle } from "lucide-react"

const typical = ["Message interface", "Login and sessions", "Conversation data", "Deployment workflow"]
const devclustra = ["Authentication and refresh tokens", "REST APIs and Socket.IO events", "Invite-based conversations", "Docker, Jenkins, and AWS deployment"]

export default function WhyDevClustra() {
  return (
    <section id="why" className="scroll-mt-28 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-[2rem] border border-border bg-card p-6 shadow-sm sm:p-10 lg:p-14">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-normal text-blue-600">Why DevClustra</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-normal sm:text-5xl">Collaborative apps look simple until the system is implemented.</h2>
          <p className="mt-5 text-base leading-7 text-muted-foreground">
            I built DevClustra to connect the parts that usually sit behind a messaging interface: identity, API design, real-time events, persistence, deployment, and client state.
          </p>
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-2">
          <Comparison title="Surface Area" items={typical} negative />
          <Comparison title="Implemented Focus" items={devclustra} />
        </div>
      </div>
    </section>
  )
}

function Comparison({ title, items, negative = false }) {
  const Icon = negative ? XCircle : CheckCircle2

  return (
    <div className="rounded-2xl border border-border bg-background p-5">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="mt-5 grid gap-3">
        {items.map((item) => (
          <div key={item} className="flex items-center gap-3 rounded-xl bg-secondary/55 px-4 py-3 text-sm">
            <Icon className={negative ? "size-4 text-muted-foreground" : "size-4 text-blue-600"} aria-hidden="true" />
            {item}
          </div>
        ))}
      </div>
    </div>
  )
}
