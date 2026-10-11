"use client";

import { ArrowRight, CheckCircle2, RefreshCw, XCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { verifyVerificationEmail } from "@/app/services/auth.service";
import { AuthShell } from "@/components/ui/auth-shell";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export default function VerifyEmail() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Verifying your email address.");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;

    async function verify() {
      if (!token) {
        if (active) {
          setStatus("invalid");
          setMessage("Verification token is missing.");
        }
        return;
      }

      try {
        setStatus("loading");

        const response = await verifyVerificationEmail(token);
        if (!active) return;

        setStatus("success");
        setMessage(response?.data?.message || "Your email has been verified.");
        toast.success(response?.data?.message || "Your email has been verified.");
      } catch (error) {
        if (!active) return;
        const errorMessage =
          error.response?.data?.message ||
          "Verification failed or the link has expired.";

        const code = error.response?.data?.code;
        if (!error.response || error.response.status >= 500) {
          setStatus(typeof navigator !== "undefined" && !navigator.onLine ? "offline" : "retry");
        } else if (code?.includes("EXPIRED") || /expired/i.test(errorMessage)) {
          setStatus("expired");
        } else {
          setStatus("invalid");
        }
        setMessage(errorMessage);

        toast.error(errorMessage);
      }
    }

    verify();
    return () => {
      active = false;
    };
  }, [attempt, token]);

  const isLoading = status === "loading";
  const isSuccess = status === "success";
  const canRetry = status === "retry" || status === "offline";
  const StatusIcon = isLoading ? Spinner : isSuccess ? CheckCircle2 : XCircle;

  return (
    <AuthShell
      badge="Email verification"
      title={isSuccess ? "Email verified" : isLoading ? "Verifying email" : status === "expired" ? "Verification link expired" : status === "offline" ? "You’re offline" : status === "retry" ? "Could not verify email" : "Verification failed"}
      description={
        isSuccess
          ? "Your account is ready for login."
          : isLoading
            ? "we're verifying your email"
            : status === "expired"
              ? "Request a new verification email to activate your account."
              : status === "offline" || status === "retry"
                ? "Check your connection and retry verification."
                : "The verification link is invalid."
      }
      heroTitle="Email verification keeps the account flow explicit."
      heroDescription="The verification route reads the token from the URL, calls the backend verification API, and shows a clear result state."

      alternatePrompt="Already verified?"
      alternateHref="/login"
      alternateLabel="Sign in"
    >
      <div className="space-y-5 text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-border bg-secondary/70">
          <StatusIcon className={isSuccess ? "size-7 text-green-600" : isLoading ? "size-6" : "size-7 text-destructive"} />
        </div>
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-foreground">{message}</h2>
          <p className="text-sm leading-6 text-muted-foreground">
            {isSuccess
              ? "You can now sign in with your email and password."
              : isLoading
                ? "This usually takes a moment."
                : status === "expired" || status === "invalid"
                  ? "Request a new verification email from the login page."
                  : "Your account has not been changed. You can safely retry."}
          </p>
        </div>
        {canRetry && (
          <Button type="button" variant="outline" className="h-11 w-full rounded-xl text-sm font-semibold" onClick={() => setAttempt((current) => current + 1)}>
            <RefreshCw className="size-4" />
            Try verification again
          </Button>
        )}
        <Button asChild className="h-11 w-full rounded-xl text-sm font-semibold">
          <Link href="/login">
            {isSuccess ? "Go to login" : status === "expired" || status === "invalid" ? "Request a new email" : "Back to login"}
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </AuthShell>
  );
}
