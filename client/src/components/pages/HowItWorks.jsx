const flows = [
  {
    title: "Persistent messaging",
    description: "A signed-in workflow for conversations users can return to later.",
    steps: ["Sign in", "Find or invite another user", "Start or open a conversation", "Exchange messages in real time"],
  },
  {
    title: "Temporary messaging",
    description: "A guest-friendly workflow for short-lived rooms.",
    steps: ["Create a temporary session", "Share the session invitation", "Join and exchange messages", "The session expires or is closed"],
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-28 px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-[0.65fr_1fr] lg:items-end">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">How it works</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-normal sm:text-4xl lg:text-5xl">
              Two workflows, separated by intent.
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-7 text-muted-foreground lg:ml-auto">
            The landing page keeps persistent chat and temporary chat separate because they use different product flows and different data lifecycles.
          </p>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          {flows.map((flow) => (
            <section key={flow.title} aria-label={flow.title} className="rounded-2xl border border-border bg-card">
              <div className="border-b border-border p-5 sm:p-6">
                <h3 className="text-xl font-semibold">{flow.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{flow.description}</p>
              </div>
              <ol className="divide-y divide-border">
                {flow.steps.map((step, index) => (
                  <li key={step} className="grid grid-cols-[3.5rem_1fr] items-center gap-4 p-5 sm:p-6">
                    <span className="font-mono text-sm text-primary">{String(index + 1).padStart(2, "0")}</span>
                    <span className="text-sm font-medium sm:text-base">{step}</span>
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>
      </div>
    </section>
  )
}
