"use client"

import { Check, Copy, ExternalLink, ShieldCheck } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function SessionCodeCard({ copied, onCopy }) {
  return (
    <Card className="rounded-xl border-emerald-500/30 bg-emerald-500/5">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <ShieldCheck className="size-4 text-emerald-600" aria-hidden="true" />
              Session ready
            </CardTitle>
            <CardDescription className="mt-1">
              Share this code or open the room when your backend is connected.
            </CardDescription>
          </div>
          <Badge variant="outline" className="rounded-full border-emerald-500/40 text-emerald-700 dark:text-emerald-300">
            Active
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between rounded-xl border border-border bg-background px-4 py-3">
          <div>
            <p className="text-xs font-medium uppercase text-muted-foreground">Session code</p>
            <p className="mt-1 font-mono text-2xl font-semibold tracking-normal">A7K9Q2</p>
          </div>
          <Button type="button" variant="outline" className="h-9" onClick={onCopy}>
            {copied ? <Check className="size-4 text-emerald-600" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <Button className="h-10 bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-blue-600 dark:hover:bg-blue-700">
            Open session
            <ExternalLink className="size-4" aria-hidden="true" />
          </Button>
          <Button variant="outline" className="h-10">
            Share invite
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
