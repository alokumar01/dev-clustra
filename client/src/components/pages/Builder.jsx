import Link from "next/link"
import { ExternalLink, Github, Linkedin } from "lucide-react"

const links = [
  { label: "Portfolio", href: "https://aalokkumar.dev", icon: ExternalLink },
  { label: "GitHub", href: "https://github.com/alokumar01", icon: Github },
  { label: "LinkedIn", href: "https://linkedin.com/in/alokumar01", icon: Linkedin },
]

export default function Builder() {
  return (
    <section id="about" className="scroll-mt-28 px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto grid max-w-7xl gap-8 border-y border-border py-12 lg:grid-cols-[0.75fr_1.25fr] lg:items-center">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">The builder</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-normal sm:text-4xl">Alok Kumar</h2>
          <p className="mt-3 text-sm text-muted-foreground">Computer Science and Engineering student.</p>
        </div>

        <div>
          <p className="max-w-3xl text-xl leading-9 text-foreground">
            I built Dev-Clustra to explore what it takes to build and operate a real-time collaboration application - not just implement its interface, but handle messaging, session lifecycles, deployment, and monitoring.
          </p>
          <p className="mt-5 max-w-3xl text-base leading-7 text-muted-foreground">
            The hard parts were the useful parts: keeping real-time state understandable, separating persistent and temporary messaging, and deploying the backend through a repeatable container workflow.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {links.map(({ label, href, icon: Icon }) => (
              <Link
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center gap-2 rounded-full border border-border bg-card px-4 text-sm font-medium text-foreground transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                {label}
                <Icon className="size-4" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
