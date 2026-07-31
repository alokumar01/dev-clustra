"use client";

import { ArrowRight, CheckCircle2, MailCheck, ShieldCheck, XCircle } from "lucide-react";
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

  useEffect(() => {
    async function verify() {
      if (!token) {
        setStatus("error");
        setMessage("Verification token is missing.");
        return;
      }

      try {
        setStatus("loading");

        const response = await verifyVerificationEmail(token);

        setStatus("success");
        setMessage(response?.data?.message || "Your email has been verified.");
        toast.success(response?.data?.message || "Your email has been verified.")
      } catch (error) {
        const errorMessage =
          error.response?.data?.message ||
          "Verification failed or the link has expired.";

        setStatus("error");
        setMessage(errorMessage);

        toast.error(errorMessage);
      }
    }

    verify();
  }, [token]);

  const isLoading = status === "loading";
  const isSuccess = status === "success";
  const StatusIcon = isLoading ? Spinner : isSuccess ? CheckCircle2 : XCircle;

  return (
    <AuthShell
      badge="Email verification"
      title={isSuccess ? "Email verified" : isLoading ? "Verifying email" : "Verification failed"}
      description={
        isSuccess
          ? "Your account is ready for login."
          : isLoading
            ? "we're verifying your email"
            : "The verification link is invalid or has expired."
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
                : "Request a new verification email from the login page if the link is expired."}
          </p>
        </div>
        <Button asChild className="h-11 w-full rounded-xl text-sm font-semibold">
          <Link href="/login">
            {isSuccess ? "Go to login" : "Back to login"}
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </AuthShell>
  );
}
