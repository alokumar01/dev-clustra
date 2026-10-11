"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import {
  resendVerificationEmail,
} from "@/app/services/auth.service";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { AuthShell } from "@/components/ui/auth-shell";
import { toast } from "sonner";
import Link from "next/link";
import { Spinner } from "@/components/ui/spinner";
import { useAuthStore } from "@/store/authStore";
import { useSearchParams } from "next/navigation";
import { getPendingAction } from "@/lib/pendingAction";
import { logger } from "@/lib/logger";

function getSafeRedirect(redirect) {
  if (!redirect?.startsWith("/") || redirect.startsWith("//")) return "/chat";

  const destination = new URL(redirect, window.location.origin);
  if (destination.origin !== window.location.origin) return "/chat";

  return `${destination.pathname}${destination.search}${destination.hash}`;
}

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [resendingVerification, setResendingVerification] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showVerifyUI, setShowVerifyUI] = useState(false);
  const login = useAuthStore((store) => store.login);
  const registered = searchParams.get("registered") === "1";

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
    setErrorMessage("");
    if (name === "email") setShowVerifyUI(false);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      const response = await login({
        ...formData,
        email: formData.email.trim(),
      });
      toast.success(response?.message);

      const pendingAction = getPendingAction();
      if (pendingAction && pendingAction.type === "JOIN_INVITE") {
        router.push(`/invite/${pendingAction.payload.token}`);
      } else {
        const redirect = searchParams.get("redirect");
        router.push(getSafeRedirect(redirect));
      }
    } catch (submitError) {
      const data = submitError.response?.data;
      logger.warn("auth.login.failed", {
        area: "authentication",
        status: submitError.response?.status,
        code: data?.code,
      });

      if (data?.code === "EMAIL_NOT_VERIFIED") {
        setErrorMessage(data.message || "Please verify your account before signing in.");
        setShowVerifyUI(true);
      } else {
        const message = data?.message || "Login failed. Check your details and try again.";
        setErrorMessage(message);
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  }

  //handle the resend verification button link
  async function handleResendVerification() {
    setResendingVerification(true);
    try {
      const res = await resendVerificationEmail(formData.email);

      toast.success(
        res.message || "Verification link will be sent if your account exist.",
      );

      setFormData({
        email: "",
        password: "",
      });

      setShowVerifyUI(false);
    } catch (err) {
      const message = err.response?.data?.message || "Failed to send verification email.";
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setResendingVerification(false);
    }
  }

  return (
    <AuthShell
      badge="Welcome back"
      title="Sign in to Dev-Clustra"
      description="Use your verified account to continue to the collaboration workspace."
      alternatePrompt="Don't have an account yet?"
      alternateHref="/register"
      alternateLabel="Create one"
    >
      <form onSubmit={handleSubmit} className="space-y-5" aria-busy={loading}>
        {registered && (
          <p role="status" className="rounded-xl border border-emerald-600/20 bg-emerald-600/5 p-3 text-sm leading-6 text-emerald-700 dark:text-emerald-400">
            Account created. Check your email to verify it before signing in.
          </p>
        )}
        <FieldSet>
          <FieldGroup className="gap-4">
            <Field>
              <FieldLabel htmlFor="email">Email address</FieldLabel>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                spellCheck={false}
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="h-11 rounded-xl bg-background"
              />
              {/* <FieldDescription>
                Use the same email configured for your backend account.
              </FieldDescription> */}
            </Field>

            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <PasswordInput
                id="password"
                name="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                inputClassName="h-11 rounded-xl bg-background"
              />
              <div className="flex justify-end">
                <Link href="/forgot-password" className="min-h-11 inline-flex items-center text-sm font-medium text-muted-foreground underline-offset-4 transition hover:text-foreground hover:underline">
                  Forgot password?
                </Link>
              </div>
            </Field>

          </FieldGroup>
        </FieldSet>

        {errorMessage && (
          <FieldError role="alert" className="rounded-xl border border-destructive/20 bg-destructive/5 p-3 leading-6">
            {errorMessage}
          </FieldError>
        )}

        {showVerifyUI && (
          <FieldError className="rounded-xl border border-destructive/20 bg-destructive/5 p-3 leading-6">
            <Button
              type="button"
              variant="link"
              disabled={resendingVerification}
              className="h-auto p-0 text-blue-600 underline"
              onClick={handleResendVerification}
            >
              {resendingVerification ? "Sending verification email…" : "Resend verification email"}
            </Button>
          </FieldError>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="h-12 w-full rounded-xl text-sm font-semibold"
        >
          {loading ? <><Spinner /> Signing in…</> : <>Sign in<ArrowRight className="size-4" /></>}
        </Button>
      </form>
    </AuthShell>
  );
}
