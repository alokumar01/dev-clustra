"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import {
  loginWithAxios,
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
import { Separator } from "@/components/ui/separator";
import { AuthShell } from "@/components/ui/auth-shell";
import { toast } from "sonner";
import Link from "next/link";
import { Spinner } from "@/components/ui/spinner";
import { useAuthStore } from "@/store/authStore";
import { useSearchParams } from "next/navigation";
import { getPendingAction } from "@/lib/pendingAction";

// test path name from login page if user comes from invite page already

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showVerifyUI, setShowVerifyUI] = useState(false);
  // const getMe = useAuthStore((store) => store.getMe);
  const login = useAuthStore((store) => store.login);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);

    try {
      // const response = await loginWithAxios(formData);
      const response = await login(formData);
      toast.success(response?.message);
      // await getMe(); // after login it should check for pending action // RACE CONDITION getMe called twice

      const pendingAction = getPendingAction();
      console.log("pending action in login page:", pendingAction);

      if (pendingAction && pendingAction.type === "JOIN_INVITE") {
        router.push(`/invite/${pendingAction.payload.token}`);
        return;
      } else {
        const redirect = searchParams.get("redirect");
        router.push(redirect || "/chat");
      }


    } catch (submitError) {
      const data = submitError.response?.data;

      if (data?.code === "EMAIL_NOT_VERIFIED") {
        toast.error(data.message);
        setShowVerifyUI(true);
      } else {
        toast.error(data?.message || "Login failed");
      }
    } finally {
      setLoading(false);
    }
  }

  //handle the resend verification button link
  async function handleResendVerification() {
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
      toast.error(
        err.response?.data?.message || "Failed to send verification mail",
      );
    }
  }

  return (
    <AuthShell
      badge="Welcome back"
      title="Sign in to DevClustra"
      description="Use your verified account to continue to the collaboration workspace."
      alternatePrompt="Don't have an account yet?"
      alternateHref="/signup"
      alternateLabel="Create one"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <FieldSet>
          <FieldGroup className="gap-4">
            <Field>
              <FieldLabel htmlFor="email">Email address</FieldLabel>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
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
                <Link href="/forgot-password" className="text-sm font-medium text-muted-foreground underline-offset-4 transition hover:text-foreground hover:underline">
                  Forgot password?
                </Link>
              </div>
            </Field>

          </FieldGroup>
        </FieldSet>

        {showVerifyUI && (
          <FieldError className="rounded-xl border border-destructive/20 bg-destructive/5 p-3 leading-6">
            Please verify your account before signing in.{" "}
            <Button
              type="button"
              variant="link"
              className="h-auto p-0 text-blue-600 underline"
              onClick={handleResendVerification}
            >
              Resend verification email
            </Button>
          </FieldError>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="h-11 w-full cursor-pointer rounded-xl text-sm font-semibold"
        >
          {loading ? <Spinner /> : "Sign in"}
          <ArrowRight className="size-4" />
        </Button>

        <Separator />


      </form>
    </AuthShell>
  );
}
