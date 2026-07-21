"use client"

import { KeyRound, MessageSquareText, ServerCog, UsersRound } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const features = [
  { title: "Real-Time Messaging", text: "Sends and receives messages through conversation rooms.", tech: "Socket.IO", icon: MessageSquareText, tint: "from-sky-100 to-blue-50 dark:from-sky-950/50 dark:to-blue-950/20" },
  { title: "Secure Authentication", text: "Handles signup, login, email verification, and token refresh.", tech: "JWT", icon: KeyRound, tint: "from-violet-100 to-slate-50 dark:from-violet-950/40 dark:to-zinc-900" },
  { title: "Invite-Based Collaboration", text: "Creates invite links and starts conversations after acceptance.", tech: "Invite Tokens", icon: UsersRound, tint: "from-emerald-100 to-cyan-50 dark:from-emerald-950/40 dark:to-cyan-950/20" },
  { title: "Deployment & DevOps", text: "Builds Docker images and automates delivery with Jenkins.", tech: "Docker + Jenkins", icon: ServerCog, tint: "from-orange-100 to-zinc-50 dark:from-orange-950/40 dark:to-zinc-900" },
]

export default function Features() {
  return (
    <section id="features" className="scroll-mt-28 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-normal text-blue-600">Core Features</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-normal sm:text-5xl">Features implemented to exercise the system boundaries.</h2>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {features.map(({ title, text, tech, icon: Icon, tint }) => (
            <Card key={title} className={`min-h-[320px] rounded-3xl bg-gradient-to-b ${tint} p-2 py-0`}>
              <div className="flex h-full flex-col rounded-[1.35rem] border border-white/70 bg-background/72 p-5 backdrop-blur dark:border-white/10">
                <CardHeader className="p-0">
                  <span className="flex size-11 items-center justify-center rounded-2xl border border-border bg-background text-blue-600">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <CardTitle className="mt-8 text-xl">{title}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col justify-between px-0 pb-0 pt-3">
                  <p className="text-sm leading-6 text-muted-foreground">{text}</p>
                  <span className="mt-8 w-fit rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">{tech}</span>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
