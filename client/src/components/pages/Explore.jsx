import Link from "next/link"
import { ArrowRight, ExternalLink } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function Explore() {
  return (
    <section id="explore" className="scroll-mt-28 px-4 pb-10 pt-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-2xl border border-border bg-card p-6 sm:p-8 lg:p-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">Explore Dev-Clustra</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-normal sm:text-4xl">
              Try the app, then inspect how it is built.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
              Start with the working application or open the repository to review the client, backend, Socket.IO layer, Docker files, and Jenkins pipeline.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
            <Button asChild size="lg" className="h-12 rounded-full bg-foreground px-6 text-background hover:bg-foreground/90">
              <Link href="/login">
                Try Dev-Clustra
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 rounded-full border-border bg-transparent px-6 text-foreground hover:bg-secondary">
              <Link href="https://github.com/alokumar01/dev-clustra" target="_blank" rel="noreferrer">
                View source code
                <ExternalLink className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
