"use client"

import { useMemo, useState } from "react"
import {
  AlertCircle,
  ArrowRight,
  Hash,
  Loader2,
  MessageSquarePlus,
  UsersRound,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { createSession } from "@/app/services/session.service"
import { useRouter } from "next/navigation"

function normalizeCode(value) {
  return value.replace(/[^a-z0-9]/gi, "").slice(0, 4).toUpperCase()
}

export default function SessionActions() {
  const [code, setCode] = useState("")
  const [createState, setCreateState] = useState("idle")
  const [createError, setCreateError] = useState("")
  const [joinState, setJoinState] = useState("idle")
  const router = useRouter();

  const joinMessage = useMemo(() => {
    if (joinState === "invalid") return "Enter a valid 4-character session code."
    return ""
  }, [joinState])

  // CREATE SESSION
  const handleCreateSession = async () => {
    if (createState === "creating") return

    setCreateState("creating")
    setCreateError("")

    try {
      const res = await createSession();
      const url = res?.data?.url;

      if (url) {
        toast.success("Session Created Successfully!")
        router.push(url);
      } else {
        throw new Error("URL missing from API response");
      }

    } catch (error) {
      const message = error?.response?.data?.message || "Could not create a session. Check your connection and try again."
      setCreateError(message)
      toast.error(message)
      setCreateState("idle")
    } finally {
      setCreateState((current) => current === "creating" ? "idle" : current)
    }
  }

  // JOIN SESSION BY CODE
  function handleJoinSession(e) {
    e.preventDefault()
    const normalizedCode = normalizeCode(code)

    if (normalizedCode.length !== 4) {
      setJoinState("invalid")
      return
    }

    setJoinState("joining")
    router.push(`/session/${normalizedCode}`)
  }

  return (
    <div className="grid gap-4 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-500 motion-reduce:animate-none">
      <Card className="rounded-2xl border-border/80 bg-card/95 shadow-sm backdrop-blur">
        <CardHeader>
          <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <MessageSquarePlus className="size-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <CardTitle className="text-lg text-card-foreground">Create Session</CardTitle>
              <CardDescription className="mt-2 leading-6">
                Start a room and share its invite code.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {createError && (
            <p role="alert" className="mb-3 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm leading-6 text-destructive">
              {createError}
            </p>
          )}
          <Button
            type="button"
            className="h-11 w-full rounded-xl"
            disabled={createState === "creating"}
            onClick={handleCreateSession}
          >
            {createState === "creating" ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <MessageSquarePlus className="size-4" aria-hidden="true" />}
            {createState === "creating" ? "Creating..." : createError ? "Try again" : "Create Session"}
          </Button>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border/80 bg-card/95 shadow-sm backdrop-blur">
        <CardHeader>
          <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <UsersRound className="size-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <CardTitle className="text-lg text-card-foreground">Join Session</CardTitle>
              <CardDescription className="mt-2 leading-6">
                Enter a code and choose your display name next.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form className="space-y-3" onSubmit={handleJoinSession}>
            <div className="relative">
              <Hash className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <Input
                value={code}
                onChange={(event) => {
                  setCode(normalizeCode(event.target.value))
                  setJoinState("idle")
                }}
                className="h-11 rounded-xl bg-background pl-9 font-mono text-base uppercase tracking-normal"
                placeholder="A7K9"
                aria-label="Session code"
                aria-invalid={joinState === "invalid"}
              />
            </div>
            {joinMessage ? (
              <p className="flex items-center gap-2 text-sm text-destructive">
                <AlertCircle className="size-4" aria-hidden="true" />
                {joinMessage}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">Codes are short and expire with the room.</p>
            )}
            <Button type="submit" variant="outline" className="h-11 w-full rounded-xl" disabled={joinState === "joining"}>
              {joinState === "joining" ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <ArrowRight className="size-4" aria-hidden="true" />}
              {joinState === "joining" ? "Checking..." : "Join Session"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
