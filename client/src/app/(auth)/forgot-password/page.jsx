"use client";

import { ArrowRight, KeyRound, MailCheck, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { forgotPassword } from "@/app/services/auth.service";
import { AuthShell } from "@/components/ui/auth-shell";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await forgotPassword(email);
      const successMessage =
        response?.message ||
        "If this account exists, a password reset link has been sent to your email.";

      setMessage(successMessage);
      setSubmitted(true);
      toast.success(successMessage);

      window.setTimeout(() => {
        router.push("/login");
      }, 1800);
    } catch (submitError) {
      toast.error(
        submitError?.response?.data?.message ||
          "Unable to send the reset link. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      badge="Password recovery"
      title={submitted ? "Check your email" : "Forgot password"}
      description={
        submitted
          ? "The next step has been sent to the email address you provided."
          : "Enter the email connected to your account."
      }
      // heroTitle="Recover access without changing the login flow."
      // heroDescription="Password recovery uses a reset-token email flow, then returns the user to the standard login screen."
      // highlights={[
      //   {
      //     icon: MailCheck,
      //     title: "Email reset link",
      //     description:
      //       "The reset request is handled by the existing forgot-password API.",
      //   },
      //   {
      //     icon: KeyRound,
      //     title: "Token-based reset",
      //     description:
      //       "The reset page reads the token from the URL before submitting the new password.",
      //   },
      //   {
      //     icon: ShieldCheck,
      //     title: "Session cleanup",
      //     description:
      //       "After password reset, existing refresh tokens are cleared by the backend service.",
      //   },
      // ]}
      alternatePrompt="Remember your password?"
      alternateHref="/login"
      alternateLabel="Sign in"
    >
      {!submitted ? (
        <form onSubmit={handleSubmit} className="space-y-5">
          <FieldSet>
            <FieldGroup className="gap-4">
              <Field>
                <FieldLabel htmlFor="email">Email address</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="h-11 rounded-xl bg-background"
                />
              </Field>
            </FieldGroup>
          </FieldSet>

          <Button type="submit" disabled={loading} className="h-11 w-full rounded-xl text-sm font-semibold cursor-pointer">
            {loading ? <Spinner /> : "Send reset link"}
            <ArrowRight className="size-4" />
          </Button>
        </form>
      ) : (
        <div className="space-y-4 rounded-2xl border border-border/70 bg-background/70 p-4 text-sm text-muted-foreground">
          <div className="flex items-start gap-3 font-medium text-foreground">
            <MailCheck className="mt-0.5 size-4 shrink-0 text-blue-600" />
            <span>{message}</span>
          </div>
          <Button
            type="button"
            variant="outline"
            className="h-11 w-full rounded-xl"
            onClick={() => router.push("/login")}
          >
            Go to login
            <ArrowRight className="size-4" />
          </Button>
        </div>
      )}
    </AuthShell>
  );
}
