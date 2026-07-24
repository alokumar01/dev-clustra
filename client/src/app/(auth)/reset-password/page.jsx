"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { resetPassword } from "@/app/services/auth.service";
import { AuthShell } from "@/components/ui/auth-shell";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Spinner } from "@/components/ui/spinner";

export default function ResetPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const passwordsDoNotMatch =
    confirmPassword.length > 0 && password !== confirmPassword;
  const tokenMissing = !token;

  async function handleSubmit(event) {
    event.preventDefault();

    if (tokenMissing) {
      toast.error("Reset token is missing. Request a new password reset link.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await resetPassword(token, password);
      toast.success(response?.message || "Password reset successfully.");
      router.push("/login");
    } catch (submitError) {
      toast.error(
        submitError.response?.data?.message ||
          "Unable to reset your password. Request a new link and try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      badge="Set new password"
      title="Create a new password"
      description="Enter and confirm your new password to complete the reset flow."
      alternatePrompt="Need a new reset link?"
      alternateHref="/forgot-password"
      alternateLabel="Request one"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <FieldSet>
          <FieldGroup className="gap-4">
            <Field>
              <FieldLabel htmlFor="password">New password</FieldLabel>
              <PasswordInput
                id="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter a new password"
                inputClassName="h-11 rounded-xl bg-background"
              />
              <FieldDescription>Use at least 8 characters.</FieldDescription>
            </Field>

            <Field data-invalid={passwordsDoNotMatch}>
              <FieldLabel htmlFor="confirm-password">Confirm password</FieldLabel>
              <PasswordInput
                id="confirm-password"
                autoComplete="new-password"
                required
                minLength={8}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Re-enter the new password"
                aria-invalid={passwordsDoNotMatch}
                inputClassName="h-11 rounded-xl bg-background"
              />
              {passwordsDoNotMatch && <FieldError>Passwords do not match.</FieldError>}
            </Field>
          </FieldGroup>
        </FieldSet>

        {tokenMissing && (
          <FieldError className="rounded-xl border border-destructive/20 bg-destructive/5 p-3 leading-6">
            Reset token is missing.{" "}
            <Link href="/forgot-password" className="font-medium underline underline-offset-4">
              Request a new link.
            </Link>
          </FieldError>
        )}

        <Button
          type="submit"
          disabled={loading || tokenMissing || passwordsDoNotMatch}
          className="h-11 w-full rounded-xl text-sm font-semibold"
        >
          {loading ? <Spinner /> : "Reset password"}
          <ArrowRight className="size-4" />
        </Button>
      </form>
    </AuthShell>
  );
}
