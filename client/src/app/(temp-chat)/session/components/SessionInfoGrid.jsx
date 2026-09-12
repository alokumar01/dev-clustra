"use client"

import { Clock3, DatabaseZap, RefreshCw, UserRoundCog } from "lucide-react"

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const items = [
  {
    title: "What is an ephemeral chat room?",
    text: "A short-lived conversation space that exists for quick coordination, then disappears when the session expires.",
    icon: Clock3,
  },
  {
    title: "No permanent group",
    text: "Guests join by code, use a temporary identity, and do not need to create an account.",
    icon: UserRoundCog,
  },
  {
    title: "Live-first messages",
    text: "Phase 1 is designed for real-time delivery, not historical chat loading.",
    icon: DatabaseZap,
  },
  {
    title: "Ready to extend",
    text: "The same session model can later support presence, Redis buffers, files, voice, or encryption.",
    icon: RefreshCw,
  },
]

export default function SessionInfoGrid() {
  return (
    <section className="grid gap-3 md:grid-cols-2">
      {items.map((item) => {
        const Icon = item.icon

        return (
          <Card key={item.title} className="rounded-xl border-border/90">
            <CardHeader>
              <span className="flex size-9 items-center justify-center rounded-lg bg-secondary text-blue-600">
                <Icon className="size-4" aria-hidden="true" />
              </span>
              <CardTitle className="pt-1 text-base">{item.title}</CardTitle>
              <CardDescription className="leading-6">{item.text}</CardDescription>
            </CardHeader>
          </Card>
        )
      })}
    </section>
  )
}
