"use client"

const steps = [
  ["Authentication", "Implemented JWT authentication, refresh tokens, email verification, and password recovery."],
  ["Messaging", "Designed conversations, messages, pagination, unread counts, and read state updates."],
  ["Real-Time", "Integrated Socket.IO for live messages, conversation rooms, and online user events."],
  ["Docker", "Containerized the frontend and backend services for repeatable builds."],
  ["CI/CD", "Configured Jenkins pipelines to build and push Docker images."],
  ["Deployment", "Prepared AWS EC2 deployment flow with environment-based configuration."],
  ["Health Check", "Added a health endpoint used by the deployment pipeline to verify the backend is reachable."],
]

export default function Journey() {
  return (
    <section id="journey" className="scroll-mt-28 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-normal text-blue-600">Engineering Journey</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-normal sm:text-5xl">Implementation milestones across the stack.</h2>
          <p className="mt-5 text-base leading-7 text-muted-foreground">
            Each milestone maps to code that can be opened, explained, and demonstrated during a technical discussion.
          </p>
        </div>
        <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm sm:p-8">
          <div className="grid gap-0">
            {steps.map(([step, description], index) => (
              <div key={step} className="grid grid-cols-[44px_1fr] gap-4">
                <div className="flex flex-col items-center">
                  <span className="flex size-10 items-center justify-center rounded-full border border-border bg-background text-sm font-semibold text-blue-600">
                    {index + 1}
                  </span>
                  {index < steps.length - 1 && <span className="h-12 w-px bg-border" />}
                </div>
                <div className="pb-8">
                  <h3 className="font-semibold">{step}</h3>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
