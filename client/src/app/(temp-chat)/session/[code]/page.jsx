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
  JoinSession,
  VerifySesssion,
} from "@/app/services/service.session";
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

        // VERIFY SEESION CODE EXIST AND IS ACTIVE
        const response = await VerifySesssion(code);
        // console.log("response: ", response)
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

        setStatus("invalid");

        toast.error(
          error?.response?.data?.message ||
            "Unable to verify this session."
        );
      }
    }

    verifySession();

    return () => {
      isMounted = false;
    };
  }, [code]);

  // JOIN SESSION
  async function handleAcceptSession(event) {
    event?.preventDefault();

    if (!code || isJoining) return;

    const name =
      displayName.trim() ||
      `Guest ${Math.floor(100 + Math.random() * 900)}`;

    try {
      setIsJoining(true);
      setStatus("joining");

      const response = await JoinSession(code, name);

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

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to join the session."
      );
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
        description="This session link is invalid or can't be verified anymore."
        action={
          <Button variant="outline" className="mt-6 rounded-lg" onClick={() => router.push("/session")}>
            Back to sessions
          </Button>
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
        <Card className="w-full max-w-md rounded-lg border-zinc-200 bg-white shadow-sm dark:border-white/10 dark:bg-zinc-950">
          <CardHeader className="px-6 pb-2 pt-8 text-center sm:px-8">
            <div className="mx-auto mb-5 flex size-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-white/5 dark:text-white">
              <MessageCircle className="size-6" />
            </div>

            <CardTitle className="text-2xl font-semibold tracking-normal text-zinc-950 dark:text-white">
              Join Temp Chat
            </CardTitle>

            <CardDescription className="mx-auto mt-2 max-w-sm leading-6">
              Choose how people will see you in this room.
            </CardDescription>
          </CardHeader>

          <CardContent className="px-6 pb-8 pt-6 sm:px-8">
            <form onSubmit={handleAcceptSession} className="space-y-5">
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
                  className="h-11 rounded-lg border-zinc-200 bg-white dark:border-white/10 dark:bg-zinc-900"
                />

                <p className="text-xs leading-5 text-muted-foreground">
                  Optional. A guest name will be assigned if this is blank.
                </p>
              </div>

              <Button
                type="submit"
                className="h-11 w-full rounded-lg bg-blue-600 text-white hover:bg-blue-700 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
                disabled={isJoining}
              >
                Join Chat
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
        <Card className="w-full max-w-md rounded-lg border-zinc-200 bg-white shadow-sm dark:border-white/10 dark:bg-zinc-950">
          <CardContent className="flex flex-col items-center px-6 py-12 text-center">
            <div className={tone === "danger" ? "mb-5 flex size-12 items-center justify-center rounded-lg bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-300" : "mb-5 flex size-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-white/5 dark:text-white"}>
              {icon}
            </div>

            <CardTitle className="text-xl text-zinc-950 dark:text-white">
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
