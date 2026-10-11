"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowRight,
  CircleAlert,
  Loader2,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";

import {
  joinSession,
  verifySessionCode,
} from "@/app/services/session.service";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { savePendingAction } from "@/lib/pendingAction";
import SessionShell from "../components/SessionShell";
import TempChatRoom from "../components/TempChatRoom";
import AuthCheckSession from "../store/CheckSession";



export default function SessionJoin({ params }) {
  const { code } = use(params);
  const router = useRouter();
  const [status, setStatus] = useState("verifying");
  const [displayName, setDisplayName] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [verificationAttempt, setVerificationAttempt] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [joinError, setJoinError] = useState("");
  const [session, setSession] = useState(null);
  const [joinedSession, setJoinedSession] = useState(null);

  // VERIFY THE SESSION CODE
  useEffect(() => {
    let isMounted = true;

    async function verifySession() {
      if (!code) {
        if (isMounted) setStatus("invalid");
        return;
      }

      try {
        setStatus("verifying");
        setErrorMessage("");

        // VERIFY SEESION CODE EXIST AND IS ACTIVE
        const response = await verifySessionCode(code);
        if (!isMounted) return;

        if (!response?.data) {
          setStatus("invalid");
          return;
        }

        setSession(response.data);

        if (response?.data?.sessionStatus !== "ACTIVE") {
          setStatus("inactive");
          return;
        }

        // EXISTING PARTICIPANT
        // // Tell the user that we are restoring their previous chat identity.
        setStatus("restoring");

        // EXISTING PARTICIPANT
        const existingSession = AuthCheckSession(code);

        if (existingSession) {
          setJoinedSession(existingSession.payload);
          setStatus("joined");
          return;
        }


        // FIRST TIME USER COMES
        setStatus("ready");

      } catch (error) {
        if (!isMounted) return;

        const errorCode = error?.response?.data?.code;
        if (errorCode === "SESSION_EXPIRED") {
          setStatus("expired");
          return;
        }
        if (errorCode === "SESSION_CLOSED") {
          setStatus("inactive");
          return;
        }

        const message = error?.response?.data?.message;
        if (!error.response || error.response.status >= 500) {
          setStatus(typeof navigator !== "undefined" && !navigator.onLine ? "offline" : "verification-error");
          setErrorMessage(message || "Could not reach the session service. Check your connection and try again.");
        } else {
          setStatus("invalid");
          setErrorMessage(message || "This session link is invalid or can't be verified anymore.");
        }
      }
    }

    verifySession();

    return () => {
      isMounted = false;
    };
  }, [code, verificationAttempt]);

  // JOIN SESSION
  async function handleAcceptSession(event) {
    event?.preventDefault();

    if (!code || isJoining) return;
    setJoinError("");

    const name =
      displayName.trim() ||
      `Guest ${Math.floor(100 + Math.random() * 900)}`;

    try {
      setIsJoining(true);
      setStatus("joining");

      const response = await joinSession(code, name);

      if (!response?.success || !response?.data) {
        throw new Error(
          response?.message || "Unable to join the session."
        );
      }

      const payload = {
        token: response.data.token,
        user: response.data.user,
        sessionCode: code,
      };

      savePendingAction({
        type: "TEMP_CHAT_SESSION",
        payload,
      });

      setJoinedSession(payload);
      setStatus("joined");
    } catch (error) {
      setStatus("ready");
      const message = error?.response?.data?.message || error?.message || "Unable to join the session.";
      setJoinError(message);
      toast.error(message);
    } finally {
      setIsJoining(false);
    }
  }

  if (status === "joined" && joinedSession) {
    return (
      <SessionShell>
        <TempChatRoom
          sessionCode={joinedSession.sessionCode}
          user={joinedSession.user}
        />
      </SessionShell>
    );
  }

  if (status === "verifying") {
    return (
      <CenteredSessionState
        icon={<Loader2 className="size-6 animate-spin" />}
        title="Checking session"
        description="Checking your link before you join."
      />
    );
  }

  if (status === "restoring") {
    return (
      <CenteredSessionState
        icon={<Loader2 className="size-6 animate-spin" />}
        title="Reconnecting to chat"
        description="Restoring your temporary chat session."
      />
    );
  }

  if (status === "invalid") {
    return (
      <CenteredSessionState
        icon={<CircleAlert className="size-6" />}
        tone="danger"
        title="Session unavailable"
        description={errorMessage || "This session link is invalid or can't be verified anymore."}
        action={
          <Button variant="outline" className="mt-6 rounded-lg" onClick={() => router.push("/session")}>
            Back to sessions
          </Button>
        }
      />
    );
  }

  if (status === "offline" || status === "verification-error") {
    return (
      <CenteredSessionState
        icon={<CircleAlert className="size-6" />}
        title={status === "offline" ? "You’re offline" : "Could not check this session"}
        description={errorMessage || "Check your connection and try again."}
        action={
          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <Button onClick={() => setVerificationAttempt((attempt) => attempt + 1)}>
              Try again
            </Button>
            <Button variant="outline" onClick={() => router.push("/session")}>
              Back to sessions
            </Button>
          </div>
        }
      />
    );
  }

  if (status === "inactive") {
    return (
      <CenteredSessionState
        icon={<CircleAlert className="size-6" />}
        title="Session ended"
        description="This temporary chat is no longer active."
        action={
          <Button variant="outline" className="mt-6 rounded-lg" onClick={() => router.push("/session")}>
            Back to sessions
          </Button>
        }
      />
    );
  }

  if (status === "expired") {
    return (
      <CenteredSessionState
        icon={<CircleAlert className="size-6" />}
        tone="danger"
        title="Session expired"
        description="This temporary chat has expired and can no longer be joined."
        action={
          <Button variant="outline" className="mt-6 rounded-lg" onClick={() => router.push("/session")}>
            Back to sessions
          </Button>
        }
      />
    );
  }

  if (status === "joining") {
    return (
      <CenteredSessionState
        icon={<Loader2 className="size-6 animate-spin" />}
        title="Joining chat"
        description="Getting the room ready for you."
      />
    );
  }

  return (
    <SessionShell>
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-7xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md rounded-2xl border-border/80 bg-card/95 shadow-lg shadow-primary/5 backdrop-blur motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-300 motion-reduce:animate-none">
          <CardHeader className="px-6 pb-2 pt-8 text-center sm:px-8">
            <div className="mx-auto mb-5 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <MessageCircle className="size-6" />
            </div>

            <CardTitle className="text-2xl font-semibold tracking-tight text-card-foreground">
              Join Temp Chat
            </CardTitle>

            <CardDescription className="mx-auto mt-2 max-w-sm leading-6">
              Choose how people will see you in this room.
            </CardDescription>
          </CardHeader>

          <CardContent className="px-6 pb-8 pt-6 sm:px-8">
            <form onSubmit={handleAcceptSession} className="space-y-5">
              {joinError && (
                <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm leading-6 text-destructive">
                  {joinError}
                </p>
              )}
              <div className="space-y-2">
                <Label htmlFor="display-name">Display name</Label>

                <Input
                  id="display-name"
                  value={displayName}
                  onChange={(event) =>
                    setDisplayName(event.target.value)
                  }
                  placeholder="Alex"
                  maxLength={40}
                  autoComplete="nickname"
                  autoFocus
                  disabled={isJoining}
                  className="h-11 rounded-xl bg-background"
                />

                <p className="text-xs leading-5 text-muted-foreground">
                  Optional. A guest name will be assigned if this is blank.
                </p>
              </div>

              <Button
                type="submit"
                className="h-11 w-full rounded-xl"
                disabled={isJoining}
              >
                {isJoining ? "Joining..." : joinError ? "Try joining again" : "Join Chat"}
                <ArrowRight className="size-4" />
              </Button>
            </form>

            <div className="mt-7 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="size-3.5" />
              <span>Session code {session?.code || code}</span>
            </div>
          </CardContent>
        </Card>
      </section>
    </SessionShell>
  );
}

function CenteredSessionState({
  icon,
  title,
  description,
  action,
  tone = "default",
}) {
  return (
    <SessionShell>
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-7xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md rounded-2xl border-border/80 bg-card/95 shadow-lg shadow-primary/5 backdrop-blur motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-300 motion-reduce:animate-none">
          <CardContent className="flex flex-col items-center px-6 py-12 text-center">
            <div className={tone === "danger" ? "mb-5 flex size-12 items-center justify-center rounded-xl bg-destructive/10 text-destructive" : "mb-5 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary"}>
              {icon}
            </div>

            <CardTitle className="text-xl text-card-foreground">
              {title}
            </CardTitle>

            <CardDescription className="mt-2 max-w-sm leading-6">
              {description}
            </CardDescription>

            {action}
          </CardContent>
        </Card>
      </section>
    </SessionShell>
  );
}
