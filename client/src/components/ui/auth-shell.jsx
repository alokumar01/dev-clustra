"use client";

import Link from "next/link";
import { ArrowRight, Boxes } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { AnimatedShinyText } from "./animated-shiny-text";
import { AnimatedGradientText } from "./animated-gradient-text";

export function AuthShell({
  badge,
  title,
  description,
  highlights = [],
  alternatePrompt,
  alternateHref,
  alternateLabel,
  children,
}) {
  return (
    <main className="relative isolate h-dvh overflow-hidden bg-background text-foreground">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(113,113,122,0.10)_1px,transparent_1px),linear-gradient(to_bottom,rgba(113,113,122,0.10)_1px,transparent_1px)] bg-[size:42px_42px]" />
      <div className="absolute inset-x-0 top-0 -z-10 h-80 bg-[radial-gradient(circle_at_50%_0%,rgba(37,99,235,0.16),transparent_48%)]" />

      <div className="relative mx-auto flex h-dvh w-full items-center justify-center px-4 py-3 sm:px-6 lg:px-8">
        <section className="w-full max-w-lg">

          <Card className="w-full rounded-[2rem] border border-border/80 bg-background/90 p-0 shadow-xl shadow-zinc-950/10 backdrop-blur-xl dark:shadow-black/30">
            <CardHeader className="px-5 pb-0 pt-5 sm:px-6 sm:pt-6">
              <div className="flex items-center justify-between gap-4">
                <Link
                  href="/"
                  className="inline-flex shrink-0 items-center gap-2 rounded-full border border-border bg-secondary/55 py-1.5 pl-2 pr-3 text-sm font-semibold text-foreground shadow-sm backdrop-blur transition hover:bg-secondary"
                >
                  <span className="flex size-7 items-center justify-center rounded-full bg-blue-600 text-white shadow-sm shadow-blue-600/20">
                    <Boxes className="size-4" />
                  </span>
                  <span className="hidden sm:inline font-bold">
                  <AnimatedGradientText>
                    Dev Clustra
                  </AnimatedGradientText>
                  </span>
                </Link>

                <div className="inline-flex w-fit items-center rounded-full border border-border bg-background/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  <AnimatedShinyText> {badge} </AnimatedShinyText>
                </div>

              </div>

              <div className="mt-4 space-y-2">
                <CardTitle className="text-3xl font-semibold tracking-tight text-foreground">
                  {title}
                </CardTitle>
                <CardDescription className="text-sm leading-6 text-muted-foreground">
                  {description}
                </CardDescription>
              </div>

              {highlights.length > 0 && (
                <div className="mt-3 hidden gap-2 sm:grid">
                  {highlights.map(({ icon: Icon, title: itemTitle }) => (
                    <div
                      key={itemTitle}
                      className="flex items-center gap-3 rounded-2xl border border-border/70 bg-muted/30 px-3 py-1.5"
                    >
                      <div className="flex size-7 items-center justify-center rounded-xl bg-zinc-950 text-white dark:bg-blue-600">
                        <Icon className="size-4" />
                      </div>
                      <p className="text-sm font-medium text-foreground">{itemTitle}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardHeader>

            <CardContent className="px-5 pb-5 pt-4 sm:px-6 sm:pb-6">
              <div
                className={cn(
                  "rounded-[24px] border border-border/70 bg-background/80 p-4 shadow-[0_12px_40px_rgba(15,23,42,0.06)] sm:p-5"
                )}
              >
                {children}
              </div>

              {alternatePrompt && alternateHref && alternateLabel && (
                <p className="mt-4 text-center text-sm leading-6 text-muted-foreground">
                  {alternatePrompt}{" "}
                  <Link
                    href={alternateHref}
                    className="inline-flex items-center gap-1 font-semibold text-foreground transition hover:text-blue-600"
                  >
                    {alternateLabel}
                    <ArrowRight className="size-4" />
                  </Link>
                </p>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
