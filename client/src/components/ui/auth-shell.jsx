"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function AuthShell({
  badge,
  title,
  description,
  heroTitle,
  heroDescription,
  highlights,
  alternatePrompt,
  alternateHref,
  alternateLabel,
  children,
}) {
  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[linear-gradient(180deg,#f8fafc_0%,#eef2ff_42%,#ffffff_100%)] text-foreground">
      <div className="absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top_left,_rgba(15,23,42,0.08),_transparent_45%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.16),_transparent_35%)]" />
      <div className="absolute left-[-8rem] top-24 h-64 w-64 rounded-full bg-zinc-900/5 blur-3xl" />
      <div className="absolute bottom-10 right-[-6rem] h-72 w-72 rounded-full bg-sky-400/10 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl items-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid w-full overflow-hidden rounded-[28px] border border-border/70 bg-background/85 shadow-[0_24px_90px_rgba(15,23,42,0.14)] backdrop-blur xl:grid-cols-[1.08fr_0.92fr]">
          <section className="relative hidden min-h-[720px] flex-col justify-between bg-zinc-950 px-8 py-10 text-zinc-50 xl:flex">
            <div className="space-y-6">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/8 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-zinc-200">
                <Sparkles className="size-3.5" />
                Dev Clustra
              </div>

              <div className="space-y-4">
                <p className="text-sm font-medium text-zinc-300">Auth workspace</p>
                <h1 className="max-w-md text-4xl font-semibold leading-tight tracking-tight text-white">
                  {heroTitle}
                </h1>
                <p className="max-w-xl text-base leading-7 text-zinc-300">
                  {heroDescription}
                </p>
              </div>
            </div>

            <div className="grid gap-4">
              {highlights.map(({ icon: Icon, title: itemTitle, description: itemDescription }) => (
                <div
                  key={itemTitle}
                  className="rounded-2xl border border-white/10 bg-white/6 p-4 backdrop-blur-sm"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-white">
                      <Icon className="size-5" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-white">{itemTitle}</p>
                      <p className="text-sm leading-6 text-zinc-300">{itemDescription}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="flex items-center justify-center p-4 sm:p-6 lg:p-10">
            <Card className="w-full max-w-md border-none bg-transparent py-0 shadow-none ring-0">
              <CardHeader className="px-0 pt-0">
                <div className="inline-flex w-fit items-center rounded-full border border-border bg-background/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  {badge}
                </div>

                <div className="mt-2 space-y-2">
                  <CardTitle className="text-3xl font-semibold tracking-tight text-foreground">
                    {title}
                  </CardTitle>
                  <CardDescription className="text-sm leading-6 text-muted-foreground">
                    {description}
                  </CardDescription>
                </div>

                <div className="mt-3 grid gap-2 xl:hidden">
                  {highlights.map(({ icon: Icon, title: itemTitle }) => (
                    <div
                      key={itemTitle}
                      className="flex items-center gap-3 rounded-2xl border border-border/70 bg-muted/30 px-3 py-2"
                    >
                      <div className="flex size-8 items-center justify-center rounded-xl bg-zinc-950 text-white">
                        <Icon className="size-4" />
                      </div>
                      <p className="text-sm font-medium text-foreground">{itemTitle}</p>
                    </div>
                  ))}
                </div>
              </CardHeader>

              <CardContent className="px-0 pb-0">
                <div
                  className={cn(
                    "rounded-[24px] border border-border/70 bg-background/80 p-5 shadow-[0_12px_40px_rgba(15,23,42,0.06)] sm:p-6"
                  )}
                >
                  {children}
                </div>

                <p className="mt-6 text-center text-sm leading-6 text-muted-foreground">
                  {alternatePrompt}{" "}
                  <Link
                    href={alternateHref}
                    className="inline-flex items-center gap-1 font-semibold text-foreground transition hover:text-zinc-700"
                  >
                    {alternateLabel}
                    <ArrowRight className="size-4" />
                  </Link>
                </p>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </main>
  );
}
