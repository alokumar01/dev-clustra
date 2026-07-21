"use client"

const groups = [
  ["Frontend", ["Next.js", "React", "Tailwind CSS", "Shadcn UI"]],
  ["Backend", ["Node.js", "Express", "REST APIs", "Middleware"]],
  ["Database", ["MongoDB", "Mongoose", "Schema Design"]],
  ["Authentication", ["JWT", "Refresh Tokens", "Email Verification"]],
  ["Realtime", ["Socket.IO", "Rooms", "Events"]],
  ["DevOps", ["Docker", "Docker Compose", "Jenkins"]],
  ["Cloud", ["AWS EC2", "Deployment"]],
  ["Testing", ["Vitest", "Supertest", "Health Route"]],
]

export default function TechStack() {
  return (
    <section id="stack" className="scroll-mt-28 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-normal text-blue-600">Tech Stack</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-normal sm:text-5xl">Grouped by engineering responsibility.</h2>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {groups.map(([title, items]) => (
            <div key={title} className="rounded-2xl border border-border bg-card p-5">
              <h3 className="font-semibold">{title}</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {items.map((item) => (
                  <span key={item} className="rounded-full border border-border bg-secondary/65 px-3 py-1 text-xs font-medium text-muted-foreground">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
