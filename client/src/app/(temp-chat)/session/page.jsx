import SessionActions from "./components/SessionActions"
import SessionShell from "./components/SessionShell"

export const metadata = {
  title: "Temp Chat - DevClustra",
  description: "Create or join temporary DevClustra chat sessions.",
}

export default function SessionPage() {
  return (
    <SessionShell>
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-7xl items-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid w-full items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="max-w-xl">
            <p className="text-sm font-medium text-blue-600 dark:text-zinc-400">
              DevClustra Temp Chat
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-normal text-zinc-950 sm:text-5xl dark:text-white">
              Start a clean temporary chat.
            </h1>
            <p className="mt-5 text-base leading-7 text-zinc-600 sm:text-lg dark:text-zinc-400">
              Create a room, share the code, and let guests join with a simple display name.
            </p>
          </div>

          <SessionActions />
        </div>
      </section>
    </SessionShell>
  )
}
