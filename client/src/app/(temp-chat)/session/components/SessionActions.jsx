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
import { CreateSession } from "@/app/services/service.session"
import { useRouter } from "next/navigation"

function normalizeCode(value) {
  return value.replace(/[^a-z0-9]/gi, "").slice(0, 6).toUpperCase()
}

export default function SessionActions() {
  const [code, setCode] = useState("")
  const [createState, setCreateState] = useState("idle")
  const [joinState, setJoinState] = useState("idle")
  const router = useRouter();

  const joinMessage = useMemo(() => {
    if (joinState === "invalid") return "Enter a valid 6-character session code."
    return ""
  }, [joinState])

  // CREATE SESSION
  const handleCreateSession = async () => {
    if (createState === "creating") return

    setCreateState("creating")

    try {
      const res = await CreateSession();
      const url = res?.data?.url;

      if (url) {
        toast.success("Session Created Successfully!")
        router.push(url);
      } else {
        throw new Error("URL missing from API response");
      }

    } catch (error) {
      toast.error(
        error?.response?.data?.message
        || "SessionActions error while creating session"
      )
      setCreateState("idle")
    } finally {
      setCreateState((current) => current === "creating" ? "idle" : current)
    }
  }

  // JOIN SESSION BY CODE
  function handleJoinSession(e) {
    e.preventDefault()
    const normalizedCode = normalizeCode(code)

    if (normalizedCode.length !== 6) {
      setJoinState("invalid")
      return
    }

    setJoinState("joining")
    router.push(`/session/${normalizedCode}`)
  }

  return (
    <div className="grid gap-4">
      <Card className="rounded-lg border-zinc-200 bg-white shadow-sm dark:border-white/10 dark:bg-zinc-950">
        <CardHeader>
          <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-white/5 dark:text-white">
              <MessageSquarePlus className="size-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <CardTitle className="text-lg text-zinc-950 dark:text-white">Create Session</CardTitle>
              <CardDescription className="mt-2 leading-6">
                Start a room and share its invite code.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Button
            type="button"
            className="h-11 w-full rounded-lg bg-blue-600 text-white hover:bg-blue-700 dark:bg-white cursor-pointer dark:text-zinc-950 dark:hover:bg-zinc-200"
            disabled={createState === "creating"}
            onClick={handleCreateSession}
          >
            {createState === "creating" ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <MessageSquarePlus className="size-4" aria-hidden="true" />}
            {createState === "creating" ? "Creating..." : "Create Session"}
          </Button>
        </CardContent>
      </Card>

      <Card className="rounded-lg border-zinc-200 bg-white shadow-sm dark:border-white/10 dark:bg-zinc-950">
        <CardHeader>
          <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-green-50 text-green-600 dark:bg-white/5 dark:text-white">
              <UsersRound className="size-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <CardTitle className="text-lg text-zinc-950 dark:text-white">Join Session</CardTitle>
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
                className="h-11 rounded-lg border-zinc-200 bg-white pl-9 font-mono text-base uppercase tracking-normal dark:border-white/10 dark:bg-zinc-900"
                placeholder="A7K9Q2"
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
            <Button type="submit" variant="outline" className="h-11 w-full rounded-lg cursor-pointer border-zinc-200 bg-white dark:border-white/10 dark:bg-zinc-950" disabled={joinState === "joining"}>
              {joinState === "joining" ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <ArrowRight className="size-4" aria-hidden="true" />}
              {joinState === "joining" ? "Checking..." : "Join Session"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
