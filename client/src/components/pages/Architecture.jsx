"use client"

import { Cloud, Container, Database, FileCheck, Globe, Monitor, RadioTower, Server } from "lucide-react"

const nodes = [
  ["Browser", "Client workspace", Monitor],
  ["Next.js", "App Router UI", Globe],
  ["Express API", "REST services", Server],
  ["Socket.IO", "Realtime gateway", RadioTower],
  ["MongoDB", "Persistent data", Database],
  ["Docker", "Containers", Container],
  ["AWS EC2", "Cloud runtime", Cloud],
  ["Health Route", "Deployment check", FileCheck],
]

export default function Architecture() {
  return (
    <section id="architecture" className="scroll-mt-28 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-[2rem] border border-border bg-secondary/35 p-6 sm:p-10 lg:p-14">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-normal text-blue-600">System Architecture</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal sm:text-5xl">Client, API, realtime, data, and deployment layers.</h2>
            <p className="mt-5 text-base leading-7 text-muted-foreground">
              The browser renders the Next.js client. API requests go through Express routes and middleware. Socket.IO handles realtime events, MongoDB stores application data, and Docker images are used in the deployment pipeline.
            </p>
          </div>

          <div className="rounded-3xl border border-border bg-background p-4 shadow-sm">
            <div className="grid gap-4 sm:grid-cols-2">
              {nodes.map(([title, label, Icon], index) => (
                <div key={title} className="relative rounded-2xl border border-border bg-card p-4">
                  <div className="flex items-center gap-3">
                    <span className="flex size-10 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="text-sm font-semibold">{title}</h3>
                      <p className="text-xs text-muted-foreground">{label}</p>
                    </div>
                  </div>
                  {index < nodes.length - 1 && (
                    <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="h-px flex-1 bg-border" />
                      connected
                      <span className="h-px flex-1 bg-border" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
