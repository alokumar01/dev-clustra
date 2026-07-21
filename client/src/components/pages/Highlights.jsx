"use client"

import { Check } from "lucide-react"

const highlights = ["JWT Authentication", "Refresh Token Flow", "Invite-Based User Onboarding", "Socket.IO Messaging", "Conversation Pagination", "Dockerized Development", "Jenkins CI/CD", "REST API Structure"]

export default function Highlights() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-[2rem] border border-border bg-background p-6 shadow-sm sm:p-10 lg:p-14">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-normal text-blue-600">Project Highlights</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal sm:text-5xl">Implemented work that can be reviewed in code.</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {highlights.map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-xl border border-border bg-secondary/45 px-4 py-3 text-sm font-medium">
                <span className="flex size-6 items-center justify-center rounded-full bg-blue-600 text-white">
                  <Check className="size-3.5" aria-hidden="true" />
                </span>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
