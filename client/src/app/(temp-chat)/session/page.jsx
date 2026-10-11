import SessionActions from "./components/SessionActions"
import SessionShell from "./components/SessionShell"

export const metadata = {
  title: "Temp Chat - DevClustra",
  description: "Create or join temporary DevClustra chat sessions.",
}

export default function SessionPage() {
  return (
    <SessionShell>
      <section className="relative mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-7xl items-center overflow-hidden px-4 py-10 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0 -z-0 bg-[radial-gradient(ellipse_at_80%_20%,color-mix(in_oklch,var(--primary)_12%,transparent),transparent_42%),radial-gradient(ellipse_at_12%_82%,color-mix(in_oklch,var(--info)_8%,transparent),transparent_36%)]" aria-hidden="true" />
        <div className="relative z-10 grid w-full items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="max-w-xl motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-500 motion-reduce:animate-none">
            <p className="text-sm font-semibold text-primary">
              DevClustra Temp Chat
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              Start a clean temporary chat.
            </h1>
            <p className="mt-5 text-base leading-7 text-muted-foreground sm:text-lg">
              Create a room, share the code, and let guests join with a simple display name.
            </p>
          </div>

          <SessionActions />
        </div>
      </section>
    </SessionShell>
  )
}
