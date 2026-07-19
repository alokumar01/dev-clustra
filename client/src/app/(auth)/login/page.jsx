"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, KeyRound, ShieldCheck, Zap } from "lucide-react";
import {
  loginWithAxios,
  resendVerificationEmail,
} from "@/app/services/auth.service";
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
import { Separator } from "@/components/ui/separator";
import { AuthShell } from "@/components/ui/auth-shell";
import { toast } from "sonner";
import Link from "next/link";
import { Spinner } from "@/components/ui/spinner";
import { useAuthStore } from "@/store/authStore";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showVerifyUI, setShowVerifyUI] = useState(false);
  const getMe = useAuthStore((store) => store.getMe);

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
      const response = await loginWithAxios(formData);
      toast.success(response?.message);
      await getMe();

      const redirect = searchParams.get("redirect");

      router.push(redirect || "/chat");

    } catch (submitError) {
      // console.log(" full err: ", submitError)

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
      title="Sign in to your workspace"
      description="Access your projects, continue building, and connect to your backend auth flow from one clean place."
      heroTitle="A cleaner auth experience for fast-moving product teams."
      heroDescription="Login should feel focused and trustworthy. This refreshed flow keeps the form simple while giving the page enough structure to feel polished on desktop and mobile."
      highlights={[
        {
          icon: ShieldCheck,
          title: "Clear and reliable",
          description:
            "Simple validation states and clearer messaging reduce friction when something goes wrong.",
        },
        {
          icon: Zap,
          title: "Built for momentum",
          description:
            "Faster scanning, stronger hierarchy, and a layout that feels intentional instead of placeholder.",
        },
        {
          icon: KeyRound,
          title: "Ready for auth APIs",
          description:
            "Designed to support the backend login flow you already wired up without changing behavior.",
        },
      ]}
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
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="h-11 rounded-xl bg-background"
              />
              <div className="flex justify-end underline">
                <Link href="/forgot-password">Forgot Password</Link>
              </div>
            </Field>

          </FieldGroup>
        </FieldSet>

        {showVerifyUI && (
          <FieldError>
            Please verify your account First
            <Button
              type="button"
              variant="link"
              className="p-0 h-auto underline text-blue-600"
              onClick={handleResendVerification}
            >
              Resend verification email
            </Button>
          </FieldError>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="h-11 w-full rounded-xl text-sm font-semibold cursor-pointer"
        >
          {loading ? <Spinner /> : "Login"}
          <ArrowRight className="size-4" />
        </Button>

        <Separator />

        <p className="text-center text-sm leading-6 text-muted-foreground">
          {/* Secure access for your Dev Clustra workspace and connected projects. */}
        </p>
      </form>
    </AuthShell>
  );
}
