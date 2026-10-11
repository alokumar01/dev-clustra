import { Boxes, Database, GitBranch, Gauge, Globe2, Radio, Server, ShieldCheck } from "lucide-react"

const architecture = [
  { label: "Next.js frontend", detail: "Routes, landing page, chat client", icon: Globe2 },
  { label: "REST APIs", detail: "Auth, invites, sessions, conversations", icon: ShieldCheck },
  { label: "Socket.IO", detail: "Realtime delivery, presence, read state", icon: Radio },
  { label: "Node + Express", detail: "Modular controllers, services, middleware", icon: Server },
  { label: "MongoDB", detail: "Users, invites, conversations, messages", icon: Database },
]

const deployment = ["Source changes", "Jenkins pipeline", "Docker image", "Kubernetes rollout", "Health check"]

const groups = [
  { title: "Client", items: ["Next.js", "React", "Tailwind CSS", "shadcn/ui", "Zustand"] },
  { title: "Backend", items: ["Node.js", "Express", "Socket.IO", "JWT cookies", "Mongoose"] },
  { title: "Infrastructure", items: ["Docker", "Docker Hub", "Jenkins", "AWS EC2", "Kubernetes"] },
  { title: "Operations", items: ["Nginx", "Prometheus", "Grafana", "Loki"] },
]

export default function EngineeringShowcase() {
  return (
    <section id="architecture" className="scroll-mt-28 border-y border-border bg-secondary/30 px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-[0.7fr_1fr] lg:items-end">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">Engineering and deployment</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-normal sm:text-4xl lg:text-5xl">
              Built as an application, not just a landing page.
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-7 text-muted-foreground lg:ml-auto">
            The project includes a real-time product surface, a modular backend, persistent data models, container images, and a Jenkins-driven deployment path.
          </p>
        </div>

        <div className="mt-12 grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-2xl border border-border bg-card">
            <div className="border-b border-border p-5 sm:p-6">
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">System architecture</p>
            </div>
            <ol className="divide-y divide-border">
              {architecture.map(({ label, detail, icon: Icon }, index) => (
                <li key={label} className="grid gap-4 p-5 sm:grid-cols-[3rem_1fr_auto] sm:items-center sm:p-6">
                  <span className="flex size-11 items-center justify-center rounded-xl border border-border bg-background text-primary">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-base font-semibold">{label}</span>
                    <span className="mt-1 block text-sm leading-6 text-muted-foreground">{detail}</span>
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
                </li>
              ))}
            </ol>
          </div>

          <div id="deployment" className="scroll-mt-28 rounded-2xl border border-border bg-card">
            <div className="border-b border-border p-5 sm:p-6">
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">Deployment path</p>
              <h3 className="mt-3 text-xl font-semibold">CI builds and ships the backend image.</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                The repository contains Jenkins CI/CD files. The CD pipeline updates the backend Kubernetes deployment and verifies the public health endpoint.
              </p>
            </div>
            <ol className="p-5 sm:p-6">
              {deployment.map((step, index) => (
                <li key={step} className="grid grid-cols-[2.5rem_1fr] gap-3 pb-5 last:pb-0">
                  <span className="font-mono text-xs text-primary">{String(index + 1).padStart(2, "0")}</span>
                  <span className="border-b border-border pb-5 text-sm font-medium last:border-b-0 last:pb-0">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {groups.map((group) => (
            <div key={group.title} className="rounded-2xl border border-border bg-card p-5">
              <div className="mb-4 flex items-center gap-2">
                {group.title === "Infrastructure" ? <Boxes className="size-4 text-primary" aria-hidden="true" /> : <Gauge className="size-4 text-primary" aria-hidden="true" />}
                <h3 className="text-sm font-semibold">{group.title}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span key={item} className="rounded-full border border-border bg-background px-3 py-1.5 font-mono text-[11px] text-muted-foreground">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 flex items-center gap-2 rounded-2xl border border-border bg-card p-5 text-sm leading-6 text-muted-foreground">
          <GitBranch className="size-4 shrink-0 text-primary" aria-hidden="true" />
          Frontend and backend containerization are present in the repo; the checked Jenkins CD file currently updates the backend deployment image.
        </div>
      </div>
    </section>
  )
}
